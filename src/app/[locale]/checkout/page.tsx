"use client";

import { Suspense, useEffect, useState } from "react";

// components
import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";
import CheckoutBasket from "@/components/page-checkout/CheckoutBasket";
import CheckoutUserProfile from "@/components/page-checkout/CheckoutUserProfile";
import { BasketState } from "@/interfaces/basket.interface";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const params = useSearchParams();

  const [isMounted, setIsMounted] = useState(false);
  const [basketData, setBasketData] = useState<BasketState>({} as BasketState);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // unhash the local storage item key and get the basket items.
      if (!params) return;
      const basketStorageKey = atob(params.get("basket") as string);
      const loadedBasketData = localStorage.getItem(basketStorageKey);
      if (loadedBasketData) {
        const basketDataParsed: BasketState = JSON.parse(loadedBasketData);
        setBasketData(basketDataParsed);
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
            <CheckoutBasket basketData={basketData} />
            <Suspense fallback={null}>
              <CheckoutUserProfile basketData={basketData} />
            </Suspense>
          </div>
        </div>
        <Footer />
      </LayoutContainer>
    </>
  );
};

export default Page;
