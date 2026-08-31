"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import "./ShutterOverlay.css";

const ShutterOverlay = () => {
    const isKitchenOpen = useSettingsStore((state) => state.isKitchenOpen);
    const [mounted, setMounted] = useState(false);
    const prevStatusRef = useRef(isKitchenOpen);

    useEffect(() => {
        setMounted(true);
        prevStatusRef.current = isKitchenOpen;
    }, [isKitchenOpen]);

    useEffect(() => {
        if (!mounted) return;
        
        // Only play sound when status actually changes
        if (prevStatusRef.current !== isKitchenOpen) {
            try {
                const audio = new Audio("/shutter.mpeg");
                audio.play().catch(e => console.log("Audio play blocked by browser:", e));
            } catch (error) {
                console.error("Failed to play audio", error);
            }
            prevStatusRef.current = isKitchenOpen;
        }
    }, [isKitchenOpen, mounted]);

    if (!mounted) return null;

    return (
        <div className={`shutter-overlay ${isKitchenOpen ? "open" : "closed"}`}>
            <div className="shutter-text-container">
                <h1 className="shutter-text">Kitchen Closed</h1>
                <p className="shutter-subtext">We are taking a quick break. See you soon!</p>
            </div>
        </div>
    );
};

export default ShutterOverlay;
