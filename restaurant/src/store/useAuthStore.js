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
            name: "yours-kitchen-auth", // unique key for localStorage
            partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }) // Only persist user info, token is kept in memory
        }
    )
);
