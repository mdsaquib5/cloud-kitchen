import React from "react";
import KitchenSidebar from "@/components/kitchen/KitchenSidebar";
import KitchenHeader from "@/components/kitchen/KitchenHeader";

export const metadata = {
    title: "Kitchen KDS Dashboard | Shree Shyam Fast Food",
    description: "Live Kitchen Display System, Order Dispatch & 3PL Logistics Management.",
};

export default function KitchenLayout({ children }) {
    return (
        <>
            <KitchenSidebar />
            <KitchenHeader />
            {children}
        </>
    );
}