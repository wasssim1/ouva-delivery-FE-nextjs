import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface BasketItemQuantityButtonsProps {
  quantity: number;
  updateSelectionQte: (quantity: number) => void;
  maxQuantityCount?: number;
}

export function BasketItemQuantityButtons({
  quantity,
  updateSelectionQte,
  maxQuantityCount,
}: BasketItemQuantityButtonsProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        className="disabled:opacity-50"
        disabled={quantity === 1}
        onClick={() => updateSelectionQte(--quantity)}
      >
        <IoRemoveCircleOutline
          className="text-primary hover:text-secondary"
          size={24}
        />
      </button>
      <span className="w-8 text-center text-lg select-none">
        {quantity}
        {/* {quantityInCart(
                  foodMenuItem.products[0].name,
                  foodMenuItem.restaurant.id
                )} */}
      </span>
      <button
        className="disabled:opacity-50"
        disabled={!!maxQuantityCount && quantity === maxQuantityCount}
        onClick={() => updateSelectionQte(++quantity)}
      >
        <IoAddCircleOutline
          className="text-primary hover:text-secondary"
          size={24}
        />
      </button>
    </div>
  );
}
