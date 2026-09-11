import crypto from "crypto";
import Cashfree from "../configs/cashfree.js";
import Order from "../models/orderModel.js";
import { getIO } from "../configs/socket.js";

// Create Payment Session
export const createPaymentSession = async (req, res, next) => {
    try {
        const { orderId, amount, customerPhone, customerName, customerEmail } = req.body;

        if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
            console.error("Cashfree credentials missing in .env");
            return res.status(500).json({ success: false, message: "Server misconfiguration: Payment gateway keys missing." });
        }

        if (!orderId || !amount || !customerPhone) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const request = {
            order_amount: Number(parseFloat(amount).toFixed(2)),
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

// Verify Payment Status (Polled or Redirect from frontend)
export const verifyPayment = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        const response = await Cashfree.PGOrderFetchPayments(orderId);
        const payments = response.data || [];
        const successfulPayment = payments.find(p => p.payment_status === "SUCCESS");

        if (successfulPayment) {
            // Update order status in DB
            const order = await Order.findOneAndUpdate(
                { orderId },
                { paymentStatus: "paid", status: "PLACED" },
                { returnDocument: 'after' }
            );

            if (order) {
                // Emit real-time notification to Kitchen KDS and customer tracking
                try {
                    const io = getIO();
                    io.to("kitchen-room").emit("new-order", order);
                    io.to(`order-${order.orderId}`).emit("order-status-update", {
                        orderId: order.orderId,
                        status: order.status,
                        paymentStatus: order.paymentStatus,
                    });
                    console.log(`⚡ [SOCKET] Emitted new paid order to kitchen: ${order.orderId}`);
                } catch (socketErr) {
                    console.error("[SOCKET] Verify payment emit error:", socketErr.message);
                }
            }

            return res.status(200).json({ success: true, message: "Payment verified successfully", order });
        } else {
            return res.status(400).json({ success: false, message: "Payment not successful or pending" });
        }
    } catch (error) {
        console.error("Cashfree Verify Payment Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
};

// Cashfree Webhook Handler (Instant background payment verification)
export const handleCashfreeWebhook = async (req, res, next) => {
    try {
        const signature = req.headers["x-webhook-signature"];
        const timestamp = req.headers["x-webhook-timestamp"];
        const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY;

        // If secret is configured and signature provided, verify signature
        if (webhookSecret && signature && timestamp) {
            const rawBody = JSON.stringify(req.body);
            const expectedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(timestamp + rawBody)
                .digest("base64");

            if (signature !== expectedSignature) {
                console.warn("[CASHFREE WEBHOOK] Signature mismatch.");
                // Proceed with cautious logging or return 401
            }
        }

        const payload = req.body || {};
        console.log("[CASHFREE WEBHOOK] Event received:", payload.type || payload.event);

        const orderId =
            payload.data?.order?.order_id ||
            payload.data?.order_id ||
            payload.orderId ||
            null;

        const paymentStatus =
            payload.data?.payment?.payment_status ||
            payload.data?.payment_status ||
            null;

        const isSuccess =
            paymentStatus === "SUCCESS" ||
            payload.type === "PAYMENT_SUCCESS_WEBHOOK";

        if (orderId && isSuccess) {
            const order = await Order.findOneAndUpdate(
                { orderId, status: "PENDING_PAYMENT" },
                { paymentStatus: "paid", status: "PLACED" },
                { returnDocument: 'after' }
            );

            if (order) {
                console.log(`[CASHFREE WEBHOOK] Order ${orderId} successfully marked PLACED via webhook.`);
                try {
                    const io = getIO();
                    io.to("kitchen-room").emit("new-order", order);
                    io.to(`order-${order.orderId}`).emit("order-status-update", {
                        orderId: order.orderId,
                        status: order.status,
                        paymentStatus: order.paymentStatus,
                    });
                } catch (socketErr) {
                    console.error("[SOCKET] Webhook emit error:", socketErr.message);
                }
            }
        }

        res.status(200).json({ success: true, message: "Webhook acknowledged" });
    } catch (error) {
        console.error("[CASHFREE WEBHOOK] Error processing webhook:", error);
        res.status(500).json({ success: false, message: "Webhook processing error" });
    }
};
