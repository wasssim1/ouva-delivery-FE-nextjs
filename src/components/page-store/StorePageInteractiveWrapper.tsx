"use client";

import { useTranslations } from "next-intl";
import { createRef, useEffect, useState } from "react";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { BasketState } from "@/interfaces/basket.interface";
import {
  FoodStore,
  MenuItem,
  MenuSection,
} from "@/interfaces/food-store.interface";

import { notFound } from "next/navigation";
import FoodStoreCard from "../card/FoodStoreCard";
import { RestaurantMenuItemCard } from "../card/FoodStoreMenuItemCard";
import {
  BasketDialog,
  getStoreBasketFromLocalStorage,
} from "../dialog/BasketDialog";
import { FoodMenuItemDialog } from "../dialog/FoodMenuItemDialog";
import { FoodSectionSwiper } from "../FoodSectionSwiper";
import { SearchBar } from "../ui/search-bar";
import { StickyBasketButton } from "./StickyBasketButton";

interface StorePageInteractiveWrapperProps {
  storeData: FoodStore;
  menuItemsPerStore: MenuItem[];
}

export function StorePageInteractiveWrapper({
  storeData,
  menuItemsPerStore,
}: StorePageInteractiveWrapperProps) {
  if (!storeData || !menuItemsPerStore?.length) notFound();

  const t = useTranslations();

  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [sectionRefs, setSectionRefs] = useState<{
    [key: string]: React.RefObject<HTMLDivElement>;
  }>({});

  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const [basketData, setBasketData] = useState<BasketState>({
    foodStoreSlug: storeData.slug,
    basketItems: [],
    totalPrice: 0,
  });

  // const onEditBasketItemClick = async (itemToEdit: BasketItem) => {
  //   const resp = await fetch(
  //     `http://localhost:8080/baskets/${itemToEdit.basketItemKey}`
  //   );
  //   const basketData = await resp.json();
  //   setSelectedMenuItem(itemToEdit.menuItemInfo);

  //   setSelectedBasketItemToEditKey(itemToEdit.basketItemKey);
  //   setIsMenuItemDialogOpen(true);
  // };

  const onRemoveBasketItemClick = (removedBasketItemKey: string) => {
    //   const newBasketData = { ...basketData };
    //   newBasketData.orderItems = newBasketData.orderItems.filter(
    //     (item) => item.basketItemKey !== removedItem.basketItemKey
    //   );
    //   setBasketData(newBasketData);
    //   localStorage.setItem(
    //     `${storeData.slug}-basket-state`,
    //     JSON.stringify(newBasketData)
    //   );
    //   if (newBasketData.orderItems.length === 0) {
    //     setIsCartDialogOpen(false);
    //   }
  };

  const handleSectionsRefs = () => {
    const _refs = menuSections.reduce((acc, section) => {
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
    const section = sectionRefs[sectionSlug]?.current;
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
    const menuSections = groupByMenuSection(menuItemsPerStore);
    setMenuSections(menuSections);

    const fetchBasketData = async () => {
      const basketDataResp = await fetchBasketDataFromApi(storeData.slug);
      if (basketDataResp) setBasketData(basketDataResp);
    };

    fetchBasketData();
  }, [storeData]);

  useEffect(() => {
    handleSectionsRefs();
  }, [menuSections]);

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
        <div className="container w-full">
          <FoodStoreCard foodStore={storeData} isFullWidthImg={true} />
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
                menuSections={menuSections}
                activeSection={activeMenuSection}
                onSectionClick={handleSectionClick}
              />
            </div>
          </div>
        </div>

        {/* Restaurant menu items list per category */}
        <div className="container mx-auto pt-8">
          {menuSections.map((menuSection) => (
            <div
              key={`menu-section_KEY_${menuSection.sectionSlug}`}
              ref={sectionRefs[menuSection.sectionSlug]}
              className="mb-8 scroll-mt-32"
            >
              <h2 className="text-2xl font-bold mb-4">
                {menuSection.sectionTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuSection.menuItems?.map(
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
        />
      )}

      {/* Cart Modal Mobile mode */}
      {!!isCartDialogOpen && (
        <BasketDialog
          storeMenuItems={menuItemsPerStore}
          storeMinOrderAmount={storeData?.shippingCost?.minOrder}
          basketData={basketData}
          setBasketData={setBasketData}
          isOpen={isCartDialogOpen}
          setIsOpen={setIsCartDialogOpen}
          removeItemFromBasket={onRemoveBasketItemClick}
        />
      )}
    </>
  );
}

export async function fetchBasketDataFromApi(
  storeSlug: string
): Promise<BasketState | undefined> {
  const allBasketsStorage = getStoreBasketFromLocalStorage();
  if (allBasketsStorage && allBasketsStorage[storeSlug]) {
    const basketStorageKey = allBasketsStorage[storeSlug].basketStorageKey;
    if (!basketStorageKey) return;

    const basketData = await fetch(
      `${process.env.NEXT_PUBLIC_OUVA_API_URL}/baskets/${basketStorageKey}`
    );
    if (!basketData.ok) {
      console.error("Error fetching basket data");
      return;
    }
    const basketDataJson: BasketState = await basketData.json();
    return basketDataJson;
  }
}

function groupByMenuSection(menuItems: any[]) {
  return menuItems.reduce((sections: any[], menuItem) => {
    const sectionSlug = menuItem.menuSection.slug;
    const sectionTitle = menuItem.menuSection.name;

    // Check if the section already exists
    let section = sections.find((sec) => sec.sectionSlug === sectionSlug);

    if (!section) {
      // If the section doesn't exist, create and add it
      section = { sectionSlug, sectionTitle, menuItems: [] };
      sections.push(section);
    }

    if (!section.menuItems) section.menuItems = [];

    // Add the current menu item to the section's items
    section.menuItems.push({
      slug: menuItem.slug,
      name: menuItem.name,
      description: menuItem.description,
      basePrice: menuItem.basePrice,
      maxOrderCount: menuItem.maxPerOrder,
      ingredients: menuItem.ingredients,
      options: menuItem.menuOptions,
      extras: menuItem.extras,
      imageUrl: menuItem.imageUrl,
    });

    return sections;
  }, []);
}
