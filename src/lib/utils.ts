import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { BasketState } from "@/interfaces/basket.interface";
import { defaultCurrency, defaultCurrencyLocale } from "@/settings/const";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toLocaleCurrency(value?: number) {
  if (!value) return value;

  return value.toLocaleString(defaultCurrencyLocale, {
    style: "currency",
    currency: defaultCurrency,
  });
}

export function calculateTotalBasketItemsPrice(basketData: BasketState) {
  if (!basketData.basketItems?.length) {
    return 0;
  }

  return basketData.basketItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
}

export const calculateBasketTotalPriceWithDelivery = (
  basketData: BasketState,
  storeShippingCost: number
) => {
  const itemsPrice = calculateTotalBasketItemsPrice(basketData);

  return itemsPrice + (storeShippingCost || 0);
};
