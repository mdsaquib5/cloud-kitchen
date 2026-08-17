"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    FiShoppingBag,
    FiUser,
    FiMenu,
    FiX,
} from "react-icons/fi";
import Logo from "../shared/Logo";
import Menu from "../shared/Menu";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header>
            <div className="container">
                <div className="main-header">
                    <Logo />
                    <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />

                    <div className="header-actions">
                        <Link href="/cart" className="action-btn cart-btn">
                            <FiShoppingBag size={16} />
                            <span className="cart-badge">0</span>
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