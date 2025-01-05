import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";

import { StoreCategory } from "@/interfaces/food-store.interface";

import CardsCategory from "./card/FoodCategoryCard";

interface StoreCategoriesSwiperProps {
  categories: StoreCategory[];
  selectedCategory: string;
  setSelectedCategory: () => void;
}

export function StoreCategoriesSwiper({
  categories,
  selectedCategory,
  setSelectedCategory,
}: StoreCategoriesSwiperProps) {
  return (
    <>
      <Swiper
        className="!w-auto categories-swiper"
        spaceBetween={30}
        slidesPerView={5}
        freeMode={true}
        modules={[FreeMode]}
        onSlideChange={() => console.log("slide change")}
      >
        {categories.map(({ slug, image, CompIcon }, idx) => (
          <SwiperSlide
            key={"card-food-category_KEY_" + idx}
            className="flex justify-center !w-auto"
          >
            <CardsCategory
              slug={slug}
              imgSRC={image}
              CompIcon={CompIcon}
              selectedCategory={selectedCategory}
              setSelectedCuisine={setSelectedCategory}
            />
            <div>hello swiper</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
