import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackOrder } from "../services/orderService";

export const useStore = create(
    persist(
        (set, get) => ({
            cart: [],

            orderType: "delivery",
            pickupSlot: "15",
            tableNo: "T-04",
            selectedAddressId: 1,
            paymentMethod: "cash",
            appliedCoupon: null,
            discountAmount: 0,

            pastOrders: [],
            addPastOrder: (order) => set((state) => ({ pastOrders: [order, ...(state.pastOrders || [])] })),

            activeOrders: [],
            addActiveOrder: (order) => set((state) => {
                // Keep only currently ongoing/active orders + new order
                // Clean up any older orders that were already DELIVERED or CANCELLED (safely preserved in pastOrders)
                const activeOnly = (state.activeOrders || []).filter(
                    (o) => o.status && !["DELIVERED", "CANCELLED"].includes(o.status.toUpperCase())
                );
                const orderId = order.orderId || order.id || order._id;
                const exists = activeOnly.some(
                    (o) => (o.orderId && o.orderId === orderId) || (o.id && o.id === orderId) || (o._id && o._id === orderId)
                );
                return {
                    activeOrders: exists ? activeOnly : [...activeOnly, order]
                };
            }),
            updateActiveOrder: (orderId, latestData) => set((state) => ({
                activeOrders: (state.activeOrders || []).map(o => (o.id === orderId || o.orderId === orderId || o._id === orderId) ? { ...o, ...latestData } : o)
            })),
            removeActiveOrder: (orderId) => set((state) => ({
                activeOrders: (state.activeOrders || []).filter(o => o.id !== orderId && o.orderId !== orderId && o._id !== orderId)
            })),
            dismissActiveOrder: (orderId) => set((state) => ({
                activeOrders: (state.activeOrders || []).filter(o => o.id !== orderId && o.orderId !== orderId && o._id !== orderId)
            })),

            syncActiveOrders: async () => {
                const { activeOrders, updateActiveOrder, removeActiveOrder } = get();
                if (!activeOrders || activeOrders.length === 0) return;

                await Promise.all(activeOrders.map(async (order) => {
                    const idToFetch = order.orderId || order.id;
                    if (!idToFetch) return;

                    try {
                        const res = await trackOrder(idToFetch);
                        const data = res.data;
                        if (data.success && data.order) {
                            const latest = data.order;
                            // Update the order in state so the user sees real-time progress and final DELIVERED state
                            updateActiveOrder(idToFetch, {
                                status: latest.status,
                                rider: latest.rider || order.rider,
                                eta: latest.status === "DELIVERED" ? "Delivered" : (latest.eta || order.eta),
                                totals: latest.totals || order.totals,
                                courierInfo: latest.courierInfo || order.courierInfo,
                                deliveryPartner: latest.deliveryPartner || order.deliveryPartner,
                                trackingUrl: latest.trackingUrl || latest.borzoTrackingUrl || order.trackingUrl,
                                borzoTrackingUrl: latest.trackingUrl || latest.borzoTrackingUrl || order.borzoTrackingUrl,
                            });
                        }
                    } catch (error) {
                        if (error.response?.status === 404) {
                            removeActiveOrder(idToFetch);
                        }
                    }
                }));
            },

            setOrderType: (type) => set({ orderType: type }),
            setPickupSlot: (slot) => set({ pickupSlot: slot }),
            setTableNo: (no) => set({ tableNo: no }),
            setSelectedAddressId: (id) => set({ selectedAddressId: id }),
            setPaymentMethod: (method) => set({ paymentMethod: method }),

            addToCart: (product, customOptions = {}) => {
                const {
                    portion = "regular",
                    portionLabel = "Regular / Half",
                    portionExtra = 0,
                    addons = [],
                    cookingNote = "",
                    quantity = 1,
                } = customOptions;

                const basePrice = product.portions && product.portions.length > 0 ? product.portions[0].price : 50.00;
                const addonsPrice = addons.reduce((sum, item) => sum + (item.price || 0), 0);
                const itemUnitPrice = basePrice + portionExtra + addonsPrice;
                const cartItemId = `${product._id}-${portion}-${addons.map((a) => a.id || a._id || a.name).sort().join("-")}`;

                set((state) => {
                    const existingIndex = state.cart.findIndex((item) => (item.cartItemId || item._id) === cartItemId);
                    if (existingIndex > -1) {
                        const updatedCart = [...state.cart];
                        updatedCart[existingIndex].quantity += quantity;
                        return { cart: updatedCart };
                    }
                    return {
                        cart: [
                            ...state.cart,
                            {
                                ...product,
                                cartItemId,
                                unitPrice: itemUnitPrice,
                                portion,
                                portionLabel,
                                addons,
                                cookingNote,
                                quantity,
                            },
                        ],
                    };
                });
            },

            updateQuantity: (cartItemId, newQty) => {
                if (newQty <= 0) {
                    get().removeFromCart(cartItemId);
                    return;
                }
                set((state) => ({
                    cart: state.cart.map((item) =>
                        (item.cartItemId || item._id) === cartItemId ? { ...item, quantity: newQty } : item
                    ),
                }));
            },

            removeFromCart: (cartItemId) => {
                set((state) => ({
                    cart: state.cart.filter((item) => (item.cartItemId || item._id) !== cartItemId),
                }));
            },

            clearCart: () => set({ cart: [] }),

            applyCoupon: (code) => {
                const upper = code.trim().toUpperCase();
                if (upper === "BIOFF10") {
                    set({ appliedCoupon: "BIOFF10", discountAmount: 10 });
                    return { success: true, message: "10% Discount Applied!" };
                }
                if (upper === "BURG05") {
                    set({ appliedCoupon: "BURG05", discountAmount: 5 });
                    return { success: true, message: "$5 Discount Applied!" };
                }
                return { success: false, message: "Invalid Coupon Code" };
            },

            removeCoupon: () => set({ appliedCoupon: null, discountAmount: 0 }),

            createOrder: (formData = {}) => {
                const { cart, orderType, pickupSlot, tableNo, appliedCoupon } = get();
                const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice || (item.portions && item.portions.length > 0 ? item.portions[0].price : 50)) * item.quantity, 0);
                const deliveryFee = orderType === "delivery" ? 0.00 : 0.00;
                const platformFee = 2.00;
                const discount = appliedCoupon === "BIOFF10" ? subtotal * 0.1 : appliedCoupon === "BURG05" ? 5.00 : 0.00;
                const tax = subtotal * 0.05;
                const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + tax - discount);

                const newOrder = {
                    id: `YK-${Math.floor(10000 + Math.random() * 90000)}`,
                    orderType,
                    pickupSlot,
                    tableNo,
                    items: [...cart],
                    subtotal,
                    deliveryFee,
                    platformFee,
                    tax,
                    discount,
                    grandTotal,
                    customer: formData,
                    status: "PLACED",
                    eta: orderType === "delivery" ? "20-30 Mins" : orderType === "takeaway" ? `In ${pickupSlot} Mins` : "15-20 Mins",
                    placedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                };

                set((state) => ({
                    activeOrders: [...(state.activeOrders || []), newOrder],
                    cart: [],
                    appliedCoupon: null,
                    discountAmount: 0,
                }));

                return newOrder;
            },

            getCartTotals: () => {
                const { cart, orderType, appliedCoupon } = get();
                const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice || (item.portions && item.portions.length > 0 ? item.portions[0].price : 50)) * item.quantity, 0);
                const deliveryFee = orderType === "delivery" ? 0.00 : 0.00;
                const discount = appliedCoupon === "BIOFF10" ? subtotal * 0.1 : appliedCoupon === "BURG05" ? 5.00 : 0.00;
                const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

                return {
                    subtotal,
                    deliveryFee,
                    platformFee: 0,
                    tax: 0,
                    discount,
                    grandTotal,
                };
            },
        }),
        {
            name: "yours-kitchen-storage",
        }
    )
);
