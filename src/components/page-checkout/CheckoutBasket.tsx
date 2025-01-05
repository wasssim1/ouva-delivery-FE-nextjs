"use client";

import { useLocale, useTranslations } from "next-intl";
import { lazy, Suspense } from "react";

import { BasketItem, BasketState } from "@/interfaces/basket.interface";
import {
  calculateBasketTotalPriceWithDelivery,
  toLocaleCurrency,
} from "@/lib/utils";
import Link from "next/link";

const CartItem = lazy(
  () => import("@/components/page-checkout/BasketItemCard")
);

interface CheckoutBasketProps {
  basketData: BasketState;
}

const CheckoutBasket = ({ basketData }: CheckoutBasketProps) => {
  const t = useTranslations();
  const language = useLocale();

  // const [selectedProduct, setSelectedProduct] = useState<BasketItem>(
  //   {} as BasketItem
  // );
  // const [selectedStore, setSelectedStore] = useState<FoodStore>(
  //   {} as FoodStore
  // );

  // const cart = useSelector((state: RootState) => state.cart);

  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const onItemClick = (clickedItem: BasketItem) => {
    // setSelectedStore(selectedStore);
    // setSelectedProduct(clickedItem);
    // onOpenBasketItemEdit(clickedItem);
  };

  // const [selectedBasketItem, setSelectedBasketItem] = useState<BasketItem>();
  // const [cartTotal, setCartTotal] = useState<string>("0");

  // open the article modal with the selected article's details.
  // const onOpenBasketItemEdit = (basketItemToEdit: BasketItem) => {
  //   setSelectedBasketItem(basketItemToEdit);
  //   setIsModalOpen(true);
  // };

  if (!basketData?.orderItems?.length || !basketData?.foodStore) return null;
  const { foodStore: selectedStore, orderItems } = basketData;

  return (
    <>
      <div className="bg-white rounded-md shadow lg:shadow-md xl:col-span-2">
        <div className="relative h-full">
          <div className="p-5 py-4 md:max-w-96 md:px-9">
            <h2 className="pt-1 text-2xl sm:mb-2 lg:pl-2 xl:pl-0">
              {t("common.checkout")}
            </h2>
          </div>
          <div className="p-5 md:p-6 lg:overflow-auto lg:hover:overflow-auto lg:h-[calc(60vh)] pb-24">
            <Suspense fallback={null}>
              {/* FoodStore details */}
              <div className="divider">
                <h2 className="font-semibold cursor-pointer text-primary hover:text-secondary md:pl-8 lg:pl-3">
                  <Link href={`${language}/}store/${selectedStore.slug}`}>
                    &quot;{selectedStore.name}&quot;
                  </Link>
                </h2>
              </div>
              <div className="w-full mx-auto my-2 py-1 text-xs md:max-w-96">
                <p className="italic">
                  {selectedStore.shippingCost?.minOrder
                    ? `${t("common.minOrder")}: ${toLocaleCurrency(
                        selectedStore.shippingCost.minOrder
                      )}`
                    : t("common.noMinOrderRequired")}
                </p>
                <span className="flex space-x-1">
                  <p>{t("components.cartItem.paragraph")}</p>
                  <p className="italic">{selectedStore.address}</p>
                </span>
              </div>

              {/* selectedStore items in cart */}
              <ul className="grid w-full grid-cols-12 mx-auto mt-5 gap-y-2 md:max-w-96">
                {orderItems?.map((item, index) => (
                  <li
                    className="flex items-center justify-between col-span-12 text-sm leading-4 cursor-pointer text-pretty"
                    key={`CART_item_KEY_${item.basketItemKey}_${index}`}
                    onClick={() => onItemClick(item)}
                  >
                    <span className="w-8/12 col-span-7">
                      <span className="text-primary">
                        {item.itemDetails.name}
                      </span>
                      <b className="pl-2">x{item.quantity}</b>
                    </span>
                    <span className="flex justify-end w-1/12 col-span-2 italic">
                      {toLocaleCurrency(item.finalUnitPrice)}
                    </span>
                  </li>
                ))}

                {/* Basket Order total */}
                {selectedStore?.shippingCost?.cost > 0 && (
                  <li className="flex justify-between col-span-12 pt-3 text-sm text-right">
                    {t("common.deliveryFee")}:
                    <span className="italic">
                      {toLocaleCurrency(selectedStore.shippingCost.cost)}
                    </span>
                  </li>
                )}
              </ul>
            </Suspense>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4 mx-auto bg-white border-t-4 rounded-b-md">
            <h4 className="flex justify-between mx-auto text-base md:max-w-96">
              {t("common.totalOrder")}:{" "}
              <span className="font-bold">
                {toLocaleCurrency(
                  calculateBasketTotalPriceWithDelivery(basketData)
                )}
              </span>
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutBasket;