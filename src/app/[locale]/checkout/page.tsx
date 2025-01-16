"use client";

import { Suspense, useEffect, useState } from "react";

// components
import { getStoreBasketFromLocalStorage } from "@/components/dialog/BasketDialog";
import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";
import CheckoutBasket from "@/components/page-checkout/CheckoutBasket";
import CheckoutUserProfile from "@/components/page-checkout/CheckoutUserProfile";
import { BasketState } from "@/interfaces/basket.interface";
import { FoodStore } from "@/interfaces/food-store.interface";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const params = useSearchParams();

  const [isMounted, setIsMounted] = useState(false);
  const [basketData, setBasketData] = useState<BasketState>({} as BasketState);
  const [storeInfo, setStoreInfo] = useState<FoodStore>({} as FoodStore);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!params) return;

    if (isMounted) {
      // fetch basket data
      const allBasketStorage = getStoreBasketFromLocalStorage();
      const basket = Object.values(allBasketStorage).find((basketVal) => {
        return basketVal.basketStorageKey === params.get("basket");
      });

      if (basket) {
        // fetch basket data
        const fetchBasketData = async () => {
          const basketSummaryData: BasketState & { storeInfo: FoodStore } =
            await fetch(
              `${process.env.NEXT_PUBLIC_OUVA_API_URL}/baskets/${basket.basketStorageKey}?isCheckout=true`
            ).then((res) => res.json());

          if (!basketSummaryData?.basketStorageKey) return;
          console.log({ basketSummaryData });
          const { storeInfo: _storeInfo, ...rest } = basketSummaryData;
          setBasketData({ ...rest });
          setStoreInfo(_storeInfo);
        };

        fetchBasketData();
      }
    }
  }, [isMounted, params]);

  return (
    <>
      <LayoutContainer>
        <Navbar />
        <div>
          <div
            className={`grid h-full max-w-xl gap-6 mx-auto bg-gray-100 xs:p-4 sm:p-8 md:max-w-xl lg:max-w-5xl xl:gap-8 lg:grid-cols-2 xl:grid-cols-5 lg:rounded-md xl:max-w-7xl`}
          >
            <CheckoutBasket basketData={basketData} storeInfo={storeInfo} />
            <Suspense fallback={null}>
              <CheckoutUserProfile basketData={basketData} storeInfo={storeInfo} />
            </Suspense>
          </div>
        </div>
        <Footer />
      </LayoutContainer>
    </>
  );
};

export default Page;
