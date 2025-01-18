import { BasketItem } from "@/interfaces/basket.interface";
import { Trash2Icon } from "lucide-react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface BasketItemQuantityButtonsProps {
  basketItem: BasketItem;
  onUpdateBasketItemQte: (
    basketItem: BasketItem,
    operationType: "inc" | "dec"
  ) => void;
  onRemoveBasketItem: (basketItem: BasketItem) => void;
  isRequestPending: boolean;
  maxQuantityCount?: number;
}

export function BasketQuantityButtons({
  basketItem,
  onUpdateBasketItemQte,
  onRemoveBasketItem,
  isRequestPending,
  maxQuantityCount,
}: BasketItemQuantityButtonsProps) {
  return (
    <div className="flex items-center justify-between">
      {basketItem.quantity === 1 ? (
        <button
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isRequestPending}
          onClick={() => onRemoveBasketItem(basketItem)}
        >
          <Trash2Icon className="text-primary hover:text-secondary" size={16} />
        </button>
      ) : (
        <button
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isRequestPending || basketItem.quantity === 1}
          onClick={() => onUpdateBasketItemQte(basketItem, "dec")}
        >
          <IoRemoveCircleOutline
            className="text-primary hover:text-secondary"
            size={20}
          />
        </button>
      )}
      <span className="w-8 text-center text-lg select-none">
        {basketItem.quantity}
      </span>
      <button
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          isRequestPending ||
          (!!maxQuantityCount && basketItem.quantity === maxQuantityCount)
        }
        onClick={() => onUpdateBasketItemQte(basketItem, "inc")}
      >
        <IoAddCircleOutline
          className="text-primary hover:text-secondary"
          size={20}
        />
      </button>
    </div>
  );
}
