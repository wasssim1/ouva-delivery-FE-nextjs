import { BasketItem } from "@/interfaces/basket.interface";
import { useTranslations } from "next-intl";
import { Dispatch as ReactDispatch, SetStateAction } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";

interface CartItemProps {
  basketItem: BasketItem;
  onOpenBasketItemEdit: (productFound: BasketItem) => void;
  isModalOpen: boolean;
  setIsModalOpen: ReactDispatch<SetStateAction<boolean>>;
  selectedItemToEdit: BasketItem | undefined;
}

const BasketItemCard: React.FC<CartItemProps> = ({
  basketItem,
  onOpenBasketItemEdit,
  isModalOpen,
  setIsModalOpen,
  selectedItemToEdit,
}) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  // const cart = useSelector((state: RootState) => state.cart);

  // if (!basketData?.orderItems.length) return null;

  // functions to add an article from the cart
  const addToCartFunction = () => {
    // const orderToAdd: RestaurantOrder = {
    //   restaurant: selectedStore,
    //   products: [
    //     {
    //       name: selectedProduct.name,
    //       price: selectedProduct.price,
    //       quantity: selectedProduct.quantity,
    //     },
    //   ],
    // };
    // dispatch(addToCart(orderToAdd));
  };

  // functions to remove an article from the cart
  const removeFromCartFunction = () => {
    // const orderToAdd: RestaurantOrder = {
    //   restaurant: selectedStore,
    //   products: [
    //     {
    //       name: selectedProduct.name,
    //       price: selectedProduct.price,
    //       quantity: selectedProduct.quantity,
    //     },
    //   ],
    // };
    // dispatch(removeFromCart(orderToAdd));
  };

  // function that returns the quantity of a specific product as a number
  // const quantityInCart = getProductQuantity(cart);

  return (
    <>
      <li
        className="flex items-center justify-between col-span-12 text-sm leading-4 cursor-pointer text-pretty"
        key={`CART_item_KEY_${basketItem.basketItemKey}`}
        onClick={() => onOpenBasketItemEdit(basketItem)}
      >
        <span className="w-8/12 col-span-7">
          <b>x{basketItem.quantity}</b>
          {/* <span className="pl-2">{basketItem.itemDetails.name}</span> */}
        </span>
        <span className="flex justify-end w-1/12 col-span-2 italic">
          {/* {toLocaleCurrency(basketItem.finalUnitPrice)} */}
        </span>
      </li>

      {/* Product modal */}
      {isModalOpen && selectedItemToEdit ? (
        <>
          <Dialog
            open={isModalOpen}
            onOpenChange={() => {
              setIsModalOpen(!isModalOpen);
              // setSelectedProduct(initialProduct);
            }}
          >
            <DialogContent title={t("common.close")}>
              <div className="flex items-center justify-between w-full mt-5">
                <DialogTitle className="text-lg font-semibold">
                  {/* {selectedItemToEdit.itemDetails.name} */}
                </DialogTitle>
                <DialogDescription className="text-lg text-black italic pr-2.5 select-none">
                  {/* <span>{toLocaleCurrency(selectedItemToEdit.finalUnitPrice)}</span> */}
                </DialogDescription>
              </div>
              <DialogFooter>
                <span className="flex items-center justify-end">
                  <button onClick={() => removeFromCartFunction()}>
                    <IoRemoveCircleOutline size={24} />
                  </button>
                  <span className="w-8 text-lg text-center select-none">
                    {/* {quantityInCart(
                        selectedItemToEdit.name,
                        selectedStore.id
                      )} */}
                  </span>
                  <button onClick={() => addToCartFunction()}>
                    <IoAddCircleOutline size={24} />
                  </button>
                </span>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
    </>
  );
};

export default BasketItemCard;
