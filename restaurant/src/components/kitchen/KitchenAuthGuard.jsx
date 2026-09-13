"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKitchenAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function KitchenAuthGuard({ children }) {
    const router = useRouter();
    const { kitchenUser, isKitchenAuthenticated } = useKitchenAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Simple client-side auth check for kitchen admin
        if (!isKitchenAuthenticated || (kitchenUser?.role !== "admin")) {
            toast.error("Unauthorized! Kitchen Manager access required.");
            router.push("/kitchen");
        } else {
            setIsChecking(false);
        }
    }, [isKitchenAuthenticated, kitchenUser, router]);

    if (isChecking) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>Loading Admin Panel...</div>;
    }

    return <>{children}</>;
}
