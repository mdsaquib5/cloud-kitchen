import React from "react";
import Logo from "../shared/Logo";
import Link from "next/link";
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
                        <div className="footer-logo-wrap" style={{ marginBottom: "15px" }}>
                            <Logo />
                        </div>
                        <p className="footer-brand-desc">
                            Shree Shyaam brings you the authentic taste of street food and modern fast food excellence right to your table. 100% fresh, hygienic, and prepared with love.
                        </p>
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
                                <Link href="/#popular-foods">
                                    <FiChevronRight className="link-arrow" />
                                    <span>Explore Menu</span>
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

                    {/* <div className="footer-col policies-col">
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
                    </div> */}

                    <div className="footer-col contact-col">
                        <h4 className="footer-heading">Kitchen Contact</h4>
                        <ul className="footer-contact-list">
                            <li>
                                <FiMail className="contact-icon" />
                                <div>
                                    <span className="contact-label">Email Us</span>
                                    <Link href={'mailto:shreeshyaam942@gmail.com'} className="contact-val">shreeshyaam942@gmail.com</Link>
                                </div>
                            </li>
                            <li>
                                <FiPhone className="contact-icon" />
                                <div>
                                    <span className="contact-label">Call / WhatsApp</span>
                                    <a href={'tel:+91 95607 74819'} className="contact-val">+91 95607 74819</a>
                                </div>
                            </li>
                            <li>
                                <FiMapPin className="contact-icon" />
                                <div>
                                    <span className="contact-label">Kitchen Location</span>
                                    <span className="contact-val">Rz 45, Mangal Bazar Rd, Near by Sunil Dairy,
                                        Santosh Park, Uttam Nagar, New Delhi, India-110059</span>
                                </div>
                            </li>
                            <li>
                                <FiClock className="contact-icon" />
                                <div>
                                    <span className="contact-label">Timings</span>
                                    <span className="contact-val">Mon - Sun: 03:00 PM - 11:00 PM</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom-bar">
                    <p className="copyright-text">
                        © {new Date().getFullYear()} <span className="brand-highlight">Shree Shyaam Fast Food</span>. All Rights Reserved.
                    </p>
                    <div className="footer-credits">
                        <span>Developed by </span>
                        <a href="https://noohark.com" target="_blank" rel="noopener noreferrer" className="developer-link">
                            NoohArk
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;