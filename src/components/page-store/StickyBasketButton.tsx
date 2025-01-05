import { useTranslations } from "next-intl";
import { FaShoppingBasket } from "react-icons/fa";

import { BasketState } from "@/interfaces/basket.interface";
import { calculateTotalBasketItemsPrice, toLocaleCurrency } from "@/lib/utils";

interface StickyBasketButtonProps {
  basketData: BasketState;
  setIsCartDialogOpen: (value: boolean) => void;
}

export function StickyBasketButton({
  basketData,
  setIsCartDialogOpen,
}: StickyBasketButtonProps) {
  const t = useTranslations();

  // const cart = useSelector((state: RootState) => state.cart);

  if (!basketData.orderItems?.length) {
    return null;
  }

  const calculateItemsCount = () => {
    return basketData.orderItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <div className="sticky bottom-0 flex justify-center w-full m-2 p-2 shadow-inner bg-white">
      <button
        className="flex justify-between items-center w-[95%] md:w-[70%] lg:w-[40%] p-3 font-bold text-white rounded-2xl bg-primary hover:bg-secondary focus:outline-none focus:shadow-outline fading-in-animation"
        onClick={() => setIsCartDialogOpen(true)}
      >
        <div className="flex">
          <FaShoppingBasket size={24} />
          <span className="absolute top-1 left-7 px-2 text-xs ring-1 ring-primary bg-secondary rounded-full">
            {basketData.orderItems?.length && (
              <small className="">{calculateItemsCount()}</small>
            )}
          </span>
        </div>
        <p>{t("pages.store.viewBasket")}</p>
        <p>{toLocaleCurrency(calculateTotalBasketItemsPrice(basketData))}</p>
      </button>
    </div>
  );
}
