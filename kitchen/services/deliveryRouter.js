/**
 * deliveryRouter.js
 * Central dispatcher for Shree Shyam Fast Food delivery operations.
 * Exclusively integrated with Pidge Delivery Network.
 */

import {
    createPidgeOrder,
    getPidgeQuotes,
    fulfillPidgeOrder,
    cancelPidgeOrder,
    getPidgeOrderStatus,
    getPidgeRiderTracking
} from "./pidgeService.js";

/**
 * Dispatch a rider via Pidge.
 * @param {Object} order - Full Mongoose order document
 * @param {string} partner - "pidge"
 * @param {Object} [pidgeFulfillmentData] - { token, service, networkId, price }
 * @returns {Object} { success, externalOrderId, trackingUrl, courierInfo, deliveryCost }
 */
export const routeDispatch = async (order, partner = "pidge", pidgeFulfillmentData = null) => {
    if (partner === "pidge") {
        let pidgeId = order.externalOrderId;

        // Step 1: Create Order on Pidge if not already created
        if (!pidgeId) {
            const createResult = await createPidgeOrder(order);
            if (!createResult.success) {
                return { success: false, error: createResult.error };
            }
            pidgeId = createResult.pidgeId;
        }

        // Step 2: If fulfillment quote data provided, fulfill order directly with chosen partner
        let deliveryCost = null;
        let trackingUrl = null;
        let courierInfo = { name: null, phone: null, photo_url: null };

        if (pidgeFulfillmentData) {
            const fulfillResult = await fulfillPidgeOrder({
                pidgeId,
                token: pidgeFulfillmentData.token,
                service: pidgeFulfillmentData.service,
                networkId: pidgeFulfillmentData.networkId,
            });
            if (!fulfillResult.success) {
                return { success: false, error: fulfillResult.error };
            }
            deliveryCost = pidgeFulfillmentData.price || null;

            // Fetch immediate post-fulfillment status to grab track_code & rider if already assigned
            try {
                const statusRes = await getPidgeOrderStatus(pidgeId);
                if (statusRes.success) {
                    if (statusRes.trackingCode) {
                        trackingUrl = `https://track.pidge.in/${statusRes.trackingCode}`;
                    }
                    if (statusRes.rider?.name) {
                        courierInfo.name = statusRes.rider.name;
                        courierInfo.phone = statusRes.rider.phone;
                    }
                }
            } catch (statusErr) {
                console.warn("[PIDGE] Post-fulfill status fetch notice:", statusErr.message);
            }
        }

        return {
            success: true,
            externalOrderId: pidgeId,
            trackingUrl,
            deliveryCost,
            courierInfo,
        };
    }

    return { success: false, error: `Unsupported delivery partner: ${partner}` };
};

/**
 * Cancel rider for the order on Pidge.
 * @param {Object} order - Full Mongoose order document
 */
export const routeCancel = async (order) => {
    if (order.deliveryPartner === "pidge" || order.externalOrderId) {
        return await cancelPidgeOrder(order.externalOrderId);
    }
    return { success: false, error: "No active Pidge delivery found for this order." };
};

/**
 * Get live price quotes from Pidge for partner comparison (cheapest first).
 * If order has not yet been registered on Pidge, registers it first to obtain quote token.
 * @param {Object} order - Full Mongoose order document
 */
export const getQuotes = async (order) => {
    let pidgeId = order.externalOrderId;

    if (!pidgeId) {
        const createResult = await createPidgeOrder(order);
        if (!createResult.success) {
            return { success: false, error: createResult.error };
        }
        pidgeId = createResult.pidgeId;
    }

    const quotesResult = await getPidgeQuotes(pidgeId);
    return { ...quotesResult, pidgeId };
};

/**
 * Get live rider tracking GPS and courier details
 * @param {Object} order - Full Mongoose order document
 */
export const getRiderTracking = async (order) => {
    if (!order.externalOrderId) {
        return { success: false, error: "No Pidge order ID associated with this order" };
    }
    return await getPidgeRiderTracking(order.externalOrderId);
};
