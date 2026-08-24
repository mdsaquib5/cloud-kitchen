"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import BottomNav from "@/components/layout/BottomNav";

const ClientLayoutWrapper = ({ children }) => {
    const pathname = usePathname();
    const isKitchenPanel = pathname?.startsWith("/kitchen");

    if (isKitchenPanel) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
            <BottomNav />
        </>
    );
};

export default ClientLayoutWrapper;