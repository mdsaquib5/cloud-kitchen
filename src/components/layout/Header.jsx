"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FaHome,
    FaUtensils,
    FaFire,
    FaLeaf,
    FaDrumstickBite,
    FaPhoneAlt,
    FaChevronDown,
    FaMotorcycle,
} from "react-icons/fa";
import {
    FiShoppingBag,
    FiUser,
    FiMenu,
    FiX,
} from "react-icons/fi";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header>
            <div className="container">
                <div className="main-header">
                    <div className="logo">
                        <Link href="/">
                            <Image src="/test.png" alt="Your's Kitchen" width={504} height={197} priority />
                        </Link>
                    </div>

                    <div className={`menu-bars ${isMenuOpen ? "active" : ""}`}>
                        <div className="drawer-header">
                            <div className="drawer-logo">
                                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                                    <Image src="/logo.png" alt="Your's Kitchen" width={504} height={197} />
                                </Link>
                            </div>
                            <button
                                className="drawer-close-btn"
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Close Navigation"
                            >
                                <FiX />
                            </button>
                        </div>

                        <nav className="nav-menu">
                            <ul>
                                <li>
                                    <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                        <FaHome className="nav-icon" />
                                        <span>Home</span>
                                    </Link>
                                </li>

                                <li className={`has-dropdown ${isDropdownOpen ? "open" : ""}`}>
                                    <button
                                        type="button"
                                        className="nav-link dropdown-toggle-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsDropdownOpen(!isDropdownOpen);
                                        }}
                                    >
                                        <FaUtensils className="nav-icon" />
                                        <span>Menu</span>
                                        <FaChevronDown className="arrow-icon" />
                                    </button>
                                    <div className="dropdown-menu">
                                        <Link href="/menu/starters" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                                            <span>Starters Kebabs</span>
                                        </Link>
                                        <Link href="/menu/biryani" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                                            <span>Handi Biryani Rice</span>
                                        </Link>
                                        <Link href="/menu/curries" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                                            <span>Main Course Curries</span>
                                        </Link>
                                        <Link href="/menu/breads" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                                            <span>Fresh Tandoori Breads</span>
                                        </Link>
                                        <Link href="/menu/desserts" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                                            <span>Desserts Beverages</span>
                                        </Link>
                                    </div>
                                </li>

                                <li>
                                    <Link href="/todays-special" className="nav-link special-link" onClick={() => setIsMenuOpen(false)}>
                                        <FaFire className="nav-icon fire-icon" />
                                        <span>Today's Special</span>
                                        <span className="badge-hot">HOT</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/veg-foods" className="nav-link veg-link" onClick={() => setIsMenuOpen(false)}>
                                        <FaLeaf className="nav-icon veg-icon" />
                                        <span>Veg Foods</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/non-veg-foods" className="nav-link non-veg-link" onClick={() => setIsMenuOpen(false)}>
                                        <FaDrumstickBite className="nav-icon non-veg-icon" />
                                        <span>Non-Veg Foods</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/track-order" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                        <FaMotorcycle className="nav-icon" />
                                        <span>Track Order</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                        <FaPhoneAlt className="nav-icon" />
                                        <span>Contact</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

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