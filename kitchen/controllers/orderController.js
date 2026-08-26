import Order from "../models/orderModel.js";

// Customer places a new order
export const createOrder = async (req, res, next) => {
    try {
        const { customer, items, orderType, paymentMethod, totals } = req.body;

        // Generate a random order ID (e.g. YK-12345)
        const orderId = `YK-${Math.floor(10000 + Math.random() * 90000)}`;

        const newOrder = new Order({
            orderId,
            customer,
            items,
            orderType,
            paymentMethod,
            totals,
            status: "PLACED",
            paymentStatus: paymentMethod === "cash" ? "pending" : "paid"
        });

        await newOrder.save();

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
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// (Kitchen Panel) Get all orders
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(error);
    }
};

// (Kitchen Panel) Update order status
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, message: "Status updated", order });
    } catch (error) {
        next(error);
    }
};
