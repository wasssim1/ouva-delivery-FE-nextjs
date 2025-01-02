"use client";

import { RootState } from "@/redux/store";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-amazing-hooks";
import { FaSearchLocation } from "react-icons/fa";
import { useSelector } from "react-redux";

import { FoodStore } from "@/interfaces/foodStore.interface";

// components
import FloatingButton from "@/components/FloatingButton";
import Header from "@/components/Header";
import LayoutContainer from "@/components/LayoutContainer";
import { StoreCategoriesCarousel } from "@/components/StoreCategoriesCarousel";
import RestaurantCard from "@/components/card/RestaurantCard";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import Title from "@/components/typography/Title";

import { SearchBar } from "@/components/ui/search-bar";
import { RESTAURANTS_LIST_DATA } from "@/data/restaurants";
import { STORE_CATEGORIES } from "@/data/store-categories";

const Page = () => {
  const [searchText, setSearchText] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [storesList, setStoresList] = useState<FoodStore[]>(
    RESTAURANTS_LIST_DATA
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations();

  // redux
  const userInfo = useSelector((state: RootState) => state.user);

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
    return storesList.map((foodStore: FoodStore) => (
      <RestaurantCard
        key={`food-store-card_KEY_${foodStore.slug}`}
        foodStore={foodStore}
      />
    ));
  };

  useEffect(() => {
    if (selectedCategory) {
      const filteredStores = RESTAURANTS_LIST_DATA.filter((store) =>
        store.categories.includes(selectedCategory)
      );

      setStoresList(filteredStores);
    } else {
      setStoresList(RESTAURANTS_LIST_DATA);
    }
  }, [selectedCategory]);

  if (typeof window === "undefined") return null;
  if (!userInfo.address) return null;

  return (
    <>
      <LayoutContainer>
        <Navbar />
        <div onLoad={focusInputFunction}>
          <Header bgSRC={"/assets/img/ouva-banner-yellow.png"} bgHeight="small">
            <div className="flex justify-center items-center mt-10 select-none">
              <FaSearchLocation className="mx-2 text-2xl text-primary" />
              <h3 className="text-2xl font-bold text-primary">
                {userInfo.address}
              </h3>
            </div>
            <div className="mt-10 text-center select-none">
              <Title>{t("pages.orders.title")}</Title>
            </div>
          </Header>

          {/* Categories Cards */}
          <div className="mt-6 overflow-hidden select-none w-full">
            <StoreCategoriesCarousel
              categories={STORE_CATEGORIES}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          {/* <div className="container mt-6 -mx-1 px-4">
            <StoreCategoriesSwiper
              categories={cuisineImages}
              setSelectedCategory={setSelectedCuisine}
            />
          </div> */}

          {/* Restaurants search bar - only >900px */}
          <div className="mt-5">
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
            <div
              className={`grid gap-4 grid-cols-1 sm:grid-cols-2 sm:max-w-[500px] md:grid-cols-3 md:max-w-[800px] lg:grid-cols-4 lg:max-w-[987px] max-w-[987px] place-items-center mx-auto ${
                isAtLeastTablet ? "mt-8" : ""
              }`}
              key={`restaurant_container_search_${searchText}`}
            >
              {/* restaurant cards */}
              {renderRestaurantCards()}
            </div>

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
        <Footer />
      </LayoutContainer>
    </>
  );
};

export default Page;
