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

            clearAuth: () => set({
                user: null,
                accessToken: null,
                isAuthenticated: false
            })
        }),
        {
            name: "yours-kitchen-auth", // unique key for localStorage
            partialize: (state) => ({ user: state.user }) // Only persist user info, token is kept in memory
        }
    )
);
