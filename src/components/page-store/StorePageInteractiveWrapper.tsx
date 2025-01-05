"use client";

import { useTranslations } from "next-intl";
import { createRef, useEffect, useState } from "react";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { BasketItem, BasketState } from "@/interfaces/basket.interface";
import { FoodStore, MenuItem } from "@/interfaces/food-store.interface";

import RestaurantCard from "../card/FoodStoreCard";
import { RestaurantMenuItemCard } from "../card/FoodStoreMenuItemCard";
import { BasketDialog } from "../dialog/BasketDialog";
import { FoodMenuItemDialog } from "../dialog/FoodMenuItemDialog";
import { FoodSectionSwiper } from "../FoodSectionSwiper";
import { SearchBar } from "../ui/search-bar";
import { StickyBasketButton } from "./StickyBasketButton";

interface StorePageInteractiveWrapperProps {
  storeData: FoodStore;
}

export function StorePageInteractiveWrapper({
  storeData,
}: StorePageInteractiveWrapperProps) {
  const t = useTranslations();

  const [sectionRefs, setSectionRefs] = useState<{
    [key: string]: React.RefObject<HTMLDivElement>;
  }>({});

  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const [selectedBasketItemToEditKey, setSelectedBasketItemToEditKey] =
    useState<string | null>(null);

  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const [basketData, setBasketData] = useState<BasketState>({
    foodStore: storeData,
    orderItems: [],
  });
  const onEditBasketItemClick = (itemToEdit: BasketItem) => {
    setSelectedMenuItem(itemToEdit.itemDetails);
    setSelectedBasketItemToEditKey(itemToEdit.basketItemKey);
    setIsMenuItemDialogOpen(true);
  };
  const onRemoveBasketItemClick = (removedItem: BasketItem) => {
    const newBasketData = { ...basketData };
    newBasketData.orderItems = newBasketData.orderItems.filter(
      (item) => item.basketItemKey !== removedItem.basketItemKey
    );
    setBasketData(newBasketData);
    localStorage.setItem(
      `${storeData.slug}-basket-state`,
      JSON.stringify(newBasketData)
    );

    if (newBasketData.orderItems.length === 0) {
      setIsCartDialogOpen(false);
    }
  };

  const handleSectionsRefs = () => {
    const _refs = storeData.menuSections.reduce((acc, section) => {
      return {
        ...acc,
        [section.sectionSlug]: createRef(),
      };
    }, {});
    setSectionRefs(_refs);
  };
  const activeMenuSection = useIntersectionObserver(sectionRefs);
  // Handle category click
  const handleSectionClick = (sectionSlug: string) => {
    const section = sectionRefs[sectionSlug].current;
    if (section) {
      const headerOffset = 120; // Adjust based on your header height
      const sectionPosition = section.getBoundingClientRect().top;
      const offsetPosition = sectionPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // load from localstorage per store
  useEffect(() => {
    handleSectionsRefs();

    const storedBasketData = localStorage.getItem(
      `${storeData.slug}-basket-state`
    );
    if (storedBasketData) {
      const parsedBasketStateData: BasketState = JSON.parse(storedBasketData);
      setBasketData(parsedBasketStateData);
    }
  }, [storeData]);

  // food search bar
  // const [filteredIMenuItemsList, setFilteredMenuItemsList] = useState(selectedFoodStore.menu);
  const [searchFoodText, setSearchFoodText] = useState("");
  const onFoodSearchChange = (value: string) => {
    setSearchFoodText(value);
    // filter food
    /* const filteredFood = selectedFoodStore?.menuSections.filter((item) => {
        return (
          item.sectionTitle.toLowerCase().includes(value.toLowerCase()) ||
          item.menuItems.some((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
          )
        );
      });
      filteredFood?.forEach((section) => {
        section.menuItems = section.menuItems.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
      });
      console.log({ filteredFood }); */
  };
  const clearFoodSearch = () => {
    setSearchFoodText("");
  };

  // function to open a modal displaying details of a selected article from a restaurant category card
  const openMenuItemModalFunction = (itemTakenFromMenuItemsCard: MenuItem) => {
    setSelectedMenuItem(itemTakenFromMenuItemsCard);
    setIsMenuItemDialogOpen(true);
  };

  return (
    <>
      <div>
        {/* <BannerRestaurant selectedStore={selectedRestaurant} /> */}
        <div className="container w-full">
          <RestaurantCard foodStore={storeData} />
        </div>

        {/* Restaurant food sections swiper and searchbar */}
        <div className="sticky top-0 left-0 right-0 bg-white shadow-md z-10">
          <div className="container mx-auto px-4 py-4">
            {/* Search food bar */}
            <SearchBar
              placeholder={`${t("pages.store.searchFood")} ${
                storeData.name
              } ...`}
              searchText={searchFoodText}
              onSearchChange={onFoodSearchChange}
              clearSearch={clearFoodSearch}
            />

            {/* Food sections swiper */}
            <div className="mt-4 -mx-4 px-4 overflow-hidden">
              <FoodSectionSwiper
                foodSections={storeData.menuSections}
                activeSection={activeMenuSection}
                onSectionClick={handleSectionClick}
              />
            </div>
          </div>
        </div>

        {/* Restaurant menu items list per category */}
        <div className="container mx-auto pt-8">
          {storeData.menuSections.map((menuSection) => (
            <div
              key={`menu-section_KEY_${menuSection.sectionSlug}`}
              ref={sectionRefs[menuSection.sectionSlug]}
              className="mb-8 scroll-mt-32"
            >
              <h2 className="text-2xl font-bold mb-4">
                {menuSection.sectionTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuSection.menuItems.map(
                  (item: MenuItem, dishIdx: number) => (
                    <RestaurantMenuItemCard
                      key={"card-restaurant-menuitem_KEY_" + dishIdx}
                      menuItem={item}
                      onClick={(itemTakenFromMenuItemsCard) =>
                        openMenuItemModalFunction(itemTakenFromMenuItemsCard)
                      }
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Basket (cart) sticky bottom button */}
        <StickyBasketButton
          setIsCartDialogOpen={setIsCartDialogOpen}
          basketData={basketData}
        />
      </div>

      {/* Product modal */}
      {!!selectedMenuItem && isMenuItemDialogOpen && (
        <FoodMenuItemDialog
          isOpen={isMenuItemDialogOpen}
          setIsOpen={setIsMenuItemDialogOpen}
          foodMenuItem={selectedMenuItem}
          basketData={basketData}
          setBasketData={setBasketData}
          selectedBasketItemToEditKey={selectedBasketItemToEditKey}
          setSelectedBasketItemToEditKey={setSelectedBasketItemToEditKey}
        />
      )}

      {/* Cart Modal Mobile mode */}
      {!!isCartDialogOpen && (
        <BasketDialog
          basketData={basketData}
          isOpen={isCartDialogOpen}
          setIsOpen={setIsCartDialogOpen}
          editItem={onEditBasketItemClick}
          removeItemFromBasket={onRemoveBasketItemClick}
        />
      )}
    </>
  );
}
