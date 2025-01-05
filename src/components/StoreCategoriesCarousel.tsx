import { useMediaQuery } from "react-amazing-hooks";

import { StoreCategory } from "@/interfaces/food-store.interface";

import { getResponsiveSettings } from "@/functions/common";
import CardsCategory from "./card/FoodCategoryCard";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

interface StoreCategoriesCarouselProps {
  categories: StoreCategory[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

export function StoreCategoriesCarousel({
  categories,
  selectedCategory,
  setSelectedCategory,
}: StoreCategoriesCarouselProps) {
  const isCarouselMediaQuery = useMediaQuery({ max: 1200 });

  // get responsive settings for the carousel
  const responsiveSettings = getResponsiveSettings();
  const currentSettings = responsiveSettings.find(
    ({ breakpoint }) => window.innerWidth <= breakpoint
  )?.settings || { slidesToShow: 3 };

  return (
    <>
      {isCarouselMediaQuery ? (
        <div className="px-0 mx-auto h-fit">
          <Carousel
            opts={{
              align: "start",
              ...currentSettings,
            }}
            className="flex justify-center space-x-2 mx-auto px-2.5 h-fit cursor-grab max-w-[987px]"
          >
            <CarouselContent>
              {categories.map(({ slug, image, CompIcon }) => (
                <CarouselItem key={slug} className="px-2 mx-auto basis-1/4">
                  <div
                    className={`m-1${
                      selectedCategory === slug ? " border-secondary" : ""
                    }`}
                  >
                    <CardsCategory
                      slug={slug}
                      imgSRC={image}
                      CompIcon={CompIcon}
                      selectedCategory={selectedCategory}
                      setSelectedCuisine={setSelectedCategory}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      ) : (
        <div className="container w-full mx-auto mt-10">
          <div className="flex justify-around mx-auto gap-2 max-w-[987px]">
            {categories.map(({ slug, image, CompIcon }) => (
              <CardsCategory
                key={"card_cuisine_" + slug}
                slug={slug}
                imgSRC={image}
                CompIcon={CompIcon}
                selectedCategory={selectedCategory}
                setSelectedCuisine={setSelectedCategory}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
