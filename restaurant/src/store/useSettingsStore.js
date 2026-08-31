import { create } from "zustand";

export const useSettingsStore = create((set) => ({
    isKitchenOpen: true, // Default to true
    setIsKitchenOpen: (status) => set({ isKitchenOpen: status }),
}));
