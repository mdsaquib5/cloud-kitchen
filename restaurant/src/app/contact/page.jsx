"use client";

import React from "react";
import {
    FiMapPin,
    FiPhoneCall,
    FiMail,
    FiUser,
    FiEdit3,
    FiSend,
} from "react-icons/fi";

const Contact = () => {
    return (
        <div className="inner-wrapper contact-page-wrapper">
            <div className="container">
                <div className="contact-cards-grid">
                    <div className="contact-info-card active-card">
                        <div className="contact-card-icon-wrap">
                            <FiMapPin size={26} />
                        </div>
                        <h3 className="contact-card-title">ADDRESS LINE</h3>
                        <p className="contact-card-text">
                            Plot 42, Cyber Hub, Sector 29 <br />
                            Gurugram, Haryana 122002
                        </p>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-card-icon-wrap">
                            <FiPhoneCall size={26} />
                        </div>
                        <h3 className="contact-card-title">PHONE NUMBER</h3>
                        <p className="contact-card-text">
                            +91 98765 43210 <br />
                            +91 11 2345 6789
                        </p>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-card-icon-wrap">
                            <FiMail size={26} />
                        </div>
                        <h3 className="contact-card-title">MAIL ADDRESS</h3>
                        <p className="contact-card-text">
                            order@yourskitchen.in <br />
                            support@yourskitchen.in
                        </p>
                    </div>
                </div>

                <div className="contact-main-grid">
                    <div className="contact-map-col">
                        <h2 className="contact-section-heading">GET IN TOUCH</h2>
                        <p className="contact-section-desc">
                            Have questions about our authentic gourmet recipes, special catering packages, or order feedback? Reach out to our kitchen team.
                        </p>
                        <div className="contact-map-wrap">
                            <iframe
                                title="Kitchen Location Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14030.134812328608!2d77.0754823!3d28.4716947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1921935639fd%3A0x6a0c0b85a7bbcfb4!2sCyber%20City%2C%20Gurugram!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%"
                                height="340"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="map-iframe"
                            ></iframe>
                        </div>
                    </div>

                    <div className="contact-form-col">
                        <h2 className="contact-section-heading">FILL UP THE FORM</h2>
                        <p className="contact-form-notice">
                            Your email address will not be published. Required fields are marked *
                        </p>

                        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="contact-input-field">
                                <span className="field-icon">
                                    <FiUser size={18} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Your Name*"
                                    required
                                    className="contact-text-input"
                                />
                            </div>

                            <div className="contact-input-field">
                                <span className="field-icon">
                                    <FiMail size={18} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="Email Address*"
                                    required
                                    className="contact-text-input"
                                />
                            </div>

                            <div className="contact-input-field textarea-field">
                                <span className="field-icon textarea-icon">
                                    <FiEdit3 size={18} />
                                </span>
                                <textarea
                                    placeholder="Enter Your Message Here"
                                    rows="4"
                                    required
                                    className="contact-textarea"
                                ></textarea>
                            </div>

                            <button type="submit" className="contact-submit-btn">
                                <FiSend size={16} />
                                <span>GET IN TOUCH</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
