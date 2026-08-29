import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTruck } from "react-icons/fi";

const Cta = () => {
    return (
        <div className="cta-section">
            <div className="container">
                <div className="cta-banner">
                    <div className="cta-content">
                        <span className="cta-tagline">CRISPY, EVERY BITE TASTE</span>
                        <h2 className="cta-title">
                            30 MINUTES FAST <br />
                            <span className="cta-highlight">DELIVERY</span> CHALLENGE
                        </h2>
                        <Link href="/foods" className="cta-order-btn">
                            <FiTruck size={18} />
                            <span>ORDER NOW</span>
                        </Link>
                    </div>

                    <div className="cta-image-wrap">
                        <Image
                            src="https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/home-media/delivery-man.webp"
                            alt="Fast Delivery Rider"
                            width={520}
                            height={440}
                            className="cta-delivery-img"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cta;