"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiShoppingBag, FiGrid, FiTruck } from "react-icons/fi";

const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        {
            id: "home",
            label: "Home",
            href: "/",
            icon: <FiHome size={16} />,
        },
        {
            id: "menu",
            label: "Menu",
            href: "/foods",
            icon: <FiGrid size={16} />,
        },
        {
            id: "cart",
            label: "Cart",
            href: "/cart",
            icon: (
                <div className="bottom-nav-cart-icon">
                    <FiShoppingBag size={16} />
                    <span className="bottom-cart-badge">0</span>
                </div>
            ),
        },
        {
            id: "track",
            label: "Track",
            href: "/track-order",
            icon: <FiTruck size={16} />,
        },
    ];

    return (
        <nav className="mobile-bottom-nav">
            <div className="bottom-nav-container">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`bottom-nav-item ${isActive ? "active" : ""}`}
                        >
                            <span className="bottom-nav-icon">{item.icon}</span>
                            <span className="bottom-nav-label">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
