import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

import { getProductQuantity } from "@/functions/common";
import {
  ExtraIngredient,
  MenuItem,
  MenuItemOption,
  MenuItemOrder,
} from "@/interfaces/foodStore.interface";
import { removeFromCart } from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";
import { defaultCurrency } from "@/settings/const";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FoodMenuItemDialogProps {
  foodMenuItem: MenuItem;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function FoodMenuItemDialog({
  foodMenuItem,
  isOpen,
  setIsOpen,
}: FoodMenuItemDialogProps) {
  const t = useTranslations();

  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const [itemSelection, setItemSelection] = useState<MenuItemOrder>(
    {} as MenuItemOrder
  );

  const onSelectedOptionChange = (option: MenuItemOption) => {
    const newSelection = { ...itemSelection };

    newSelection.selectedOption = option;
    newSelection.finalPrice = option.price;
    setItemSelection(newSelection);
  };

  const onExtraIngredientChange = (ingredient: ExtraIngredient) => {
    const newSelection = { ...itemSelection };

    if (
      newSelection.extraIngredients?.some((i) => i.slug === ingredient.slug)
    ) {
      newSelection.extraIngredients = newSelection.extraIngredients.filter(
        (i) => i.slug !== ingredient.slug
      );
      newSelection.finalPrice -= ingredient.extraPrice;
    } else {
      if (!newSelection.extraIngredients) newSelection.extraIngredients = [];
      newSelection.extraIngredients.push(ingredient);
      newSelection.finalPrice += ingredient.extraPrice;
    }

    setItemSelection(newSelection);
  };

  const updateSelectionQte = (quantity: number) => {
    setItemSelection((prev) => ({ ...prev, quantity }));
  };

  // functions to add an article from the cart
  const addToCartFunction = (orderItem: MenuItemOrder) => {
    console.log({ itemSelection });

    // dispatch(addToCart(article));
  };

  // function to remove the article from the cart
  const removeFromCartFunction = (orderItem: MenuItemOrder) => {
    dispatch(removeFromCart(orderItem));
  };

  // function that returns the quantity of a specific product as a number
  const quantityInCart = getProductQuantity(cart);

  useEffect(() => {
    setItemSelection((prev) => ({
      ...prev,
      itemSlug: foodMenuItem.slug,
      quantity: 1,
      finalPrice: 0,
    }));

    return () => {
      // cleanup
      setItemSelection({} as MenuItemOrder);
    };
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogHeader>
          <DialogTitle>{t("common.cart")}</DialogTitle>
        </DialogHeader>

        <DialogContent title={t("common.close")}>
          <Image
            src={foodMenuItem.image}
            alt={foodMenuItem.name}
            width={120}
            height={120}
            className="rounded-lg object-cover"
          />

          <div className="flex justify-between items-center text-primary w-full mt-5">
            <DialogTitle className="text-lg font-semibold">
              {foodMenuItem.name}
            </DialogTitle>
            <DialogDescription className="text-primary text-lg text-black italic pr-2.5 select-none">
              <span>
                {foodMenuItem.basePrice?.toLocaleString("fr-TN", {
                  // 🇹🇳 TODO: Move to settings and utils
                  style: "currency",
                  currency: defaultCurrency,
                })}
              </span>
            </DialogDescription>
          </div>

          {/* show ingredients */}
          <div className="text-primary w-full">
            <DialogTitle className="text-lg font-semibold">
              {t("pages.store.ingredients")}
            </DialogTitle>
            <DialogDescription className="text-primary text-sm text-black italic pr-2.5 select-none">
              <span>{foodMenuItem.ingredients.join(", ")}</span>
            </DialogDescription>
          </div>

          {/* <div className="mt-5">
            <DialogTitle className="text-lg font-semibold">
              {t("pages.store.options")}
            </DialogTitle>
            <ul className="list-none">
              {foodMenuItem.options?.map((option, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{option.name}</span>
                  <span>{option.price}</span>
                </li>
              ))}
            </ul>
          </div> */}

          {/* list of menu item options in Radio button (single selection) */}
          <div className="">
            <DialogTitle className="text-lg font-semibold">
              {t("pages.store.options")}
            </DialogTitle>
            <ul className="list-none">
              {foodMenuItem.options?.map((option, index) => (
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
                      onChange={() => onSelectedOptionChange(option)}
                    />
                    <span>{option.name}</span>
                  </div>
                  <span>
                    {option.price.toLocaleString("fr-TN", {
                      style: "currency",
                      currency: defaultCurrency,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* list of menu item extra ingredients in checkboxes (multi-selection) */}
          {itemSelection.selectedOption && (
            <div className="">
              <DialogTitle className="text-lg font-semibold">
                {t("pages.store.extraIngredients")}
              </DialogTitle>
              <ul className="list-none">
                {foodMenuItem.extraIngredients?.map(
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
                          onChange={() =>
                            onExtraIngredientChange(extraIngredient)
                          }
                        />
                        <span>{extraIngredient.name}</span>
                      </div>
                      <span>
                        {extraIngredient.extraPrice.toLocaleString("fr-TN", {
                          style: "currency",
                          currency: defaultCurrency,
                        })}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          <DialogFooter>
            <span className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                <button
                  className="disabled:opacity-50"
                  disabled={itemSelection.quantity === 1}
                  onClick={() => updateSelectionQte(--itemSelection.quantity)}
                >
                  <IoRemoveCircleOutline className="text-primary" size={24} />
                </button>
                <span className="w-8 text-center text-lg select-none">
                  {itemSelection.quantity}
                  {/* {quantityInCart(
                  foodMenuItem.products[0].name,
                  foodMenuItem.restaurant.id
                )} */}
                </span>
                <button
                  onClick={() => updateSelectionQte(++itemSelection.quantity)}
                >
                  <IoAddCircleOutline className="text-primary" size={24} />
                </button>
              </div>
              {!!itemSelection.finalPrice && (
                <button
                  className="flex justify-between items-center p-3 font-bold text-white rounded-2xl bg-primary hover:bg-secondary"
                  onClick={() => addToCartFunction(itemSelection)}
                >
                  {t("pages.store.addToCart")}{" "}
                  {itemSelection.finalPrice?.toLocaleString("fr-TN", {
                    style: "currency",
                    currency: defaultCurrency,
                  })}
                </button>
              )}
            </span>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
