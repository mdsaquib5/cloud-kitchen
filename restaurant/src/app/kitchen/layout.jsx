import React from "react";
import KitchenSidebar from "@/components/kitchen/KitchenSidebar";
import AdminAuthGuard from "@/components/kitchen/AdminAuthGuard";

export const metadata = {
    title: "Kitchen KDS Dashboard | Shree Shyam Fast Food",
    description: "Live Kitchen Display System, Order Dispatch & 3PL Logistics Management.",
};

export default function KitchenLayout({ children }) {
    return (
        <AdminAuthGuard>
            <div className="kitchen-page">
                <KitchenSidebar />
                <div className="kitchen-content-wrapper">{children}</div>
            </div>
        </AdminAuthGuard>
    );
}
