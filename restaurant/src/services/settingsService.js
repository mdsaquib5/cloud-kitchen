import api from "./api";

export const getSettings = () => api.get("/settings");
export const updateKitchenStatus = (isKitchenOpen) =>
    api.put("/settings/status", { isKitchenOpen });

const settingsService = {
    getSettings,
    updateKitchenStatus,
};

export default settingsService;
