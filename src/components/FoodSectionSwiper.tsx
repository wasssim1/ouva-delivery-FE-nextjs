"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { MenuSection } from "@/interfaces/food-store.interface";
import "swiper/css";

interface CategorySwiperProps {
  menuSections: MenuSection[];
  activeSection: string;
  onSectionClick: (categoryId: string) => void;
}

export function FoodSectionSwiper({
  menuSections,
  activeSection,
  onSectionClick,
}: CategorySwiperProps) {
  const swiperRef = useRef<any>(null);

  // Scroll active category into view when it changes
  const scrollToActiveCategory = (sectionSlug: string) => {
    const activeIndex = menuSections.findIndex(
      (section) => section.sectionSlug === sectionSlug
    );

    if (swiperRef.current && activeIndex !== -1) {
      swiperRef.current.slideTo(activeIndex);
    }
  };

  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={8}
      className="!w-full categories-swiper"
      cssMode={true}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        scrollToActiveCategory(activeSection);
      }}
    >
      {menuSections?.map((section) => (
        <SwiperSlide key={section.sectionSlug} className="!w-auto">
          <button
            onClick={() => onSectionClick(section.sectionSlug)}
            className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
              activeSection === section.sectionSlug
                ? "bg-secondary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {section.sectionTitle}
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
