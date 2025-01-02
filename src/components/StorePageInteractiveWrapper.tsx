"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { FoodStore, MenuItem } from "@/interfaces/foodStore.interface";
import { RootState } from "@/redux/store";

import { FoodSectionSwiper } from "./FoodSectionSwiper";
import LayoutContainer from "./LayoutContainer";
import { StickyBasketButton } from "./StickyBasketButton";
import RestaurantCard from "./card/RestaurantCard";
import { RestaurantMenuItemCard } from "./card/RestaurantMenuItemCard";
import { CartDialog } from "./dialog/CartDialog";
import { FoodMenuItemDialog } from "./dialog/FoodMenuItemDialog";
import Footer from "./footer/Footer";
import Navbar from "./navbar/Navbar";
import { SearchBar } from "./ui/search-bar";

interface StorePageInteractiveWrapperProps {
  storeData: FoodStore;
}

export function StorePageInteractiveWrapper({
  storeData,
}: StorePageInteractiveWrapperProps) {
  const t = useTranslations();
  //   const language = useLocale();

  //   const params = useParams();
  //   const storeSlug = params?.slug;
  //   const router = useRouter();

  //   const [initialRender, setInitialRender] = useState(true);
  //   const [selectedFoodStore, setSelectedFoodStore] =
  //     useState<FoodStore>(storeData);
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  // cart state from redux
  const cart = useSelector((state: RootState) => state.cart);

  // food search bar
  // const [menuItemsList, setMenuItemsList] = useState(selectedFoodStore.menu);
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

  // fetch the selected restaurant when the page is loaded and scroll to the top of the page
  //   useEffect(() => {
  //     if (storeData) {
  //       setSelectedFoodStore(storeData);
  //     } else {
  //       router.push(`/${language}/orders`);
  //     }
  //     // scroll to the top of the page
  //     window.scrollTo(0, 0);

  //     // if the selected restaurant is not found, redirect to the orders page
  //   }, [storeSlug, initialRender]);

  // function to open a modal displaying details of a selected article from a restaurant category card
  const openMenuItemModalFunction = (itemTakenFromMenuItemsCard: MenuItem) => {
    setSelectedMenuItem(itemTakenFromMenuItemsCard);
    setIsMenuItemDialogOpen(true);
  };

  /* BEGIN - Handle sticky foodSections swiper */
  // Create refs for each category section
  // if (!selectedFoodStore) return null;
  const sectionRefs: { [key: string]: React.RefObject<HTMLDivElement> } =
    storeData.menuSections.reduce((acc, section) => {
      return {
        ...acc,
        [section.sectionSlug]: useRef<HTMLDivElement>(null),
      };
    }, {});
  // console.log({ sectionRefs });

  // Use the intersection observer hook to track which section is in view
  const activeMenuSection = useIntersectionObserver(sectionRefs);

  // Handle category click
  const handleSectionClick = (sectionSlug: string) => {
    // console.log({ sectionSlug, sectionRefs });
    const section = sectionRefs[sectionSlug].current;
    // console.log({ section });
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
  /* END - Handle sticky foodSections swiper */

  return (
    <>
      <head>
        <title>{storeData.name} | Ouva Delivery</title>
      </head>
      <LayoutContainer>
        <Navbar />
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

          {/* restaurant menu items list per category */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-2xl lg:max-w-5xl gap-1.5 md:gap-0 my-5 md:my-9">
              {selectedRestaurant &&
                Object.keys(selectedRestaurant.menu).map((el, index) => (
                  <RestaurantCardCategory
                    key={"card-restaurant-category_KEY_" + index}
                    category={selectedRestaurant.menu[el]}
                    onClick={(dishTakenFromCategoryCard) =>
                      openArticleModalFunction(dishTakenFromCategoryCard)
                    }
                  />
                ))}
            </div> */}

          {/* Basket (cart) sticky bottom button */}
          <StickyBasketButton setIsCartDialogOpen={setIsCartDialogOpen} />
        </div>

        {/* Product modal */}
        {!!selectedMenuItem && (
          <FoodMenuItemDialog
            isOpen={isMenuItemDialogOpen}
            setIsOpen={setIsMenuItemDialogOpen}
            foodMenuItem={selectedMenuItem}
          />
        )}

        {/* Cart Modal Mobile mode */}
        {!!isCartDialogOpen && (
          <CartDialog
            isOpen={isCartDialogOpen}
            setIsOpen={setIsCartDialogOpen}
          />
        )}

        <Footer />
      </LayoutContainer>
    </>
  );
}
