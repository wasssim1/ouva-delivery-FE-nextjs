import { FoodStore } from "@/interfaces/foodStore.interface";
import { defaultCurrency } from "@/settings/const";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaClock,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaShoppingBasket,
  FaStar,
} from "react-icons/fa";

const RestaurantCard: React.FC<any> = ({
  foodStore,
}: {
  foodStore: FoodStore;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const language = useLocale();

  // function to navigate to the specific restaurant page
  const navigateToRestaurantPageFunction = () => {
    router.push(`/${language}/store/${foodStore.slug}`); //TODO: replace "id" with "slug"
  };

  return (
    <>
      <div className="card-restaurant-container rounded-lg shadow my-2">
        {/* Card Header Image */}
        <div className="relative inline-block overflow-hidden cursor-pointer">
          <Image
            src={foodStore.image}
            alt={`${foodStore.name}`}
            title={`${foodStore.name}`}
            className="aspect-video w-72 xs:w-80 xsm:w-60 rounded-t-lg hover:opacity-90 zoomImgEffect transform transition-all duration-500"
            onClick={() => navigateToRestaurantPageFunction()}
            width={100}
            height={100}
          />
          <span
            className="absolute inset-0 transition-all duration-300 pointer-events-none"
            aria-hidden="true"
          >
            {/* <div className="absolute inset-0 bg-white opacity-50 blur-sm" /> */}
            {/* store logo */}
            <div className="absolute top-0 left-0 w-10 h-10 rounded-lg bg-white shadow-md m-2">
              <Image
                src={foodStore.logo}
                alt={`${foodStore.name}`}
                title={`${foodStore.name}`}
                width={100}
                height={100}
              />
            </div>
          </span>
        </div>

        {/* Card Content */}
        <div className="p-2 mt-1 text-ellipsis cursor-text">
          {/* Card Title */}
          <div>
            <h2
              className="text-base tracking-tight cursor-pointer color-primary font-semibold"
              onClick={() => navigateToRestaurantPageFunction()}
            >
              {foodStore.name}
            </h2>
          </div>

          {/* Card Details */}
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex text-[13.5px] relative top-[-2px]">
              <div className="flex items-center space-x-1">
                <FaStar className="text-orange-400" />
                <p>{foodStore.rating}</p>
              </div>
              <div>
                {foodStore.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-200 px-1 py-[1px] rounded-md ml-1"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap space-x-2 text-gray-500">
              {!!foodStore.deliveryTime && (
                <div className="flex items-center space-x-1">
                  <FaClock className="" />
                  <p className="text-sm">
                    {foodStore.deliveryTime.min} - {foodStore.deliveryTime.max} {t("common.min")}
                  </p>
                </div>
              )}

              {!!foodStore.shippingCost && (
                <div className="flex items-center space-x-1">
                  <FaMotorcycle className="" />
                  <p className="text-sm">
                    {foodStore.shippingCost.cost}
                    <span className="pl-[1px]">
                      {t(`currencies.${defaultCurrency}`)}
                    </span>
                  </p>
                </div>
              )}

              {foodStore.shippingCost.isFreeShipping && (
                <div className="flex items-center bg-yellow-200 px-1 rounded-md">
                  <FaMotorcycle />
                  <span className="py-[1px] rounded-md ml-1">
                    {t("common.freeDelivery")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center text-gray-500">
              <FaShoppingBasket />
              <p className="italic pl-1">
                {foodStore.shippingCost.minOrder ? (
                  <>
                    {t("common.minOrder")} {foodStore.shippingCost.minOrder}
                    <span className="pl-[1px]">
                      {t(`currencies.${defaultCurrency}`)}
                    </span>
                  </>
                ) : (
                  t("common.noMinOrderRequired")
                )}
              </p>
            </div>

            <div className="flex justify-between mt-3">
              <div className="flex relative opacity-75 text-gray-500">
                <FaMapMarkerAlt className="mr-1" />
                <p className="tracking-wide text-ellipsis">
                  {foodStore.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantCard;
