"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogIn } from "react-icons/fi";
import Logo from "../shared/Logo";
import Menu from "../shared/Menu";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";

const ClosingAlert = () => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const calculateTimeLeft = () => {
            const now = new Date();
            // Get current time in IST to handle logic reliably
            const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const istDate = new Date(istString);
            
            const hours = istDate.getHours();
            const minutes = istDate.getMinutes();
            
            // Closing time is 23:00 (11 PM). Alert triggers at 22:30 (10:30 PM)
            if (hours === 22 && minutes >= 30) {
                // Calculate time left until 23:00
                const targetTime = new Date(istDate);
                targetTime.setHours(23, 0, 0, 0);
                
                const diffMs = targetTime - istDate;
                if (diffMs > 0) {
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffSecs = Math.floor((diffMs % 60000) / 1000);
                    return { mins: diffMins, secs: diffSecs };
                }
            }
            return null;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted || !timeLeft) return null;

    return (
        <div style={{
            backgroundColor: '#ef4444', 
            color: 'white', 
            textAlign: 'center', 
            padding: '10px 15px', 
            fontSize: '14px', 
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            width: '100%'
        }}>
            <span>⏳ Hurry up! Restaurant is closing in</span>
            <span style={{ 
                background: 'rgba(255,255,255,0.25)', 
                padding: '4px 8px', 
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '16px',
                letterSpacing: '1px'
            }}>
                {timeLeft.mins.toString().padStart(2, '0')}:{timeLeft.secs.toString().padStart(2, '0')}
            </span>
            <span>- Please place your order quickly!</span>
        </div>
    );
};

const Header = () => {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const cart = useStore((state) => state.cart);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <header style={{ position: 'relative' }}>
            <ClosingAlert />
            <div className="container">
                <div className="main-header">
                    <Logo />
                    <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
                    <div className="header-actions">
                        <Link href="/cart" className="action-btn cart-btn">
                            <FiShoppingBag size={16} />
                            <span className="cart-badge">{cartCount}</span>
                        </Link>
                        <Link href={isAuthenticated ? "/profile" : "/login"} className="login-cta-btn">
                            {isAuthenticated ? <FiUser size={16} /> : <FiLogIn size={16} />}
                            <span>{isAuthenticated ? "Account" : "Login"}</span>
                        </Link>
                        <button
                            className="menu-toggle-btn"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Navigation"
                        >
                            {isMenuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;