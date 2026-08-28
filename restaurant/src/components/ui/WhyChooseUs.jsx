import React from "react";
import Image from "next/image";
import { FiAward, FiCheckCircle } from "react-icons/fi";
import { FaMotorcycle, FaPepperHot } from "react-icons/fa";
import SectionTitle from "../layout/SectionTitle";

const WhyChooseUs = () => {
    const galleryItems = [
        { id: 1, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/why-chooose/food-1.jpg", alt: "Sizzling Gourmet Delights" },
        { id: 2, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/why-chooose/food-2.jpg", alt: "Rich Handcrafted Soups" },
        { id: 3, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/why-chooose/food-3.jpg", alt: "Steaming Fresh Wok Specialties" },
        { id: 4, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/why-chooose/food-4.jpg", alt: "Authentic Claypot Curries" },
        { id: 5, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/why-chooose/food-5.jpg", alt: "Signature Grilled Dishes" },
        { id: 6, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/why-chooose/food-6.jpg", alt: "Hot Sizzling Kebabs" },
    ];

    const features = [
        {
            id: 1,
            icon: <FiAward size={36} />,
            title: "SUPER QUALITY FOOD",
            description: "A team of dreamers and doers building unique interactive culinary taste.",
        },
        {
            id: 2,
            icon: <FaPepperHot size={36} />,
            title: "ORIGINAL RECIPES",
            description: "A team of dreamers and doers building unique interactive culinary taste.",
        },
        {
            id: 3,
            icon: <FaMotorcycle size={36} />,
            title: "QUICK FAST DELIVERY",
            description: "A team of dreamers and doers building unique interactive culinary taste.",
        },
        {
            id: 4,
            icon: <FiCheckCircle size={36} />,
            title: "100% FRESH FOODS",
            description: "A team of dreamers and doers building unique interactive culinary taste.",
        },
    ];

    return (
        <section className="why-choose-section">
            <div className="container">
                <div className="why-choose-gallery">
                    {galleryItems.map((item) => (
                        <div key={item.id} className="why-choose-gallery-card">
                            <Image
                                src={item.src}
                                alt={item.alt}
                                width={307}
                                height={498}
                            />
                        </div>
                    ))}
                </div>

                <SectionTitle
                    title="Why Choose Us"
                    description="Explore our carefully curated categories featuring fresh ingredients and signature flavors."
                />

                <div className="why-choose-card-banner">
                    <div className="why-choose-features-grid">
                        {features.map((feat) => (
                            <div key={feat.id} className="why-choose-feature-item">
                                <div className="feature-icon-box">
                                    {feat.icon}
                                </div>
                                <h3 className="feature-title">{feat.title}</h3>
                                <p className="feature-desc">{feat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
