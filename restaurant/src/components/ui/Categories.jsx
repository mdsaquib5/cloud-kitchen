"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import SectionTitle from "../layout/SectionTitle";
import CategoryCard from "../shared/CategoryCard";

import "swiper/css";
import "swiper/css/pagination";

const Categories = ({ initialCategories = [] }) => {
    if (initialCategories.length === 0) return null;

    return (
        <section>
            <div className="container">
                <SectionTitle
                    title="Top Categories"
                    description="Explore our carefully curated categories featuring fresh ingredients and signature flavors."
                />
                <div className="categories-slider-wrap">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{
                            clickable: true,
                            el: ".categories-swiper-pagination",
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: 2,
                                spaceBetween: 16,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        className="categories-swiper"
                    >
                        {initialCategories.map((item, index) => (
                            <SwiperSlide key={item._id || index}>
                                <CategoryCard item={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="categories-swiper-pagination"></div>
                </div>
            </div>
        </section>
    );
};

export default Categories;
