"use client";

import Link from "next/link";
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
                            Rz 45, Mangal Bazar Rd, Near by Sunil Dairy, <br />Santosh Park,
                            Uttam Nagar, New Delhi, India-110059
                        </p>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-card-icon-wrap">
                            <FiPhoneCall size={26} />
                        </div>
                        <h3 className="contact-card-title">PHONE NUMBER</h3>
                        <Link href={'tel:+91 95607 74819'} className="contact-card-text">
                            +91 95607 74819
                        </Link>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-card-icon-wrap">
                            <FiMail size={26} />
                        </div>
                        <h3 className="contact-card-title">MAIL ADDRESS</h3>
                        <Link href={'mailto:shreeshyaam942@gmail.com'} className="contact-card-text">
                            shreeshyaam942@gmail.com
                        </Link>
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
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d218.9016283013205!2d77.05908096745912!3d28.6169903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d058ae6b18e5f%3A0xb12b707390d3a87e!2sShree%20shyam%20fast%20food!5e0!3m2!1sen!2sin!4v1788444487445!5m2!1sen!2sin"
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
