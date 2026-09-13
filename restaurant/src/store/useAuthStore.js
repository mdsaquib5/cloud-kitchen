import { useStore } from "./useStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken) => set({
                user,
                accessToken,
                isAuthenticated: true
            }),

            setAccessToken: (accessToken) => set({
                accessToken
            }),

            clearAuth: () => {
                useStore.getState().clearCart();
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false
                });
            }
        }),
        {
            name: "yours-kitchen-auth",
            partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated })
        }
    )
);

// Completely Independent Kitchen Manager Auth Store (for KDS / Kitchen Admin Panel)
export const useKitchenAuthStore = create(
    persist(
        (set) => ({
            kitchenUser: null,
            kitchenToken: null,
            isKitchenAuthenticated: false,

            setKitchenAuth: (kitchenUser, kitchenToken) => set({
                kitchenUser,
                kitchenToken,
                isKitchenAuthenticated: true
            }),

            setKitchenToken: (kitchenToken) => set({
                kitchenToken
            }),

            clearKitchenAuth: () => set({
                kitchenUser: null,
                kitchenToken: null,
                isKitchenAuthenticated: false
            })
        }),
        {
            name: "yours-kitchen-manager-auth",
            partialize: (state) => ({
                kitchenUser: state.kitchenUser,
                kitchenToken: state.kitchenToken,
                isKitchenAuthenticated: state.isKitchenAuthenticated
            })
        }
    )
);

