import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { BasketState } from "@/interfaces/basket.interface";
import { defaultCurrency, defaultCurrencyLocale } from "@/settings/const";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toLocaleCurrency(value: number) {
  if (!value) return value;

  return value.toLocaleString(defaultCurrencyLocale, {
    style: "currency",
    currency: defaultCurrency,
  });
}

export function calculateTotalBasketItemsPrice(basketData: BasketState) {
  if (!basketData.orderItems?.length) {
    return 0;
  }

  return basketData.orderItems.reduce(
    (acc, item) => acc + item.finalUnitPrice * item.quantity,
    0
  );
}

export const calculateBasketTotalPriceWithDelivery = (
  basketData: BasketState
) => {
  const itemsPrice = calculateTotalBasketItemsPrice(basketData);

  return itemsPrice + (basketData.foodStore.shippingCost?.cost || 0);
};
