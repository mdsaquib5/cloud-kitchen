"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/useSettingsStore";

const KitchenStatusListener = () => {
    const setIsKitchenOpen = useSettingsStore((state) => state.setIsKitchenOpen);
    const fetchSettings = useSettingsStore((state) => state.fetchSettings);
    const isKitchenOpen = useSettingsStore((state) => state.isKitchenOpen);
    const prevStatusRef = useRef(isKitchenOpen);

    useEffect(() => {
        // Fetch initial status on load using store action
        const initializeStatus = async () => {
            const settings = await fetchSettings();
            if (settings) {
                prevStatusRef.current = settings.isKitchenOpen;
            }
        };

        initializeStatus();

        // Connect Socket
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', ''));

        socket.on("connect", () => {
            console.log("Connected to real-time status updates");
        });

        socket.on("kitchen_status_changed", (data) => {
            if (prevStatusRef.current !== data.isKitchenOpen) {
                if (data.isKitchenOpen) {
                    toast.success("Good news! The kitchen is now OPEN. You can place orders again.", { duration: 5000 });
                } else {
                    toast.error("Notice: The kitchen has just CLOSED. We are no longer accepting new orders today.", { duration: 5000 });
                }
                setIsKitchenOpen(data.isKitchenOpen);
                prevStatusRef.current = data.isKitchenOpen;
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchSettings, setIsKitchenOpen]);

    return null; // This component doesn't render anything visible directly
};

export default KitchenStatusListener;
