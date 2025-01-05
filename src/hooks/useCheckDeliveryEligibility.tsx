import { useEffect, useState } from "react";

import { BasketState } from "@/interfaces/basket.interface";
import { calculateBasketTotalPriceWithDelivery } from "@/lib/utils";

// custom hook to check eligibility for delivery
const useCheckDeliveryEligibility = (basket: BasketState) => {
  const [isEligible, setIsEligible] = useState(true);

  useEffect(() => {
    if (!basket?.orderItems?.length) {
      setIsEligible(false);
      return;
    }

    if (!basket.foodStore.shippingCost) {
      setIsEligible(false);
      return;
    }

    if (
      calculateBasketTotalPriceWithDelivery(basket) < basket.foodStore.shippingCost.minOrder
    ) {
      setIsEligible(false);
      return;
    }

    // if all restaurants meet the condition, set isEligible to true
    setIsEligible(true);
  }, [basket]);

  return isEligible; // returns a boolean value
};

export default useCheckDeliveryEligibility;
