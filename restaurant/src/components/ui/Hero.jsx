"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";

const Hero = () => {
    const banners = [
        { id: 1, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/static-media/banner-image/banner1.webp", alt: "Special Dish Banner 1" },
        { id: 2, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/static-media/banner-image/banner2.webp", alt: "Special Dish Banner 2" },
        { id: 3, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/static-media/banner-image/banner3.webp", alt: "Special Dish Banner 3" },
        { id: 4, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/static-media/banner-image/banner4.webp", alt: "Special Dish Banner 4" },
        { id: 5, src: "https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/static-media/banner-image/banner5.webp", alt: "Special Dish Banner 5" },
    ];

    return (
        <div className="hero-slider-section">
            <div className="hero-slider-wrapper">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                    }}
                    navigation={{
                        prevEl: ".hero-swiper-prev",
                        nextEl: ".hero-swiper-next",
                    }}
                    className="hero-swiper"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <div className="hero-slide-item">
                                <Image
                                    src={banner.src}
                                    alt={banner.alt}
                                    width={1920}
                                    height={800}
                                    priority={banner.id === 1}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    className="hero-swiper-btn hero-swiper-prev"
                    aria-label="Previous Slide"
                >
                    <FiChevronLeft size={22} />
                </button>
                <button
                    className="hero-swiper-btn hero-swiper-next"
                    aria-label="Next Slide"
                >
                    <FiChevronRight size={22} />
                </button>
            </div>
        </div>
    );
};

export default Hero;