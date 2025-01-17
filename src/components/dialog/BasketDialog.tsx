import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BasketItem, BasketState } from "@/interfaces/basket.interface";
import { MenuItem } from "@/interfaces/food-store.interface";
import { calculateTotalBasketItemsPrice, toLocaleCurrency } from "@/lib/utils";
import { BasketQuantityButtons } from "../page-store/BasketQuantityButtons";

interface CartDialogProps {
  storeMenuItems?: MenuItem[];
  storeMinOrderAmount: number;
  basketData: BasketState;
  setBasketData: Dispatch<SetStateAction<BasketState>>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  removeItemFromBasket: (basketItemKey: string) => void;
}

export function BasketDialog({
  storeMenuItems,
  storeMinOrderAmount,
  basketData,
  setBasketData,
  isOpen,
  setIsOpen,
}: CartDialogProps) {
  const t = useTranslations();
  const language = useLocale();
  const router = useRouter();

  const [isRequestPending, setIsRequestPending] = useState(false);

  if (!storeMenuItems?.length) return null;
  if (!basketData?.basketItems || !basketData?.foodStoreSlug) return null;

  const backToMenuSelection = () => {
    setIsOpen(false);
  };

  const onUpdateBasketItemQuantity = async (
    basketItem: BasketItem,
    operation: "inc" | "dec"
  ) => {
    if (!basketData.basketStorageKey) return;

    const payloadBody: { fromQuantity: number; operation: "inc" | "dec" } = {
      fromQuantity: basketItem.quantity,
      operation,
    };
    setIsRequestPending(true);
    fetch(
      `${process.env.NEXT_PUBLIC_OUVA_API_URL}/baskets/${basketData.basketStorageKey}?item=${basketItem.basketItemKey}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadBody),
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        setIsRequestPending(false);
        if (!resp.basketStorageKey) return;
        setBasketData((prev: BasketState) => {
          const _basketState: BasketState = {
            ...prev,
            basketStorageKey: resp.basketStorageKey,
            basketItems: resp.basketItems,
            totalPrice: resp.totalAmount,
          };

          // Save the basket state to local storage
          saveStoreBasketToLocalStorage(_basketState);

          return _basketState;
        });
      })
      .catch((err) => {
        console.error(err);
        setIsRequestPending(false);
      });
  };

  const removeItemFromBasket = (item: BasketItem) => {
    if (!basketData.basketStorageKey) return;

    setIsRequestPending(true);
    fetch(
      `${process.env.NEXT_PUBLIC_OUVA_API_URL}/baskets/${basketData.basketStorageKey}?item=${item.basketItemKey}`,
      {
        method: "DELETE",
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        setIsRequestPending(false);
        if (!resp.basketStorageKey) return;

        setBasketData((prev: BasketState) => {
          const _basketState: BasketState = {
            ...prev,
            basketStorageKey: resp.basketStorageKey,
            basketItems: resp.basketItems,
            totalPrice: resp.totalAmount,
          };

          // Save the basket state to local storage
          saveStoreBasketToLocalStorage(_basketState);

          return _basketState;
        });
      })
      .catch((err) => {
        console.error(err);
        setIsRequestPending(false);
      });
  };

  const toCheckout = () => {
    if (!isRequestPending) return;
    if (!basketData.basketStorageKey) return;
    setIsOpen(false);
    router.push(`/${language}/checkout?basket=${basketData.basketStorageKey}`);
  };

  const retrieveMenuItemDetail = (menuItemSlug: string) =>
    storeMenuItems.find((menuItem) => menuItem.slug === menuItemSlug);

  const retrieveOptionDetail = (
    menuItemSlug: string,
    optionKey: string,
    optionValueSlug: string
  ) =>
    retrieveMenuItemDetail(menuItemSlug)
      ?.options?.find((option) => option.optionKey === optionKey)
      ?.optionValues.find(
        (optionValue) => optionValue.slug === optionValueSlug
      );

  const retrieveExtraDetail = (menuItemSlug: string, extraSlug: string) =>
    retrieveMenuItemDetail(menuItemSlug)?.extras?.find(
      (extra) => extra.slug === extraSlug
    );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[70%]" title={t("common.close")}>
          <DialogHeader className="sticky">
            <DialogTitle className="text-lg text-primary font-semibold capitalize">
              {/* TODO: use storeName instead */}
              {`${basketData.foodStoreSlug}: ${t("pages.store.yourBasket")}`}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-2 overflow-y-auto">
            {basketData.basketItems.map((item, index) => (
              <div
                key={`KEY_${item?.basketItemKey}-${index}`}
                className=" border-b border-gray-200 py-5"
              >
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-lg text-primary capitalize">
                      {retrieveMenuItemDetail(item.menuItemSlug)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm">{item.quantity} x </span>
                    <span className="text-sm">
                      {toLocaleCurrency(item.unitPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm">
                      {toLocaleCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>

                {item.selectedOptions?.map(
                  (selectedOption) =>
                    selectedOption && (
                      <div key={selectedOption.optionKey} className="ml-1">
                        <span className="text-md">
                          {item.selectedOptions.map((optGrp) => (
                            <>
                              {t("common." + optGrp.optionKey)}:{" "}
                              {optGrp.optionValueSlug}
                              {toLocaleCurrency(
                                retrieveOptionDetail(
                                  item.menuItemSlug,
                                  optGrp.optionKey,
                                  optGrp.optionValueSlug
                                )?.price
                              )}
                            </>
                          ))}
                        </span>
                      </div>
                    )
                )}

                {!!item.selectedExtrasSlugs?.length && (
                  <div className="flex text-sm space-x-1 ml-3">
                    <span>{`Extra (x ${item.quantity}): `}</span>
                    {item.selectedExtrasSlugs.map((extra) => (
                      <span key={extra} className="italic">
                        {extra} (
                        {toLocaleCurrency(
                          retrieveExtraDetail(item.menuItemSlug, extra)
                            ?.extraPrice
                        )}
                        )
                      </span>
                    ))}
                  </div>
                )}

                {/* Edit and Delete buttons */}
                <div className="flex justify-end space-x-2 mt-3 text-primary">
                  <BasketQuantityButtons
                    basketItem={item}
                    onUpdateBasketItemQte={onUpdateBasketItemQuantity}
                    onRemoveBasketItem={removeItemFromBasket}
                    isRequestPending={isRequestPending}
                    // maxQuantityCount={foodMenuItem.maxOrderCount}
                  />
                </div>
              </div>
            ))}
          </div>

          {!!basketData.basketItems?.length && (
            <DialogFooter className="sticky">
              <span className="flex items-center justify-center space-x-3">
                {calculateTotalBasketItemsPrice(basketData) <
                storeMinOrderAmount ? (
                  <div>
                    <button
                      className="text-primary bg-white ring-1 ring-primary py-2 px-4 rounded-md hover:bg-primary hover:text-white"
                      onClick={backToMenuSelection}
                    >
                      {t("common.addMoreItems")}{" "}
                    </button>
                    <p className="relative text-xs italic text-right text-secondary top-2 lg:top-1 right-3">
                      {t("common.minOrderRequired")} (
                      {toLocaleCurrency(storeMinOrderAmount)})
                    </p>
                  </div>
                ) : (
                  <button
                    className="bg-primary text-white py-2 px-4 rounded-md hover:text-primary hover:bg-white hover:ring-1 hover:ring-primary"
                    disabled={isRequestPending}
                    onClick={toCheckout}
                  >
                    {t("common.checkout")}{" "}
                    {`(${toLocaleCurrency(
                      calculateTotalBasketItemsPrice(basketData)
                    )})`}
                  </button>
                )}
              </span>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Utility functions to manage basket state in local storage
const LOCAL_STORAGE_KEY = "ouva_basket";

export const getStoreBasketFromLocalStorage = (): {
  [x: string]: BasketState;
} => {
  const storeStorageKey = `${LOCAL_STORAGE_KEY}`;

  const allBaskets = localStorage.getItem(storeStorageKey);
  if (!allBaskets) return {};
  const allBasketsStorage = JSON.parse(allBaskets);

  return { ...allBasketsStorage };
};

export const saveStoreBasketToLocalStorage = (basket: BasketState) => {
  const storeStorageKey = `${LOCAL_STORAGE_KEY}`;
  const allBasketsStorage = getStoreBasketFromLocalStorage();

  let toStore = {
    ...allBasketsStorage,
    [basket.foodStoreSlug]: basket,
  };

  localStorage.setItem(storeStorageKey, JSON.stringify(toStore));
};

export const clearLocalBasketByStorageKey = (basketKey: string) => {
  const storeStorageKey = `${LOCAL_STORAGE_KEY}`;
  const allBasketsStorage = getStoreBasketFromLocalStorage();
  const newBaskets = { ...allBasketsStorage };

  delete newBaskets[basketKey];
  localStorage.setItem(storeStorageKey, JSON.stringify(newBaskets));
};

export const clearAllLocalBaskets = () => {
  localStorage.removeItem(`${LOCAL_STORAGE_KEY}`);
};
