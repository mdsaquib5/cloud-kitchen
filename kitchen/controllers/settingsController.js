import Settings from "../models/settingsModel.js";
import { getIO } from "../configs/socket.js";

const initSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings();
        await settings.save();
    }
    return settings;
};

export const getSettings = async (req, res) => {
    try {
        const settings = await initSettings();
        res.status(200).json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { isKitchenOpen } = req.body;
        let settings = await initSettings();

        settings.isKitchenOpen = isKitchenOpen;
        await settings.save();

        const io = getIO();
        if (io) {
            io.emit("kitchen_status_changed", { isKitchenOpen });
        }

        res.status(200).json({ success: true, message: "Settings updated", settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
