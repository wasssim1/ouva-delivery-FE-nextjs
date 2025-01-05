import { useLocale, useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BasketItem, BasketState } from "@/interfaces/basket.interface";
import { calculateTotalBasketItemsPrice, toLocaleCurrency } from "@/lib/utils";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartDialogProps {
  basketData: BasketState;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  removeItemFromBasket: (item: BasketItem) => void;
  editItem: (item: BasketItem) => void;
}

export function BasketDialog({
  basketData,
  isOpen,
  setIsOpen,
  removeItemFromBasket,
  editItem,
}: CartDialogProps) {
  const t = useTranslations();
  const language = useLocale();
  const router = useRouter();

  if (!basketData?.orderItems || !basketData?.foodStore) return null;

  const backToMenuSelection = () => {
    setIsOpen(false);
  };

  const toCheckout = () => {
    setIsOpen(false);
    const basketHash = btoa(`${basketData.foodStore.slug}-basket-state`);
    router.push(`/${language}/checkout?basket=${basketHash}`);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[70%]" title={t("common.close")}>
          <DialogHeader className="sticky">
            <DialogTitle className="text-lg text-primary font-semibold">
              {`${basketData.foodStore.name}: ${t("pages.store.yourBasket")}`}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-2 overflow-y-auto">
            {basketData.orderItems?.map((item, index) => (
              <div key={`KEY_${item.basketItemKey}-${index}`} className=" border-b border-gray-200 py-5">
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-lg text-primary">
                      {item.itemDetails.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm">{item.quantity} x </span>
                    <span className="text-sm">
                      {toLocaleCurrency(item.finalUnitPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm">
                      {toLocaleCurrency(item.finalUnitPrice * item.quantity)}
                    </span>
                  </div>
                </div>

                {item.selectedOption && (
                  <div className="ml-1">
                    <span className="text-md">
                      {item.selectedOption.name}{" "}
                      {toLocaleCurrency(item.selectedOption.price)}
                    </span>
                  </div>
                )}

                {item.selectedExtras?.length && (
                  <div className="flex text-sm space-x-1 ml-3">
                    <span>{`Extra (x ${item.quantity}): `}</span>
                    {item.selectedExtras.map((extra, index) => (
                      <span key={index} className="italic">
                        {extra.name} ({toLocaleCurrency(extra.extraPrice)})
                      </span>
                    ))}
                  </div>
                )}

                {/* Edit and Delete buttons */}
                <div className="flex justify-end space-x-2 mt-3 text-primary">
                  <button
                    className="hover:text-secondary"
                    title={t("common.edit")}
                    onClick={() => editItem(item)}
                  >
                    <EditIcon size={16} />
                  </button>
                  <button
                    className="hover:text-secondary"
                    title={t("common.remove")}
                    onClick={() => removeItemFromBasket(item)}
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!!basketData.orderItems?.length && (
            <DialogFooter className="sticky">
              <span className="flex items-center justify-center space-x-3">
                {calculateTotalBasketItemsPrice(basketData) <
                basketData.foodStore.shippingCost?.minOrder ? (
                  <div>
                    <button
                      className="text-primary bg-white ring-1 ring-primary py-2 px-4 rounded-md hover:bg-primary hover:text-white"
                      onClick={backToMenuSelection}
                    >
                      {t("common.addMoreItems")}{" "}
                    </button>
                    <p className="relative text-xs italic text-right text-secondary top-2 lg:top-1 right-3">
                      {t("common.minOrderRequired")} (
                      {toLocaleCurrency(
                        basketData.foodStore.shippingCost.minOrder
                      )}
                      )
                    </p>
                  </div>
                ) : (
                  <button
                    className="bg-primary text-white py-2 px-4 rounded-md hover:text-primary hover:bg-white hover:ring-1 hover:ring-primary"
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
