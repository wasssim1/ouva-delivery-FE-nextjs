import { useEffect, useState } from "react";

import { BasketState } from "@/interfaces/basket.interface";
import { FoodStore } from "@/interfaces/food-store.interface";
import { calculateBasketTotalPriceWithDelivery } from "@/lib/utils";

// custom hook to check eligibility for delivery
const useCheckDeliveryEligibility = (
  basket: BasketState,
  storeInfo: FoodStore
) => {
  const [isEligible, setIsEligible] = useState(true);

  useEffect(() => {
    if (!basket?.basketItems?.length) {
      setIsEligible(false);
      return;
    }

    if (!storeInfo?.shippingCost) {
      setIsEligible(false);
      return;
    }

    if (
      calculateBasketTotalPriceWithDelivery(
        basket,
        storeInfo.shippingCost.cost
      ) < storeInfo.shippingCost.minOrder
    ) {
      setIsEligible(false);
      return;
    }

    // if order meets the condition, set isEligible to true
    setIsEligible(true);
  }, [basket]);

  return isEligible; // returns a boolean value
};

export default useCheckDeliveryEligibility;
