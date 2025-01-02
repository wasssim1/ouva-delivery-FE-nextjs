import { useMediaQuery } from "react-amazing-hooks";

import { StoreCategory } from "@/interfaces/foodStore.interface";

import { getResponsiveSettings } from "@/functions/common";
import CardsCategory from "./card/CardsCategory";
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
            className="flex mx-auto px-2.5 h-fit cursor-grab max-w-[987px]"
          >
            <CarouselContent>
              {categories.map(({ slug, image, CompIcon, name }) => (
                <CarouselItem
                  key={slug}
                  className="pl-0 mx-auto basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/6"
                >
                  <div
                    className={`m-1${
                      selectedCategory === slug ? " border-secondary" : ""
                    }`}
                  >
                    <CardsCategory
                      slug={slug}
                      title={name}
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
            {categories.map(({ slug, image, CompIcon, name }) => (
              <CardsCategory
                key={"card_cuisine_" + slug}
                slug={slug}
                title={name}
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
