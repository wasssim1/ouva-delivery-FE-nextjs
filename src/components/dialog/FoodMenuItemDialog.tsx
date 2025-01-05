import { useTranslations } from "next-intl";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { BasketItem, BasketState } from "@/interfaces/basket.interface";
import {
  ExtraIngredient,
  MenuItem,
  MenuItemOption,
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
import { BasketItemQuantityButtons } from "../page-store/BasketItemQuantityButtons";

interface FoodMenuItemDialogProps {
  foodMenuItem: MenuItem;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  basketData: BasketState;
  setBasketData: Dispatch<SetStateAction<BasketState>>;
  selectedBasketItemToEditKey: string | null;
  setSelectedBasketItemToEditKey: Dispatch<SetStateAction<string | null>>;
}

export function FoodMenuItemDialog({
  foodMenuItem,
  basketData,
  isOpen,
  setIsOpen,
  setBasketData,
  selectedBasketItemToEditKey,
  setSelectedBasketItemToEditKey,
}: FoodMenuItemDialogProps) {
  const t = useTranslations();

  // const dispatch = useDispatch();
  // const cart = useSelector((state: RootState) => state.cart);

  const [isEditingKey, setIsEditing] = useState(selectedBasketItemToEditKey);
  const [itemSelection, setItemSelection] = useState<BasketItem>(
    {} as BasketItem
  );

  const onSelectedOptionChange = (option: MenuItemOption) => {
    const newSelection = { ...itemSelection };

    newSelection.basketItemKey = `${foodMenuItem.slug}_${option.slug}`;
    newSelection.selectedOption = option;
    newSelection.finalUnitPrice = option.price;

    setItemSelection(newSelection);
  };

  const onExtraIngredientChange = (ingredient: ExtraIngredient) => {
    const newSelection = { ...itemSelection };

    if (newSelection.selectedExtras?.some((i) => i.slug === ingredient.slug)) {
      newSelection.selectedExtras = newSelection.selectedExtras.filter(
        (i) => i.slug !== ingredient.slug
      );
      newSelection.finalUnitPrice -=
        ingredient.extraPrice * newSelection.quantity;
    } else {
      if (!newSelection.selectedExtras) newSelection.selectedExtras = [];
      newSelection.selectedExtras.push(ingredient);
      newSelection.finalUnitPrice +=
        ingredient.extraPrice * newSelection.quantity;
    }
    newSelection.basketItemKey = `${foodMenuItem.slug}_${
      newSelection.selectedOption.slug
    }_${newSelection.selectedExtras.map((ing) => ing.slug).join("_")}`;

    setItemSelection(newSelection);
  };

  const updateSelectionQte = (quantity: number) => {
    setItemSelection((prev) => ({
      ...prev,
      quantity,
      finalUnitPrice:
        quantity *
        (prev.selectedOption.price +
          (prev.selectedExtras
            ? prev.selectedExtras.reduce((acc, i) => acc + i.extraPrice, 0)
            : 0)),
    }));
  };

  // functions to add an article from the cart
  const addToCartFunction = (basketOrderItem: BasketItem) => {
    // TODO: fix cart edge-cases
    setBasketData((prev: BasketState) => {
      console.log({ prev });

      // handle existing items by increasing qte
      const existingEditedItemInBasket = prev.orderItems.find(
        (item) => item.basketItemKey === isEditingKey
      );

      let _basketState = { ...prev };

      console.log({ existingEditedItemInBasket, basketOrderItem });

      if (existingEditedItemInBasket) {
        let _orderItems = prev.orderItems.map((item) => {
          console.log({ item });

          if (item.basketItemKey === basketOrderItem.basketItemKey) {
            return {
              ...item,
              quantity: basketOrderItem.quantity + item.quantity,
            };
          }

          // if (item.basketItemKey === existingEditedItemInBasket.basketItemKey) {
          //   return {
          //     ...item,
          //     quantity: item.quantity + basketOrderItem.quantity,
          //   };
          // }

          return item;
        });

        if (
          basketOrderItem.basketItemKey !==
          existingEditedItemInBasket.basketItemKey
        ) {
          _orderItems = _orderItems.filter(
            (item) =>
              item.basketItemKey !== existingEditedItemInBasket.basketItemKey
          );
        }
        console.log({ _orderItems });

        _basketState = {
          ...prev,
          orderItems: _orderItems,
        };
      } else {
        // remove the edited item if basketItemKey is changed (changed option or extras)
        const _orderItems = prev.orderItems.filter(
          (item) => item.basketItemKey !== isEditingKey
        );

        _basketState = {
          ...prev,
          orderItems: [..._orderItems, basketOrderItem],
        };
      }

      localStorage.setItem(
        `${prev.foodStore.slug}-basket-state`,
        JSON.stringify(_basketState)
      );

      return _basketState;
    });

    // close the dialog
    setIsOpen(false);
  };

  useEffect(() => {
    if (isEditingKey) {
      setItemSelection((prev) => {
        const itemToEdit = basketData.orderItems.find(
          (item) => item.basketItemKey === isEditingKey
        );
        if (!itemToEdit) return prev;
        return {
          ...prev,
          ...itemToEdit,
        };
      });
    } else {
      setItemSelection((prev) => ({
        ...prev,
        basketItemKey: isEditingKey || foodMenuItem.slug,
        itemDetails: foodMenuItem,
        quantity: 1,
        finalUnitPrice: 0,
      }));
    }
  }, []);

  useEffect(() => {
    return () => {
      // cleanup
      setItemSelection({} as BasketItem);
      setSelectedBasketItemToEditKey(null);
    };
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[70%]" title={t("common.close")}>
          <DialogHeader className="sticky">
            <DialogTitle className="text-primary text-xl">
              {`${foodMenuItem.name}, ${basketData.foodStore.name}`}
            </DialogTitle>
          </DialogHeader>

          <div className="my-10 space-y-5 overflow-y-auto">
            <Image
              src={foodMenuItem.image}
              alt={foodMenuItem.name}
              width={120}
              height={120}
              className="rounded-lg object-cover"
            />

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
            {foodMenuItem.ingredients?.length && (
              <div className="">
                <DialogTitle className="text-primary text-lg font-semibold">
                  {t("pages.store.ingredients")}
                </DialogTitle>
                <DialogDescription className="text-sm italic select-none">
                  <span>{foodMenuItem.ingredients.join(", ")}</span>
                </DialogDescription>
              </div>
            )}

            {/* list of menu item options in Radio button (single selection) */}
            {foodMenuItem.options?.length && (
              <div className="">
                <DialogTitle className="text-primary text-lg font-semibold">
                  {t("pages.store.chooseOptions")}
                </DialogTitle>
                <ul className="list-none">
                  {foodMenuItem.options.map((option, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center space-y-1"
                    >
                      <div className="space-x-2">
                        <input
                          className="accent-primary"
                          type="radio"
                          name="options"
                          id={option.name}
                          value={option.name}
                          checked={
                            itemSelection.selectedOption?.slug === option.slug
                          }
                          onChange={() => onSelectedOptionChange(option)}
                        />
                        <span>{option.name}</span>
                      </div>
                      <span>{toLocaleCurrency(option.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* list of menu item extra ingredients in checkboxes (multi-selection) */}
            {itemSelection.selectedOption &&
              foodMenuItem.extraIngredients?.length && (
                <div className="">
                  <DialogTitle className="text-primary text-lg font-semibold">
                    {t("pages.store.chooseExtras")}
                  </DialogTitle>
                  <ul className="list-none">
                    {foodMenuItem.extraIngredients.map(
                      (extraIngredient, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center space-y-1"
                        >
                          <div className="space-x-2">
                            <input
                              className="accent-primary"
                              type="checkbox"
                              name="ingredients"
                              id={extraIngredient.name}
                              value={extraIngredient.name}
                              checked={itemSelection.selectedExtras?.some(
                                (i) => i.slug === extraIngredient.slug
                              )}
                              onChange={() =>
                                onExtraIngredientChange(extraIngredient)
                              }
                            />
                            <span>{extraIngredient.name}</span>
                          </div>
                          <span>
                            {toLocaleCurrency(extraIngredient.extraPrice)}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>

          {!!itemSelection.finalUnitPrice && (
            <DialogFooter className="sticky">
              <span className="flex items-center justify-between">
                <BasketItemQuantityButtons
                  quantity={itemSelection.quantity}
                  updateSelectionQte={updateSelectionQte}
                  maxQuantityCount={basketData.foodStore?.storeMaxOrder}
                />
                {!!itemSelection.finalUnitPrice && (
                  <button
                    className="flex justify-between items-center p-3 font-bold text-white rounded-2xl bg-primary hover:bg-secondary"
                    onClick={() => addToCartFunction(itemSelection)}
                  >
                    {isEditingKey
                      ? t("common.adjust")
                      : t("pages.store.addToBasket")}{" "}
                    {toLocaleCurrency(itemSelection.finalUnitPrice)}
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
