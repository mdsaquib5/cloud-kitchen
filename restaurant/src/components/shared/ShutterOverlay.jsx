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
        if (prevStatusRef.current !== isKitchenOpen) {
            prevStatusRef.current = isKitchenOpen;
        }
    }, [isKitchenOpen, mounted]);

    if (!mounted) return null;

    return (
        <div className={`shutter-overlay ${isKitchenOpen ? "open" : "closed"}`}>
            <div className="shutter-text-container">
                <h1 className="shutter-text">Kitchen Closed</h1>
                <p className="shutter-subtext">We will start taking your orders from 03:00 PM</p>
            </div>
        </div>
    );
};

export default ShutterOverlay;
