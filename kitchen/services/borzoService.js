import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Helper to get Borzo API credentials from .env
 */
const getBorzoConfig = () => {
    return {
        baseURL: process.env.BORZO_API_URL || "https://robotapitest-in.borzodelivery.com/api/business/1.8",
        token: process.env.BORZO_AUTH_TOKEN
    };
};

/**
 * Format a 10-digit phone number for Borzo (requires +91 prefix).
 */
const formatBorzoPhone = (phone) => {
    let cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.length === 10) return `+91${cleanPhone}`;
    if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) return `+${cleanPhone}`;
    return `+91${cleanPhone.slice(-10)}`; // Fallback, extract last 10 digits
};

/**
 * Get pricing quotes for an order from Borzo.
 * Uses the /calculate-order endpoint.
 */
export const getBorzoQuote = async (order) => {
    const config = getBorzoConfig();
    if (!config.token) return { success: false, error: "Borzo token not configured." };

    try {
        const payload = {
            matter: `Food Order #${order.orderId}`,
            points: [
                {
                    address: process.env.RESTAURANT_ADDRESS || "Uttam Nagar, Delhi",
                    contact_person: { phone: formatBorzoPhone(process.env.RESTAURANT_PHONE || "9560774819") }
                },
                {
                    address: order.customer.addressLine || order.customer.address || "Delhi",
                    contact_person: { phone: formatBorzoPhone(order.customer.phone) }
                }
            ]
        };

        const res = await axios.post(`${config.baseURL}/calculate-order`, payload, {
            headers: { "X-DV-Auth-Token": config.token }
        });

        if (res.data.is_successful) {
            return {
                success: true,
                price: res.data.order.payment_amount,
                distance: res.data.order.delivery_fee_amount // Or another field depending on exact response
            };
        }
        return { success: false, error: "Failed to calculate quote." };
    } catch (err) {
        return { success: false, error: err.response?.data?.errors?.[0]?.message || err.message };
    }
};

/**
 * Dispatch (Create) an order on Borzo.
 * Uses the /create-order endpoint.
 */
export const dispatchBorzoRider = async (order) => {
    const config = getBorzoConfig();
    if (!config.token) return { success: false, error: "Borzo token not configured." };

    const pickupPhone = formatBorzoPhone(process.env.RESTAURANT_PHONE || "9560774819");
    const dropPhone = formatBorzoPhone(order.customer.phone);

    try {
        const payload = {
            matter: `Food Delivery #${order.orderId}`,
            total_weight_kg: 1, // Defaulting to 1kg for food
            vehicle_type_id: 8, // Motorbike
            points: [
                {
                    address: process.env.RESTAURANT_ADDRESS || "Uttam Nagar, Delhi, 110059",
                    contact_person: {
                        phone: pickupPhone,
                        name: "Shree Shyam Kitchen"
                    },
                    client_order_id: `${order.orderId}-pickup`,
                },
                {
                    address: order.customer.addressLine || order.customer.address || "Delhi",
                    contact_person: {
                        phone: dropPhone,
                        name: order.customer.name
                    },
                    client_order_id: `${order.orderId}-drop`,
                    ...(order.paymentMethod === "cash" && {
                        taking_amount: Number((order.totals?.grandTotal || order.grandTotal || 0).toFixed(2))
                    })
                }
            ]
        };

        const res = await axios.post(`${config.baseURL}/create-order`, payload, {
            headers: { "X-DV-Auth-Token": config.token }
        });

        if (res.data.is_successful && res.data.order) {
            const borzoOrder = res.data.order;
            let trackingUrl = `https://borzodelivery.com/in/order/${borzoOrder.order_id}`; // Basic fallback URL

            return {
                success: true,
                borzoOrderId: borzoOrder.order_id,
                trackingUrl: trackingUrl,
                price: borzoOrder.payment_amount
            };
        }

        return { success: false, error: "Borzo response unsuccessful" };
    } catch (err) {
        console.error("[BORZO] Dispatch error:", JSON.stringify(err.response?.data || err.message, null, 2));
        return { success: false, error: err.response?.data?.parameter_warnings?.join(", ") || err.response?.data?.errors?.[0]?.message || err.message };
    }
};

/**
 * Cancel a Borzo order.
 */
export const cancelBorzoOrder = async (borzoOrderId) => {
    const config = getBorzoConfig();
    if (!config.token) return { success: false, error: "Borzo token not configured." };

    try {
        const res = await axios.post(`${config.baseURL}/cancel-order`, { order_id: borzoOrderId }, {
            headers: { "X-DV-Auth-Token": config.token }
        });

        if (res.data.is_successful) {
            return { success: true };
        }
        return { success: false, error: "Cancel request was not successful." };
    } catch (err) {
        return { success: false, error: err.response?.data?.errors?.[0]?.message || err.message };
    }
};

/**
 * Get info about the courier (name, phone) and order status.
 */
export const getBorzoCourierInfo = async (borzoOrderId) => {
    const config = getBorzoConfig();
    if (!config.token) return { success: false, error: "Borzo token not configured." };

    try {
        const res = await axios.get(`${config.baseURL}/orders?order_id=${borzoOrderId}`, {
            headers: { "X-DV-Auth-Token": config.token }
        });

        if (res.data.is_successful && res.data.orders?.length > 0) {
            const orderData = res.data.orders[0];
            const courier = orderData.courier;

            return {
                success: true,
                status: orderData.status,
                courier: courier ? {
                    name: courier.name,
                    phone: courier.phone
                } : null
            };
        }

        return { success: false, error: "Could not fetch courier info." };
    } catch (err) {
        return { success: false, error: err.message };
    }
};
