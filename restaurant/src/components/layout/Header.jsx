"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import Logo from "../shared/Logo";
import Menu from "../shared/Menu";
import { useStore } from "@/store/useStore";

const Header = () => {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const cart = useStore((state) => state.cart);

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <header>
            <div className="container">
                <div className="main-header">
                    <Logo />
                    <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
                    <div className="header-actions">
                        <Link href="/cart" className="action-btn cart-btn">
                            <FiShoppingBag size={16} />
                            <span className="cart-badge">{cartCount}</span>
                        </Link>
                        <Link href="/login" className="login-cta-btn">
                            <FiUser size={16} />
                            <span>Account</span>
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