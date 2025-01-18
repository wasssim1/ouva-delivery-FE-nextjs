import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  BasketItem,
  BasketState,
  UpsertBasketItemRequestDto,
  UpsertBasketItemResponseDto,
} from "@/interfaces/basket.interface";
import {
  MenuItem,
  MenuItemExtra,
  MenuItemOption,
  MenuItemOptionsGroup,
} from "@/interfaces/food-store.interface";
import { toLocaleCurrency } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MenuItemQuantityButtons } from "../page-store/MenuItemQuantityButtons";
import { saveStoreBasketToLocalStorage } from "./BasketDialog";

interface FoodMenuItemDialogProps {
  foodMenuItem: MenuItem;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  basketData: BasketState;
  setBasketData: Dispatch<SetStateAction<BasketState>>;
}

export function FoodMenuItemDialog({
  foodMenuItem,
  basketData,
  isOpen,
  setIsOpen,
  setBasketData,
}: FoodMenuItemDialogProps) {
  const t = useTranslations();

  // const dispatch = useDispatch();
  // const cart = useSelector((state: RootState) => state.cart);

  const [itemSelection, setItemSelection] = useState<BasketItem>(
    {} as BasketItem
  );

  const onSelectedOptionChange = (
    optionGroup: MenuItemOptionsGroup,
    option: MenuItemOption
  ) => {
    const newSelection = { ...itemSelection };

    if (
      newSelection.selectedOptions?.some(
        (i) => i.optionKey === optionGroup.optionKey
      )
    ) {
      // replace the previous option
      newSelection.selectedOptions.forEach((iGrp) => {
        if (iGrp.optionKey === optionGroup.optionKey) {
          iGrp.optionValueSlug = option.slug;
        }
      });
    } else {
      // add the new option
      if (!newSelection.selectedOptions) newSelection.selectedOptions = [];
      newSelection.selectedOptions.push({
        optionKey: optionGroup.optionKey,
        optionValueSlug: option.slug,
      });
    }

    // newSelection.basketItemKey = `${
    //   foodMenuItem.slug
    // }_${newSelection.selectedOptions
    //   .map((opt) => `${opt.optionKey}-${opt.optionValue.slug}`)
    //   .join("_")}${
    //   newSelection.selectedExtras?.length
    //     ? "_" + newSelection.selectedExtras.map((ing) => ing.slug).join("-")
    //     : ""
    // }`;

    newSelection.unitPrice = calculateBasketItemUnitPrice(
      newSelection,
      foodMenuItem
    );

    setItemSelection(newSelection);
  };

  const onExtraIngredientChange = (selectedExtra: MenuItemExtra) => {
    const newSelection = { ...itemSelection };

    if (
      newSelection.selectedExtrasSlugs?.some(
        (extraSlug) => extraSlug === selectedExtra.slug
      )
    ) {
      newSelection.selectedExtrasSlugs =
        newSelection.selectedExtrasSlugs.filter(
          (extraSlug) => extraSlug !== selectedExtra.slug
        );
    } else {
      if (!newSelection.selectedExtrasSlugs)
        newSelection.selectedExtrasSlugs = [];
      newSelection.selectedExtrasSlugs.push(selectedExtra.slug);
    }

    newSelection.unitPrice = calculateBasketItemUnitPrice(
      newSelection,
      foodMenuItem
    );

    setItemSelection(newSelection);
  };

  const onUpdateSelectionQte = (quantity: number) => {
    setItemSelection((prev) => ({
      ...prev,
      quantity,
      unitPrice: calculateBasketItemUnitPrice(prev, foodMenuItem),
    }));
  };

  // functions to add an article to the basket
  const addItemToBasket = async (basketItemToAdd: BasketItem) => {
    try {
      // map the basket item to the API payload
      const basketItemPayload: UpsertBasketItemRequestDto = {
        menuItemSlug: basketItemToAdd.menuItemSlug,
        foodStoreSlug: basketData.foodStoreSlug,
        quantity: basketItemToAdd.quantity,
        unitPrice: basketItemToAdd.unitPrice,
        selectedOptions: basketItemToAdd.selectedOptions,
        selectedExtrasSlugs: basketItemToAdd.selectedExtrasSlugs,
        note: basketItemToAdd.note,
        basketStorageKey: basketData.basketStorageKey,
        userId: undefined, // TODO: get the user ID from the session
      };

      // call the API to add the item to the basket
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_OUVA_API_URL}/baskets${
          basketData.basketStorageKey ? `/${basketData.basketStorageKey}` : ""
        }`,
        {
          method: basketData.basketStorageKey ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(basketItemPayload),
        }
      );

      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      const basketSummaryData: UpsertBasketItemResponseDto = await resp.json();
      if (!basketSummaryData.basketStorageKey) {
        throw new Error("Basket storage key not found");
      }

      setBasketData((prev: BasketState) => {
        const _basketState: BasketState = {
          ...prev,
          basketStorageKey: basketSummaryData.basketStorageKey,
          basketItems: basketSummaryData.basketItems,
          totalPrice: basketSummaryData.totalAmount,
        };

        // Save the basket state to local storage
        saveStoreBasketToLocalStorage(_basketState);

        return _basketState;
      });

      // close the dialog
      setIsOpen(false);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  };

  useEffect(() => {
    setItemSelection((prev) => ({
      ...prev,
      menuItemSlug: foodMenuItem.slug,
      unitPrice: 0,
      quantity: 1,
      selectedOptions: [],
      selectedExtrasSlugs: [],
      note: "",
    }));
  }, [foodMenuItem]);

  useEffect(() => {
    return () => {
      // cleanup
      setItemSelection({} as BasketItem);
    };
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[70%]" title={t("common.close")}>
          <DialogHeader className="sticky">
            <DialogTitle className="text-primary text-xl capitalize">
              {`${foodMenuItem.name}, ${basketData.foodStoreSlug}`}
            </DialogTitle>
          </DialogHeader>

          <div className="my-10 space-y-5 overflow-y-auto">
            {/* <Image
              src={foodMenuItem.image}
              alt={foodMenuItem.name}
              width={120}
              height={120}
              className="rounded-lg object-cover"
            /> */}

            {/* description */}
            {foodMenuItem.description && (
              <div>
                <DialogTitle className="text-primary text-lg font-semibold">
                  {t("pages.store.description")}
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-sm italic select-none">
                  <span>{foodMenuItem.description}</span>
                </DialogDescription>
              </div>
            )}

            {/* show ingredients */}
            {!!foodMenuItem.ingredients?.length && (
              <div className="">
                <DialogTitle className="text-primary text-lg font-semibold">
                  {t("pages.store.ingredients")}
                </DialogTitle>
                <DialogDescription className="text-sm italic select-none">
                  <span>{foodMenuItem.ingredients.join(", ")}</span>
                </DialogDescription>
              </div>
            )}

            {/* list of menu item options groups - each group in Radio button (single selection) */}
            {!!foodMenuItem.options?.length && (
              <div className="">
                <DialogTitle className="text-primary text-lg font-semibold">
                  {t("pages.store.chooseOptions")}
                </DialogTitle>
                <ul className="list-none">
                  {foodMenuItem.options.map((optionGroup) => (
                    <li key={optionGroup.optionKey} className="ml-2 py-2">
                      <ul className="list-none">
                        <DialogTitle className="text-primary text-md font-semibold">
                          {t(`common.${optionGroup.optionKey}`)}
                        </DialogTitle>
                        {optionGroup.optionValues?.map((optionVal) => (
                          <li
                            key={optionVal.slug}
                            className="flex justify-between items-center space-y-1"
                          >
                            <div className="space-x-2">
                              <input
                                className="accent-primary"
                                type="radio"
                                name="options"
                                id={optionVal.name}
                                value={optionVal.slug}
                                // checked={
                                //   itemSelection.selectedOptions?.find(
                                //     (selectedOption) =>
                                //       selectedOption.optionKey ===
                                //       optionGroup.optionKey
                                //   )?.optionValue.slug === option.slug
                                // }
                                onChange={() =>
                                  onSelectedOptionChange(optionGroup, optionVal)
                                }
                              />
                              <span>{optionVal.name}</span>
                            </div>
                            <span>{toLocaleCurrency(optionVal.price)}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* list of menu item extra ingredients in checkboxes (multi-selection) */}
            {!!(
              itemSelection.selectedOptions?.length &&
              foodMenuItem.extras?.length
            ) && (
              <div className="">
                <DialogTitle className="text-primary text-lg font-semibold">
                  {t("pages.store.chooseExtras")}
                </DialogTitle>
                <ul className="list-none">
                  {foodMenuItem.extras?.map((menuExtra) => (
                    <li
                      key={menuExtra.slug}
                      className="flex justify-between items-center space-y-1"
                    >
                      <div className="space-x-2">
                        <input
                          className="accent-primary"
                          type="checkbox"
                          name="ingredients"
                          id={menuExtra.name}
                          value={menuExtra.name}
                          checked={itemSelection.selectedExtrasSlugs?.some(
                            (selectedExtra) => selectedExtra === menuExtra.slug
                          )}
                          onChange={() => onExtraIngredientChange(menuExtra)}
                        />
                        <span>{menuExtra.name}</span>
                      </div>
                      <span>{toLocaleCurrency(menuExtra.extraPrice)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {!!itemSelection.unitPrice && (
            <DialogFooter className="sticky">
              <span className="flex items-center justify-between">
                <MenuItemQuantityButtons
                  quantity={itemSelection.quantity}
                  updateSelectionQte={onUpdateSelectionQte}
                  maxQuantityCount={foodMenuItem.maxOrderCount}
                />
                {!!itemSelection.unitPrice && (
                  <button
                    className="flex justify-between items-center p-3 font-bold text-white rounded-2xl bg-primary hover:bg-secondary"
                    onClick={() => addItemToBasket(itemSelection)}
                  >
                    {t("pages.store.addToBasket")}{" "}
                    {toLocaleCurrency(
                      itemSelection.unitPrice * itemSelection.quantity
                    )}
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

// Utility to calculate the total price of a basket item
function calculateBasketItemUnitPrice(
  basketItemSelection: BasketItem,
  foodMenuItem: MenuItem
) {
  const optionsTotal = basketItemSelection.selectedOptions.reduce(
    (totalOptions, i) => {
      const menuOption = foodMenuItem?.options
        ?.find((opt) => opt.optionKey === i.optionKey)
        ?.optionValues.find((opt) => opt.slug === i.optionValueSlug);
      if (!menuOption) return totalOptions;
      return totalOptions + menuOption?.price;
    },
    0
  );

  const extrasTotal = basketItemSelection.selectedExtrasSlugs?.length
    ? basketItemSelection.selectedExtrasSlugs.reduce((totalExtras, i) => {
        const menuExtra = foodMenuItem?.extras?.find(
          (extra) => extra.slug === i
        );
        if (!menuExtra) return totalExtras;
        return totalExtras + menuExtra.extraPrice;
      }, 0)
    : 0;

  return optionsTotal + extrasTotal;
}
