/**
 * pidgeWebhookController.js
 * Receives real-time delivery status updates from Pidge via webhooks.
 * Pidge calls this endpoint whenever rider/delivery status changes.
 *
 * Handles both production webhooks and sandbox dummy event simulations.
 */

import Order from "../models/orderModel.js";
import { getIO } from "../configs/socket.js";

// Normalize Pidge status strings strictly to our valid internal order schema enums
const normalizePidgeStatus = (rawStatus) => {
    if (!rawStatus) return null;
    const s = String(rawStatus).toLowerCase();

    if (s.includes("delivered") && !s.includes("undelivered")) {
        return "DELIVERED";
    }
    if (
        s.includes("out for delivery") ||
        s.includes("ofd") ||
        s.includes("picked up") ||
        s.includes("out for pickup") ||
        s.includes("reached") ||
        s.includes("in_transit")
    ) {
        return "OUT_FOR_DELIVERY";
    }
    if (s.includes("cancel") || s.includes("undelivered") || s.includes("rto") || s.includes("disposed")) {
        return "CANCELLED";
    }
    if (s.includes("created") || s.includes("registered") || s.includes("assigned") || s.includes("accepted")) {
        return "CONFIRMED";
    }
    return null;
};

/**
 * POST /api/webhook/pidge
 * Pidge webhook listener
 */
export const handlePidgeWebhook = async (req, res) => {
    try {
        // Enforce secret validation if configured
        const webhookSecret = process.env.PIDGE_WEBHOOK_SECRET;
        const providedSecret =
            req.query?.secret ||
            req.headers["x-webhook-secret"] ||
            (req.headers["authorization"]?.startsWith("Bearer ")
                ? req.headers["authorization"].replace("Bearer ", "")
                : null);

        if (webhookSecret && (!providedSecret || providedSecret !== webhookSecret)) {
            console.warn("[PIDGE WEBHOOK] Unauthorized webhook attempt. Invalid or missing secret.");
            return res.status(401).json({ error: "Unauthorized: Invalid or missing secret" });
        }

        const payload = req.body || {};
        console.log("[PIDGE WEBHOOK] Received payload:", JSON.stringify(payload, null, 2));

        // Acknowledge immediately with 200 OK so Pidge does not retry
        res.status(200).json({ received: true });

        // Extract order identifier:
        const sourceOrderId =
            payload.dd_channel?.order_id ||
            payload.source_order_id ||
            payload.reference_id ||
            null;

        const pidgeId = payload.id || null;

        const rawStatus =
            payload.fulfillment?.status ||
            payload.status ||
            payload.dummy_status ||
            null;

        const riderData =
            payload.fulfillment?.rider ||
            payload.rider ||
            null;

        const trackCode = payload.fulfillment?.track_code || null;
        const trackingUrl =
            payload.fulfillment?.tracking_url ||
            payload.tracking_url ||
            (trackCode ? `https://track.pidge.in/${trackCode}` : null);

        // Locate order in MongoDB
        let query = null;
        if (sourceOrderId) {
            query = { $or: [{ orderId: sourceOrderId }, { externalOrderId: sourceOrderId }] };
        } else if (pidgeId) {
            query = { externalOrderId: pidgeId };
        }

        if (!query) {
            console.warn("[PIDGE WEBHOOK] Could not determine order ID from payload.");
            return;
        }

        const order = await Order.findOne(query);
        if (!order) {
            console.warn("[PIDGE WEBHOOK] Order not found in database for query:", query);
            return;
        }

        // Build updates
        const updateData = {};
        const normalized = normalizePidgeStatus(rawStatus);

        if (normalized) {
            updateData.status = normalized;
        }

        if (trackingUrl) {
            updateData.trackingUrl = trackingUrl;
        }

        if (riderData) {
            updateData.courierInfo = {
                name: riderData.name || order.courierInfo?.name || null,
                phone: riderData.mobile || riderData.phone || order.courierInfo?.phone || null,
                photo_url: riderData.photo || riderData.photo_url || order.courierInfo?.photo_url || null,
            };
        }

        const updatedOrder = await Order.findByIdAndUpdate(order._id, updateData, { returnDocument: 'after' });
        console.log(`[PIDGE WEBHOOK] Order ${order.orderId} updated -> Status: ${updatedOrder.status}`);

        // Emit real-time notification to client via Socket.io
        try {
            const io = getIO();
            const emittedTrackingUrl = updatedOrder.trackingUrl || `https://track.pidge.in/${trackCode}`;

            io.to(`order-${order.orderId}`).emit("order-status-update", {
                orderId: order.orderId,
                status: updatedOrder.status,
                courierInfo: updatedOrder.courierInfo,
                trackingUrl: emittedTrackingUrl,
                borzoTrackingUrl: emittedTrackingUrl,
            });

            io.to("kitchen-room").emit("order-updated", {
                orderId: order.orderId,
                status: updatedOrder.status,
                order: updatedOrder,
            });

            console.log(`[PIDGE WEBHOOK] Socket emitted to room order-${order.orderId} & kitchen-room`);
        } catch (socketError) {
            console.error("[PIDGE WEBHOOK] Socket emit error:", socketError.message);
        }

    } catch (error) {
        console.error("[PIDGE WEBHOOK] Unhandled Error:", error);
    }
};
