import { create } from "zustand";
import { toast } from "sonner";
import {
    getAllOrders,
    updateOrderStatus as apiUpdateOrderStatus,
    getOrderQuotes,
    dispatchOrder as apiDispatchOrder
} from "../services/orderService";

export const useKitchenStore = create((set, get) => ({
    orders: [],
    loading: true,
    todaysRevenue: 0,
    todaysOrders: 0,

    // Pidge Quotes Modal State
    quotesModalOpen: false,
    selectedOrderId: null,
    quotesLoading: false,
    availableQuotes: [],
    selectedQuoteIndex: null,

    fetchOrders: async () => {
        try {
            const res = await getAllOrders();
            const data = res.data;

            if (data.success) {
                // Map the backend orders to the KDS format
                const kdsOrders = (data.orders || []).map((o) => {
                    const placedTime = new Date(o.createdAt);
                    const now = new Date();
                    const diffMs = now - placedTime;
                    const elapsedMinutes = Math.floor(diffMs / 60000);

                    return {
                        id: o._id.substring(o._id.length - 6).toUpperCase(),
                        originalId: o._id,
                        orderId: o.orderId,
                        customerName: o.customer?.name || "Customer",
                        phone: o.customer?.phone || "N/A",
                        orderType: o.orderType || "delivery",
                        orderTime: elapsedMinutes + "m ago",
                        status: o.status, // PLACED, PREPARING, READY_FOR_PICKUP, OUT_FOR_DELIVERY, DELIVERED
                        urgent: elapsedMinutes > 10 && o.status === "PLACED",
                        items: (o.items || []).map((i) => ({
                            name: i.title,
                            portion: i.portionLabel || "Standard",
                            qty: i.quantity,
                            price: i.unitPrice || i.price,
                            addons: i.addons || [],
                            cookingNote: i.cookingNote || ""
                        })),
                        total: o.totals?.grandTotal || 0,
                        address: o.customer?.address || "No address provided",
                        notes: (o.items || []).map((i) => i.cookingNote).filter(Boolean).join(", "),
                        riderName: o.courierInfo?.name
                            ? `${o.courierInfo.name} (${o.deliveryPartner ? o.deliveryPartner.toUpperCase() : "PIDGE"})`
                            : null,
                        otp: null
                    };
                });

                // Keep only active kitchen cooking & counter orders for the KDS board (PLACED, PREPARING, READY_FOR_PICKUP)
                // Once handed over (OUT_FOR_DELIVERY to rider, or DELIVERED to takeaway/dine-in), it leaves KDS!
                const activeOrders = kdsOrders.filter((o) =>
                    o.status === "PLACED" ||
                    o.status === "PREPARING" ||
                    o.status === "READY_FOR_PICKUP"
                );

                // Calculate today's stats
                const today = new Date().setHours(0, 0, 0, 0);
                const todaysOrdersList = (data.orders || []).filter((o) => new Date(o.createdAt) >= today);
                const revenue = todaysOrdersList.reduce((acc, o) => acc + (o.totals?.grandTotal || 0), 0);

                set({
                    orders: activeOrders,
                    todaysOrders: todaysOrdersList.length,
                    todaysRevenue: revenue,
                    loading: false
                });
            }
        } catch (error) {
            console.error("Failed to fetch dashboard orders", error);
            // Suppress repeating toast if simply unauthorized (auth modal handles it)
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                toast.error("Failed to load live orders");
            }
            set({ loading: false });
        }
    },

    openQuotesModal: async (orderOriginalId) => {
        set({
            selectedOrderId: orderOriginalId,
            quotesModalOpen: true,
            quotesLoading: true,
            availableQuotes: [],
            selectedQuoteIndex: null
        });

        try {
            const res = await getOrderQuotes(orderOriginalId);
            const data = res.data;

            if (data.success && data.quotes) {
                set({ availableQuotes: data.quotes });
            } else {
                toast.error("Failed to fetch quotes: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            toast.error("Error fetching quotes");
        } finally {
            set({ quotesLoading: false });
        }
    },

    closeQuotesModal: () => {
        set({
            quotesModalOpen: false,
            selectedOrderId: null,
            quotesLoading: false,
            availableQuotes: [],
            selectedQuoteIndex: null
        });
    },

    setSelectedQuoteIndex: (index) => {
        set({ selectedQuoteIndex: index });
    },

    assignRider: async () => {
        const { selectedQuoteIndex, selectedOrderId, availableQuotes, fetchOrders, closeQuotesModal } = get();
        if (selectedQuoteIndex === null || !selectedOrderId) return;

        const quote = availableQuotes[selectedQuoteIndex];

        const payload = {
            partner: "pidge",
            pidgeFulfillmentData: {
                token: quote.token,
                service: quote.service,
                networkId: quote.networkId,
                price: quote.price
            }
        };

        try {
            const res = await apiDispatchOrder(selectedOrderId, payload);
            const data = res.data;

            if (data.success) {
                toast.success("Pidge Delivery Partner assigned successfully!");
                closeQuotesModal();
                fetchOrders();
            } else {
                toast.error("Failed to assign rider: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            toast.error("Error assigning rider");
        }
    },

    updateOrderStatus: async (orderId, nextStatus) => {
        const { orders, fetchOrders } = get();
        try {
            const orderToUpdate = orders.find((o) => o.id === orderId);
            if (!orderToUpdate) return;

            // Proper State Machine mapping:
            // "Food Ready" -> READY_FOR_PICKUP (waiting for rider or takeaway pickup)
            // "Handover Complete" -> DELIVERED (if takeaway/dine-in) or OUT_FOR_DELIVERY (if handed to delivery rider)
            let backendStatus = nextStatus;
            if (nextStatus === "READY") {
                backendStatus = "READY_FOR_PICKUP";
            } else if (nextStatus === "COMPLETED") {
                backendStatus = orderToUpdate.orderType === "delivery" ? "OUT_FOR_DELIVERY" : "DELIVERED";
            }

            const res = await apiUpdateOrderStatus(orderToUpdate.originalId, backendStatus);
            const data = res.data;

            if (data.success) {
                fetchOrders();
                if (backendStatus === "OUT_FOR_DELIVERY") {
                    toast.success(`Order #${orderId} handed over to rider! Moved to 3PL & Dispatch.`);
                } else if (backendStatus === "DELIVERED") {
                    toast.success(`Order #${orderId} handover complete! Marked as Delivered.`);
                } else {
                    toast.success(`Order #${orderId} moved to ${backendStatus.replace(/_/g, " ")}!`);
                }
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating order status");
        }
    }
}));
