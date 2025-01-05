"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-amazing-hooks";
import { FaSearchLocation } from "react-icons/fa";

import { FoodStore, StoreCategory } from "@/interfaces/food-store.interface";
import { Zone } from "@/interfaces/zone.interface";

import RestaurantCard from "../card/FoodStoreCard";
import FloatingButton from "../FloatingButton";
import Header from "../Header";
import { StoreCategoriesCarousel } from "../StoreCategoriesCarousel";
import Title from "../typography/Title";
import { SearchBar } from "../ui/search-bar";

interface ZonePageInteractiveWrapperProps {
  zoneData: Zone;
  storeCategoriesData: StoreCategory[];
  storesListData: FoodStore[];
}

export function ZonePageInteractiveWrapper({
  zoneData,
  storeCategoriesData,
  storesListData,
}: ZonePageInteractiveWrapperProps) {
  const [searchText, setSearchText] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredStoresList, setFilteredStoresList] =
    useState<FoodStore[]>(storesListData);

  const inputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations();

  // redux
  //   const userInfo = useSelector((state: RootState) => state.user);

  // media queries
  const isAtLeastTablet = useMediaQuery({ min: 768 });
  const isAtLeast900 = useMediaQuery({ min: 900 });

  // at page load, set focus on the search field
  const focusInputFunction = useCallback(() => {
    if (!isAtLeastTablet) return; // .. blocks the focus on mobile devices for better UX
    if (!inputRef.current) return;

    inputRef.current.focus();
  }, [isAtLeastTablet]);

  // function to handle restaurant cards
  const renderRestaurantCards = () => {
    if (!filteredStoresList?.length) {
      return (
        <div className="flex flex-col items-center justify-center m-10">
          <h1 className="md:text-2xl font-bold text-secondary">
            {t("pages.zone.noStoresFound")}
          </h1>
        </div>
      );
    }

    return (
      <div
        className={`grid gap-4 grid-cols-1 sm:grid-cols-2 sm:max-w-[500px] md:grid-cols-3 md:max-w-[800px] lg:grid-cols-4 lg:max-w-[987px] max-w-[987px] place-items-center mx-auto ${
          isAtLeastTablet ? "mt-8" : ""
        }`}
        key={`restaurant_container_search_${searchText}`}
      >
        {filteredStoresList.map((foodStore: FoodStore) => (
          <RestaurantCard
            key={`food-store-card_KEY_${foodStore.slug}`}
            foodStore={foodStore}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (selectedCategory) {
      const filteredStores = storesListData.filter((store) =>
        store.categories.includes(selectedCategory)
      );

      setFilteredStoresList(filteredStores);
    } else {
      setFilteredStoresList(storesListData);
    }
  }, [selectedCategory]);

  if (typeof window === "undefined") return null;

  return (
    <>
      <div onLoad={focusInputFunction}>
        <Header bgSRC={"/assets/img/ouva-banner-yellow.png"} bgHeight="small" className="items-center">
          <div className="flex justify-center items-center mt-10 select-none">
            <FaSearchLocation className="mx-2 text-2xl text-primary" />
            <h3 className="text-2xl font-bold text-primary">{zoneData.name}</h3>
          </div>
          <div className="mt-10 text-center select-none">
            <Title>{t("pages.orders.title")}</Title>
          </div>
        </Header>

        {/* Categories Cards */}
        <div className="my-10 md:my-3 select-none w-full">
          <StoreCategoriesCarousel
            categories={storeCategoriesData}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* <div className="flex overflow-x-auto overflow-y-hidden flex-flow flex-row flex-nowrap">
          {storeCategoriesData.map((category) => (
            <div
              key={category.slug}
              className="flex flex-col items-center justify-center mx-2"
            >
              <p className="text-sm mt-2">{category.name}</p>
            </div>
          ))}
        </div> */}

        {/* <div className="container mt-6 -mx-1 px-4">
              <StoreCategoriesSwiper
                categories={cuisineImages}
                setSelectedCategory={setSelectedCuisine}
              />
            </div> */}

        {/* Restaurants search bar - only >900px */}
        <div className="mt-10 mx-3">
          <div className="max-w-[987px] mx-auto">
            {isAtLeast900 && (
              <SearchBar
                placeholder={t("pages.orders.searchForRestaurant")}
                searchText={searchText}
                onSearchChange={setSearchText}
                clearSearch={() => setSearchText("")}
              />
            )}
          </div>

          {/* Restaurants Cards */}
          {renderRestaurantCards()}

          {/* pagination control */}
          {/* <ListPaginationControl
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                hasNextPage={hasNextPage}
                showAllItems={showAllItems}
                setShowAllItems={setShowAllItems}
                isPaginationVisible={isPaginationVisible}
              /> */}
        </div>

        <FloatingButton scrollThreshold={600} />
      </div>
    </>
  );
}
