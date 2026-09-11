/**
 * pidgeService.js
 * Handles all communication with the Pidge Business Delivery API.
 * Verified against official Pidge Documentation (https://api-docs.pidge.in/).
 *
 * Supports Staging (https://store.dev.pidge.in) & Production (https://api.pidge.in)
 * Automatic token caching & refresh on 401.
 */

import axios from "axios";

const PIDGE_BASE_URL =
    process.env.NODE_ENV === "production"
        ? (process.env.PIDGE_BASE_URL_PROD || "https://api.pidge.in")
        : (process.env.PIDGE_BASE_URL_TEST || "https://store.dev.pidge.in");

// In-memory token cache
let _pidgeToken = null;
let _tokenFetchedAt = null;
const TOKEN_TTL_MS = 20 * 60 * 60 * 1000; // 20 hours

/**
 * Authenticate with Pidge vendor login
 * Endpoint: POST /v1.0/store/channel/vendor/login
 */
export const getPidgeToken = async (forceRefresh = false) => {
    const now = Date.now();
    const isExpired = !_tokenFetchedAt || (now - _tokenFetchedAt) > TOKEN_TTL_MS;

    if (!_pidgeToken || isExpired || forceRefresh) {
        console.log("[PIDGE] Fetching fresh authentication token...");
        const username = (process.env.PIDGE_USERNAME || "").toLowerCase().trim();
        const password = (process.env.PIDGE_PASSWORD || "").trim();

        const response = await axios.post(
            `${PIDGE_BASE_URL}/v1.0/store/channel/vendor/login`,
            { username, password },
            { headers: { "Content-Type": "application/json" } }
        );

        const token = response.data?.data?.token;
        if (token) {
            // Pidge returns "Bearer <token_hash>"
            _pidgeToken = token;
            _tokenFetchedAt = now;
            console.log("[PIDGE] Auth token obtained successfully.");
        } else {
            throw new Error(`Pidge login failed: ${response.data?.message || "No token in response"}`);
        }
    }
    return _pidgeToken;
};

/**
 * Helper to make authorized requests with automatic 401 retry
 */
export const pidgeRequest = async (config) => {
    try {
        const rawToken = await getPidgeToken();
        const authHeader = rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

        return await axios({
            ...config,
            baseURL: PIDGE_BASE_URL,
            headers: {
                ...config.headers,
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn("[PIDGE] 401 received — refreshing token and retrying...");
            const freshToken = await getPidgeToken(true);
            const authHeader = freshToken.startsWith("Bearer ") ? freshToken : `Bearer ${freshToken}`;

            return await axios({
                ...config,
                baseURL: PIDGE_BASE_URL,
                headers: {
                    ...config.headers,
                    Authorization: authHeader,
                    "Content-Type": "application/json",
                },
            });
        }
        throw error;
    }
};

const RESTAURANT_PICKUP = {
    address_line_1: process.env.RESTAURANT_ADDRESS || "Rz 45, Mangal Bazar Rd, Santosh Park, Uttam Nagar",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110059",
    latitude: parseFloat(process.env.RESTAURANT_LAT) || 28.617232,
    longitude: parseFloat(process.env.RESTAURANT_LNG) || 77.059219,
    name: "Shree Shyam Fast Food",
    phone: process.env.RESTAURANT_PHONE ? process.env.RESTAURANT_PHONE.replace(/[^0-9]/g, "").slice(-10) : "9560774819",
};

/**
 * 1. Create Order on Pidge
 * Endpoint: POST /v1.0/store/channel/vendor/order
 * Compliant with Pidge Core APIs specification.
 */
export const createPidgeOrder = async (orderData) => {
    try {
        const { customer, orderId, items, totals, paymentMethod } = orderData;

        // Clean customer phone (10 digits)
        const custPhone = customer?.phone
            ? customer.phone.replace(/[^0-9]/g, "").slice(-10)
            : "9999999999";

        // Clean customer address
        const custAddressLine = customer?.addressLine
            ? `${customer.addressLine}, ${customer.address}`
            : (customer?.address || "Address not provided");

        const payload = {
            sender_detail: {
                address: {
                    address_line_1: RESTAURANT_PICKUP.address_line_1,
                    city: RESTAURANT_PICKUP.city,
                    state: RESTAURANT_PICKUP.state,
                    country: RESTAURANT_PICKUP.country,
                    pincode: RESTAURANT_PICKUP.pincode,
                    latitude: RESTAURANT_PICKUP.latitude,
                    longitude: RESTAURANT_PICKUP.longitude,
                },
                name: RESTAURANT_PICKUP.name,
                mobile: RESTAURANT_PICKUP.phone,
            },
            poc_detail: {
                name: "Restaurant POC",
                mobile: RESTAURANT_PICKUP.phone,
            },
            trips: [
                {
                    source_order_id: String(orderId),
                    reference_id: `REF_${orderId}_${Date.now()}`,
                    bill_amount: Math.round(Number(totals?.grandTotal) || 0),
                    cod_amount: paymentMethod === "cash" ? Math.round(Number(totals?.grandTotal) || 0) : 0,
                    receiver_detail: {
                        address: {
                            address_line_1: custAddressLine,
                            city: customer?.city || "Delhi",
                            state: customer?.state || "Delhi",
                            country: "India",
                            pincode: customer?.pincode ? String(customer.pincode) : "110059",
                            latitude: parseFloat(customer?.latitude) || RESTAURANT_PICKUP.latitude,
                            longitude: parseFloat(customer?.longitude) || RESTAURANT_PICKUP.longitude,
                        },
                        name: customer?.name || "Customer",
                        mobile: custPhone,
                    },
                    products: (items || []).map((item) => ({
                        name: item.title,
                        quantity: Number(item.quantity) || 1,
                        price: Math.round(Number(item.unitPrice) || 0),
                    })),
                    order_category: "food",
                },
            ],
        };

        const response = await pidgeRequest({
            method: "POST",
            url: "/v1.0/store/channel/vendor/order",
            data: payload,
        });

        if (response.data?.data) {
            // Response format: { data: { "<source_order_id>": "<pidge_id>" } }
            const pidgeId = Object.values(response.data.data)[0];
            console.log(`[PIDGE] Order created. Internal ID: ${orderId} → Pidge ID: ${pidgeId}`);
            return { success: true, pidgeId, rawData: response.data.data };
        }

        return { success: false, error: response.data };
    } catch (error) {
        console.error("[PIDGE] createPidgeOrder Error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * 2. Get Serviceability Quotes (price & ETA across delivery partners)
 * Endpoint: GET /v1.0/store/channel/vendor/order/fulfillment/services?ids=:pidgeId
 */
export const getPidgeQuotes = async (pidgeId) => {
    try {
        const response = await pidgeRequest({
            method: "GET",
            url: `/v1.0/store/channel/vendor/order/fulfillment/services?ids=${pidgeId}`,
        });

        const items = response.data?.data?.items || [];
        if (items.length > 0) {
            const quotes = items.map((q) => ({
                service: q.service,
                networkId: String(q.network_id),
                networkName: q.network_name || q.service,
                price: q.quote?.price || 0,
                basePrice: q.quote?.price_breakup?.base_delivery_charge || 0,
                gst: q.quote?.price_breakup?.total_gst_amount || 0,
                etaPickup: q.quote?.eta?.pickup || null,
                etaDrop: q.quote?.eta?.drop || null,
                token: q.token,
            }));

            // Sort by price ascending (cheapest partner first)
            quotes.sort((a, b) => a.price - b.price);

            return { success: true, quotes, rawCount: items.length };
        }

        return { success: false, error: "No serviceability quotes available for this location" };
    } catch (error) {
        console.error("[PIDGE] getPidgeQuotes Error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * 3. Fulfill Order (allocate to selected delivery network)
 * Endpoint: POST /v1.0/store/channel/vendor/order/fulfill
 */
export const fulfillPidgeOrder = async ({ pidgeId, token, service, networkId }) => {
    try {
        const payload = {
            ids: [pidgeId],
            service: service,
            pickup_now: true,
            token: token,
            network_id: String(networkId),
        };

        const response = await pidgeRequest({
            method: "POST",
            url: "/v1.0/store/channel/vendor/order/fulfill",
            data: payload,
        });

        console.log(`[PIDGE] Order ${pidgeId} fulfilled with ${service}.`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("[PIDGE] fulfillPidgeOrder Error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * 4. Cancel Order
 * Endpoint: POST /v1.0/store/channel/vendor/:id/cancel
 */
export const cancelPidgeOrder = async (pidgeId) => {
    try {
        const response = await pidgeRequest({
            method: "POST",
            url: `/v1.0/store/channel/vendor/${pidgeId}/cancel`,
            data: {},
        });
        console.log(`[PIDGE] Order ${pidgeId} cancelled successfully.`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("[PIDGE] cancelPidgeOrder Error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * 5. Get Order Status (Polling fallback)
 * Endpoint: GET /v1.0/store/channel/vendor/order/:id
 */
export const getPidgeOrderStatus = async (pidgeId) => {
    try {
        const response = await pidgeRequest({
            method: "GET",
            url: `/v1.0/store/channel/vendor/order/${pidgeId}`,
        });

        if (response.data?.data) {
            const order = response.data.data;
            return {
                success: true,
                parentStatus: order.status,
                fulfillmentStatus: order.fulfillment?.status || null,
                rider: {
                    name: order.fulfillment?.rider?.name || null,
                    phone: order.fulfillment?.rider?.mobile || null,
                },
                trackingCode: order.fulfillment?.track_code || null,
            };
        }
        return { success: false, error: "Order details not found" };
    } catch (error) {
        console.error("[PIDGE] getPidgeOrderStatus Error:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

/**
 * 6. Get Live Rider Location & Tracking
 * Endpoint: GET /v1.0/store/channel/vendor/order/:id/fulfillment/tracking
 */
export const getPidgeRiderTracking = async (pidgeId) => {
    try {
        const response = await pidgeRequest({
            method: "GET",
            url: `/v1.0/store/channel/vendor/order/${pidgeId}/fulfillment/tracking`,
        });
        return { success: true, data: response.data?.data };
    } catch (error) {
        console.error("[PIDGE] getPidgeRiderTracking Error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * 7. Simulate Webhook Event (STAGING ONLY)
 * Endpoint: POST /v1.0/store/channel/vendor/order/:id/webhook/events
 */
export const simulatePidgeWebhook = async (pidgeId, dummyStatus = "fulfilled|out for delivery") => {
    try {
        const response = await pidgeRequest({
            method: "POST",
            url: `/v1.0/store/channel/vendor/order/${pidgeId}/webhook/events`,
            data: { dummy_status: dummyStatus },
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("[PIDGE] simulatePidgeWebhook Error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};
