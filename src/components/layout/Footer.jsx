import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FaInstagram,
    FaYoutube,
    FaFacebookF,
    FaTwitter,
} from "react-icons/fa";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiClock,
    FiChevronRight,
} from "react-icons/fi";

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col brand-col">
                        <Link href="/" className="footer-logo">
                            <Image
                                src="/logo.png"
                                alt="Your's Kitchen"
                                width={504}
                                height={197}
                                className="footer-logo-img"
                            />
                        </Link>
                        <p className="footer-brand-desc">
                            Your's Kitchen brings royal culinary traditions and modern cloud kitchen excellence to your table. 100% fresh, hygienic, and prepared with authentic master recipes.
                        </p>
                        <div className="footer-social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                                <FaInstagram size={16} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="YouTube">
                                <FaYoutube size={16} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
                                <FaFacebookF size={15} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter">
                                <FaTwitter size={15} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-col links-col">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links-list">
                            <li>
                                <Link href="/">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Explore Menu</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu/todays-special">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Today's Special</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu/veg">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Pure Veg Foods</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu/non-veg">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Non-Veg Specials</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/track-order">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Track Live Order</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col policies-col">
                        <h4 className="footer-heading">Support & Policies</h4>
                        <ul className="footer-links-list">
                            <li>
                                <Link href="/privacy-policy">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Privacy Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Terms & Conditions</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund-policy">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Refund & Cancellation</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping-policy">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Shipping & Delivery</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/food-safety">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Food Safety Standards</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Help & FAQs</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col contact-col">
                        <h4 className="footer-heading">Kitchen Contact</h4>
                        <ul className="footer-contact-list">
                            <li>
                                <FiMail className="contact-icon" />
                                <div>
                                    <span className="contact-label">Email Us</span>
                                    <a href="mailto:order@yourskitchen.in" className="contact-val">order@yourskitchen.in</a>
                                </div>
                            </li>
                            <li>
                                <FiPhone className="contact-icon" />
                                <div>
                                    <span className="contact-label">Call / WhatsApp</span>
                                    <a href="tel:+919876543210" className="contact-val">+91 98765 43210</a>
                                </div>
                            </li>
                            <li>
                                <FiMapPin className="contact-icon" />
                                <div>
                                    <span className="contact-label">Kitchen Location</span>
                                    <span className="contact-val">Plot 42, Cyber Hub Sector 29, Gurugram, India</span>
                                </div>
                            </li>
                            <li>
                                <FiClock className="contact-icon" />
                                <div>
                                    <span className="contact-label">Working Hours</span>
                                    <span className="contact-val">Mon - Sun: 11:00 AM - 11:30 PM</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom-bar">
                    <p className="copyright-text">
                        © {new Date().getFullYear()} <span className="brand-highlight">Your's Kitchen</span>. All Rights Reserved.
                    </p>
                    <div className="footer-bottom-badges">
                        <span className="secure-badge">100% Direct UPI & Card Payment Safe</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;