import Cashfree from "../configs/cashfree.js";
import Order from "../models/orderModel.js";

// Create Payment Session
export const createPaymentSession = async (req, res, next) => {
    try {
        const { orderId, amount, customerPhone, customerName, customerEmail } = req.body;

        if (!orderId || !amount || !customerPhone) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const request = {
            order_amount: parseFloat(amount).toFixed(2),
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: customerPhone.replace(/[^0-9]/g, '') || "cust_123",
                customer_phone: customerPhone.replace(/[^0-9]/g, '').substring(0, 10) || "9999999999",
                customer_name: customerName || "Customer",
                customer_email: customerEmail || "customer@example.com"
            },
            order_meta: {
                return_url: `${process.env.RESTAURANT_URL || 'http://localhost:3000'}/verify-payment?order_id={order_id}`
            }
        };

        // Note: SDK v6 does not require the API version string as the first argument
        const response = await Cashfree.PGCreateOrder(request);

        res.status(200).json({
            success: true,
            payment_session_id: response.data.payment_session_id,
            order_id: response.data.order_id
        });
    } catch (error) {
        console.error("Cashfree Create Order Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to initiate payment",
            error: error.response?.data || error.message
        });
    }
};

// Verify Payment Status
export const verifyPayment = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        const response = await Cashfree.PGOrderFetchPayments(orderId);

        const payments = response.data;
        const successfulPayment = payments.find(p => p.payment_status === "SUCCESS");

        if (successfulPayment) {
            // Update order status in DB
            const order = await Order.findOneAndUpdate(
                { orderId },
                { paymentStatus: "paid" },
                { new: true }
            );

            return res.status(200).json({ success: true, message: "Payment verified successfully", order });
        } else {
            return res.status(400).json({ success: false, message: "Payment not successful or pending" });
        }
    } catch (error) {
        console.error("Cashfree Verify Payment Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
};