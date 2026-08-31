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
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Only play sound when status actually changes
        if (prevStatusRef.current !== isKitchenOpen) {
            console.log("Shutter state changed. Attempting to play sound...");
            try {
                const audio = new Audio("https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/home-media/shutter.mp3");
                audio.play().then(() => console.log("Sound played successfully!")).catch(e => console.warn("Audio play blocked by browser/error:", e));
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
                <p className="shutter-subtext">We will start taking your orders from 4 PM.</p>
            </div>
        </div>
    );
};

export default ShutterOverlay;