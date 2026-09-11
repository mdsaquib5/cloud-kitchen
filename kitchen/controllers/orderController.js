import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Order from "../models/orderModel.js";
import { routeDispatch, routeCancel, getQuotes } from "../services/deliveryRouter.js";
import { getPidgeOrderStatus } from "../services/pidgeService.js";
import { getIO } from "../configs/socket.js";

// Customer places a new order
export const createOrder = async (req, res, next) => {
    try {
        const { customer, items, orderType, paymentMethod, totals } = req.body;

        let userId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                if (decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
                    userId = decoded.id;
                }
            } catch (err) {
                console.log("Invalid token during checkout, proceeding as guest.");
            }
        }

        const orderId = `YK-${Math.floor(10000 + Math.random() * 90000)}`;

        const newOrder = new Order({
            userId,
            orderId,
            customer,
            items,
            orderType,
            paymentMethod,
            totals,
            status: paymentMethod === "cash" ? "PLACED" : "PENDING_PAYMENT",
            paymentStatus: "pending"
        });

        await newOrder.save();

        // Emit new order to kitchen KDS via socket ONLY if it's placed immediately (e.g. COD)
        // For online payment, it will be emitted once payment is confirmed via verify/webhook
        if (paymentMethod === "cash") {
            try {
                const io = getIO();
                io.to("kitchen-room").emit("new-order", newOrder);
            } catch (e) {
                console.error("[SOCKET] Could not emit new-order:", e.message);
            }
        }

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });
    } catch (error) {
        next(error);
    }
};

// Customer checks order status
export const getOrderById = async (req, res, next) => {
    try {
        let order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Local testing fallback: Since webhooks don't reach localhost, fetch courier info directly during polling
        if (process.env.NODE_ENV !== "production" && order.borzoOrderId && (!order.courierInfo || !order.courierInfo.name)) {
            const { getBorzoCourierInfo } = await import("../services/borzoService.js");
            const courierData = await getBorzoCourierInfo(order.borzoOrderId);
            
            if (courierData.success && courierData.courier && courierData.courier.name) {
                order = await Order.findOneAndUpdate(
                    { orderId: req.params.orderId },
                    {
                        courierInfo: {
                            name: courierData.courier.name,
                            phone: courierData.courier.phone,
                            photo_url: courierData.courier.photo_url,
                        }
                    },
                    { returnDocument: 'after' }
                );
            }
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// Customer gets live rider GPS tracking & telemetry (Pidge API + Realtime Coordinates)
export const getOrderLiveTracking = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            $or: [
                { orderId: req.params.orderId },
                ...(mongoose.Types.ObjectId.isValid(req.params.orderId) ? [{ _id: req.params.orderId }] : [])
            ]
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const restLat = parseFloat(process.env.RESTAURANT_LAT) || 28.617232;
        const restLng = parseFloat(process.env.RESTAURANT_LNG) || 77.059219;
        const custLat = parseFloat(order.customer?.latitude) || (restLat + 0.008);
        const custLng = parseFloat(order.customer?.longitude) || (restLng + 0.009);

        // If order is delivered or cancelled
        if (order.status === "DELIVERED") {
            return res.status(200).json({
                success: true,
                status: "DELIVERED",
                tracking: {
                    latitude: custLat,
                    longitude: custLng,
                    speed: 0,
                    etaDropMinutes: 0,
                    heading: 0,
                    isDelivered: true,
                    riderName: order.courierInfo?.name || "Delivery Rider",
                    trackingUrl: order.trackingUrl || null,
                }
            });
        }

        // Attempt live Pidge Tracking API if fulfilled via Pidge
        let liveData = null;
        if (order.deliveryPartner === "pidge" && order.externalOrderId) {
            try {
                const { getPidgeRiderTracking } = await import("../services/pidgeService.js");
                const pidgeRes = await getPidgeRiderTracking(order.externalOrderId);
                if (pidgeRes.success && pidgeRes.data) {
                    liveData = pidgeRes.data;
                }
            } catch (err) {
                console.warn("[LIVE TRACK] Pidge API error:", err.message);
            }
        }

        // Extract coordinates or fallback to realistic GPS calculation for Staging
        let currentLat = liveData?.latitude ? parseFloat(liveData.latitude) : null;
        let currentLng = liveData?.longitude ? parseFloat(liveData.longitude) : null;
        let speed = liveData?.speed ? Math.round(Number(liveData.speed)) : 24;
        let eta = liveData?.eta_drop_minutes ? Math.round(Number(liveData.eta_drop_minutes)) : 14;
        let heading = liveData?.heading ? Number(liveData.heading) : 45;

        // Realistic GPS simulation fallback for Staging/Sandbox where real physical rider does not move
        if (!currentLat || !currentLng) {
            const elapsedMins = order.dispatchedAt ? Math.max(1, Math.floor((Date.now() - new Date(order.dispatchedAt)) / 60000)) : 3;
            const progress = Math.min(0.88, 0.25 + (elapsedMins * 0.08)); // between 25% and 88% along the route
            currentLat = Number((restLat + (custLat - restLat) * progress).toFixed(6));
            currentLng = Number((restLng + (custLng - restLng) * progress).toFixed(6));
            eta = Math.max(2, Math.round(15 - elapsedMins * 1.2));
            speed = Math.floor(22 + (Date.now() % 7)); // fluctuating realistic speed 22-28 km/h
            heading = 48;
        }

        res.status(200).json({
            success: true,
            status: order.status,
            partner: order.deliveryPartner || "pidge",
            tracking: {
                latitude: currentLat,
                longitude: currentLng,
                speed,
                etaDropMinutes: eta,
                heading,
                isDelivered: false,
                riderName: order.courierInfo?.name || "Pidge Delivery Partner",
                riderPhone: order.courierInfo?.phone || null,
                riderPhoto: order.courierInfo?.photo_url || null,
                restaurantLocation: {
                    latitude: restLat,
                    longitude: restLng,
                    name: "Shree Shyam Fast Food"
                },
                customerLocation: {
                    latitude: custLat,
                    longitude: custLng,
                    address: order.customer?.address || "Delivery Address"
                },
                trackingUrl: order.trackingUrl || null,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        next(error);
    }
};

// (Kitchen Panel) Get all orders
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ status: { $ne: "PENDING_PAYMENT" } }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(error);
    }
};

// (Kitchen Panel) Update order status
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { returnDocument: 'after' }
        );
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Emit status update to customer tracking page and kitchen KDS
        try {
            const io = getIO();
            const trackingUrl = order.trackingUrl || order.borzoTrackingUrl || null;

            io.to(`order-${order.orderId}`).emit("order-status-update", {
                orderId: order.orderId,
                status: order.status,
                courierInfo: order.courierInfo,
                trackingUrl,
                borzoTrackingUrl: trackingUrl,
            });

            io.to("kitchen-room").emit("order-updated", {
                orderId: order.orderId,
                status: order.status,
                order,
            });
        } catch (e) {
            console.error("[SOCKET] Could not emit order-status-update:", e.message);
        }

        res.status(200).json({ success: true, message: "Status updated", order });
    } catch (error) {
        next(error);
    }
};

// (Kitchen Panel) Dispatch Borzo Rider
export const callBorzoRider = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.orderType !== "delivery") {
            return res.status(400).json({
                success: false,
                message: "Borzo rider is only for Home Delivery orders.",
            });
        }

        if (order.borzoOrderId) {
            return res.status(400).json({
                success: false,
                message: `Rider already dispatched. Borzo Order ID: ${order.borzoOrderId}`,
            });
        }

        console.log(`[BORZO] Dispatching rider for Order: ${order.orderId}`);

        const { dispatchBorzoRider } = await import("../services/borzoService.js");
        const borzoResult = await dispatchBorzoRider(order);

        if (!borzoResult.success) {
            return res.status(500).json({
                success: false,
                message: "Failed to dispatch Borzo rider. Please try again.",
                error: borzoResult.error,
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            {
                borzoOrderId:      borzoResult.borzoOrderId,
                borzoTrackingUrl:  borzoResult.borzoTrackingUrl,
                trackingUrl:       borzoResult.borzoTrackingUrl,
                borzoDispatchedAt: new Date(),
                status:            "OUT_FOR_DELIVERY",
            },
            { returnDocument: 'after' }
        );

        try {
            const io = getIO();
            io.to(`order-${order.orderId}`).emit("order-status-update", {
                orderId:          order.orderId,
                status:           "OUT_FOR_DELIVERY",
                courierInfo:      updatedOrder.courierInfo,
                trackingUrl:      borzoResult.borzoTrackingUrl,
                borzoTrackingUrl: borzoResult.borzoTrackingUrl,
            });
        } catch (e) {
            console.error("[SOCKET] Could not emit after Borzo dispatch:", e.message);
        }

        res.status(200).json({
            success: true,
            message: "Borzo rider dispatched successfully!",
            borzoOrderId:      borzoResult.borzoOrderId,
            borzoTrackingUrl:  borzoResult.borzoTrackingUrl,
            order:             updatedOrder,
        });
    } catch (error) {
        next(error);
    }
};

// (Kitchen Panel) Cancel Borzo Rider
export const cancelBorzoRider = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order || !order.borzoOrderId) {
            return res.status(400).json({
                success: false,
                message: "No active Borzo dispatch found for this order.",
            });
        }

        const { cancelBorzoOrder } = await import("../services/borzoService.js");
        const cancelResult = await cancelBorzoOrder(order.borzoOrderId);

        if (!cancelResult.success) {
            return res.status(500).json({
                success: false,
                message: "Failed to cancel Borzo rider.",
                error: cancelResult.error,
            });
        }

        await Order.findByIdAndUpdate(req.params.orderId, {
            status: "CANCELLED",
            borzoOrderId: null,
        });

        res.status(200).json({ success: true, message: "Borzo rider cancelled." });
    } catch (error) {
        next(error);
    }
};

// Customer gets their own orders
export const getUserOrders = async (req, res, next) => {
    try {
        // If user is static admin or id is not a valid Mongo ObjectId, return empty orders cleanly
        if (!req.user || !req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
            return res.status(200).json({ success: true, orders: [] });
        }
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(error);
    }
};

// (Kitchen Panel) Generic Dispatch — supports both Borzo and Pidge
export const dispatchRider = async (req, res, next) => {
    try {
        const { partner, pidgeFulfillmentData } = req.body; // partner: "borzo" | "pidge"

        if (!partner) {
            return res.status(400).json({ success: false, message: "Delivery partner not specified. Send 'partner' in body." });
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        if (order.orderType !== "delivery") return res.status(400).json({ success: false, message: "Rider dispatch is only for delivery orders." });
        if (order.deliveryPartner) return res.status(400).json({ success: false, message: `Rider already dispatched via ${order.deliveryPartner}.` });

        const result = await routeDispatch(order, partner, pidgeFulfillmentData || null);
        if (!result.success) return res.status(500).json({ success: false, message: "Failed to dispatch rider.", error: result.error });

        // Save generic delivery fields
        const updateData = {
            deliveryPartner: partner,
            externalOrderId: result.externalOrderId,
            trackingUrl:     result.trackingUrl,
            courierInfo:     result.courierInfo,
            dispatchedAt:    new Date(),
            deliveryCost:    result.deliveryCost,
            status:          "OUT_FOR_DELIVERY",
        };
        const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, updateData, { returnDocument: 'after' });

        try {
            const io = getIO();
            io.to(`order-${order.orderId}`).emit("order-status-update", {
                orderId: order.orderId,
                status: "OUT_FOR_DELIVERY",
                courierInfo: updatedOrder.courierInfo,
                trackingUrl: result.trackingUrl,
                borzoTrackingUrl: partner === "borzo" ? result.trackingUrl : null,
            });
            io.to("kitchen-room").emit("order-updated", {
                orderId: order.orderId,
                status: "OUT_FOR_DELIVERY",
                order: updatedOrder,
            });
        } catch (e) {
            console.error("[SOCKET] dispatchRider emit error:", e.message);
        }

        res.status(200).json({ success: true, message: `${partner} rider dispatched!`, order: updatedOrder });
    } catch (error) { next(error); }
};

// (Kitchen Panel) Get Pidge delivery quotes
export const getDeliveryQuotes = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        if (order.orderType !== "delivery") return res.status(400).json({ success: false, message: "Only delivery orders can get quotes." });

        const result = await getQuotes(order);
        if (!result.success) return res.status(500).json({ success: false, message: "Failed to get quotes.", error: result.error });

        // Save Pidge ID if newly created
        if (result.pidgeId && !order.externalOrderId) {
            await Order.findByIdAndUpdate(req.params.orderId, { externalOrderId: result.pidgeId });
        }

        res.status(200).json({ success: true, quotes: result.quotes, pidgeId: result.pidgeId });
    } catch (error) { next(error); }
};

// (Kitchen Panel) Generic Cancel — cancels via correct partner automatically
export const cancelRider = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order || !order.deliveryPartner) return res.status(400).json({ success: false, message: "No active delivery partner for this order." });

        const result = await routeCancel(order);
        if (!result.success) return res.status(500).json({ success: false, message: "Failed to cancel rider.", error: result.error });

        await Order.findByIdAndUpdate(req.params.orderId, { status: "CANCELLED", deliveryPartner: null });
        res.status(200).json({ success: true, message: "Rider cancelled." });
    } catch (error) { next(error); }
};
