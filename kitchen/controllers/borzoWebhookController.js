import Order from "../models/orderModel.js";
import { getIO } from "../configs/socket.js";

export const handleBorzoWebhook = async (req, res) => {
    try {
        // Borzo sometimes wraps the order object in an `order` property, or sends it directly.
        const borzoOrder = req.body.order || req.body; 
        const eventType = req.body.event_type || null;
        
        // Log webhook payload for debugging (Crucial for seeing what Borzo sent)
        console.log(`[BORZO WEBHOOK] Event: ${eventType}`, JSON.stringify(borzoOrder, null, 2));

        if (!borzoOrder || !borzoOrder.order_id) {
            console.error("[BORZO WEBHOOK] Invalid webhook payload missing order_id.");
            return res.status(400).send("Invalid webhook payload");
        }

        const externalOrderId = borzoOrder.order_id;
        const borzoStatus = borzoOrder.status;

        // Find the corresponding order in our DB
        const order = await Order.findOne({ externalOrderId, deliveryPartner: "borzo" });
        
        if (!order) {
            // Might be a test webhook from Borzo portal, or an order we didn't place
            return res.status(200).send("Order not found or not a Borzo order");
        }

        // Map Borzo status to our internal status
        // Borzo statuses: "new", "available", "active", "completed", "canceled", "delayed"
        let newStatus = order.status;
        
        if (borzoStatus === "completed") {
            newStatus = "DELIVERED";
        } else if (borzoStatus === "canceled") {
            newStatus = "CANCELLED";
        } else if (borzoStatus === "active") {
            newStatus = "OUT_FOR_DELIVERY"; // Rider picked up or assigned
        }

        // Update courier info if available
        let courierInfo = order.courierInfo || { name: null, phone: null, photo_url: null };
        if (borzoOrder.courier) {
            courierInfo.name = borzoOrder.courier.name || courierInfo.name;
            courierInfo.phone = borzoOrder.courier.phone || courierInfo.phone;
        }

        order.status = newStatus;
        order.courierInfo = courierInfo;
        
        // Mark as dispatched if not already
        if (borzoStatus === "active" && !order.dispatchedAt) {
            order.dispatchedAt = new Date();
        }

        await order.save();

        // Emit real-time update to customer and kitchen KDS
        try {
            const io = getIO();
            
            // Notify customer tracking page
            io.to(`order-${order.orderId}`).emit("order-status-update", {
                orderId: order.orderId,
                status: order.status,
                courierInfo: order.courierInfo,
                trackingUrl: order.trackingUrl
            });

            // Notify Kitchen dashboard
            io.to("kitchen-room").emit("order-updated", {
                orderId: order.orderId,
                status: order.status,
                order
            });
        } catch (socketErr) {
            console.error("[BORZO WEBHOOK] Socket emit error:", socketErr.message);
        }

        res.status(200).send("Webhook processed");
    } catch (error) {
        console.error("[BORZO WEBHOOK] Error processing webhook:", error);
        res.status(500).send("Internal Server Error");
    }
};
