"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/useSettingsStore";

const KitchenStatusListener = () => {
    const setIsKitchenOpen = useSettingsStore((state) => state.setIsKitchenOpen);
    const isKitchenOpen = useSettingsStore((state) => state.isKitchenOpen);
    const prevStatusRef = useRef(isKitchenOpen);
    const initializedRef = useRef(false);

    useEffect(() => {
        // Fetch initial status on load
        const fetchInitialStatus = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`);
                const data = await res.json();
                if (data.success && data.settings) {
                    setIsKitchenOpen(data.settings.isKitchenOpen);
                    prevStatusRef.current = data.settings.isKitchenOpen;
                }
            } catch (error) {
                console.error("Failed to fetch initial kitchen status", error);
            }
        };

        fetchInitialStatus();

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
    }, [setIsKitchenOpen]);

    return null; // This component doesn't render anything visible directly
};

export default KitchenStatusListener;
