import { create } from "zustand";
import { getSettings, updateKitchenStatus as apiUpdateKitchenStatus } from "../services/settingsService";

export const useSettingsStore = create((set) => ({
    isKitchenOpen: true, // Default to true
    setIsKitchenOpen: (status) => set({ isKitchenOpen: status }),

    fetchSettings: async () => {
        try {
            const res = await getSettings();
            if (res.data?.success && res.data?.settings) {
                set({ isKitchenOpen: res.data.settings.isKitchenOpen });
                return res.data.settings;
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    },

    updateKitchenStatus: async (status) => {
        const res = await apiUpdateKitchenStatus(status);
        if (res.data?.success) {
            set({ isKitchenOpen: status });
        }
        return res.data;
    },
}));
