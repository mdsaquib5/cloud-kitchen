"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function KitchenAuthGuard({ children }) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Simple client-side auth check
        if (!isAuthenticated || (user?.role !== "admin" && user?.name !== "Admin")) {
            toast.error("Unauthorized! Admin access required.");
            router.push("/login");
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, user, router]);

    if (isChecking) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>Loading Admin Panel...</div>;
    }

    return <>{children}</>;
}
