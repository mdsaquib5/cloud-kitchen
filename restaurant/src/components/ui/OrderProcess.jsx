import React from "react";
import Image from "next/image";
import { FiMapPin, FiShoppingBag, FiCreditCard, FiTruck } from "react-icons/fi";

const OrderProcess = () => {
    const steps = [
        {
            id: "01",
            icon: <FiMapPin size={22} />,
            title: "Set your location",
            description: "A high quality solution beautifully food for customers",
        },
        {
            id: "02",
            icon: <FiShoppingBag size={22} />,
            title: "Select Food",
            description: "A high quality solution beautifully food for customers",
        },
        {
            id: "03",
            icon: <FiCreditCard size={22} />,
            title: "Pay Cash or Online",
            description: "Providing an upscale and elegant ambiance for your ease",
        },
        {
            id: "04",
            icon: <FiTruck size={22} />,
            title: "Delivery or Pickup",
            description: "Allowing customers to easily track and receive orders",
        },
    ];

    return (
        <section className="order-process-section">
            <div className="container">
                <div className="order-process-grid">
                    <div className="process-thumb-wrap">
                        <Image
                            src="https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/home-media/process-themb.webp"
                            alt="Ordering Process Illustration"
                            width={540}
                            height={480}
                            className="process-thumb-img"
                        />
                    </div>

                    <div className="process-content-wrap">
                        <div className="process-header">
                            <span className="process-tagline">— Simple Ordering Steps —</span>
                            <h2 className="process-main-title">
                                The Process of Crafting your <span className="title-highlight">Dining Experience</span>
                            </h2>
                        </div>

                        <div className="process-steps-list">
                            {steps.map((step) => (
                                <div key={step.id} className="process-step-card">
                                    <div className="step-icon-box">
                                        {step.icon}
                                    </div>
                                    <div className="step-text-content">
                                        <h3 className="step-title">{step.title}</h3>
                                        <p className="step-description">{step.description}</p>
                                    </div>
                                    <div className="step-watermark-number">
                                        {step.id}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderProcess;
