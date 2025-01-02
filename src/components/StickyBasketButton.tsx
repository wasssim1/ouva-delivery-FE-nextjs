import { useTranslations } from "next-intl";
import { FaShoppingBasket } from "react-icons/fa";
import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { defaultCurrency } from "@/settings/const";

interface StickyBasketButtonProps {
  setIsCartDialogOpen: (value: boolean) => void;
}

export function StickyBasketButton({
  setIsCartDialogOpen,
}: StickyBasketButtonProps) {
  const t = useTranslations();

  const cart = useSelector((state: RootState) => state.cart);

  return (
    <div className="sticky bottom-0 flex justify-center w-full m-2 p-2 shadow-inner bg-white">
      <button
        className="flex justify-between items-center w-[95%] md:w-[70%] lg:w-[40%] p-3 font-bold text-white rounded-2xl bg-primary hover:bg-secondary focus:outline-none focus:shadow-outline fading-in-animation"
        onClick={() => setIsCartDialogOpen(true)}
      >
        <div>
          <FaShoppingBasket size={24} />
          {!!cart.orderItems?.length && (
            <small className="">{cart.orderItems.length}</small>
          )}
        </div>
        <p>{t("pages.store.viewBasket")}</p>
        <p>
          {cart.total?.toLocaleString("fr-TN", {
            style: "currency",
            currency: defaultCurrency,
          })}
        </p>
      </button>
    </div>
  );
}
