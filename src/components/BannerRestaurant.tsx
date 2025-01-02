import { useTranslations } from "next-intl";
import { FaMapMarkerAlt } from "react-icons/fa";

import { FoodStore } from "@/interfaces/foodStore.interface";
import { defaultCurrency } from "@/settings/const";

interface BannerRestaurantProps {
  selectedStore: FoodStore;
}

const BannerRestaurant = ({ selectedStore }: BannerRestaurantProps) => {
  const t = useTranslations();

  const { street, postalCode, city } = selectedStore.address;
  const { freeShipping, shippingCost, minOrder } = selectedStore.shipping;
  console.log(selectedStore);

  return (
    <div
      className={`flex justify-center py-20 mx-auto bg-primary bg-[url('/assets/img/ristoranti/${selectedStore.category}/${selectedStore.image}')]`}
    >
      {selectedStore ? (
        <div className="w-full max-w-screen-lg text-white text-center">
          <div className="mb-1">
            <h2
              className={`${
                selectedStore.name.length > 18
                  ? "text-3xl md:text-4xl "
                  : "text-4xl md:text-5xl"
              } font-semibold`}
            >
              {selectedStore.name}
            </h2>
          </div>
          <div className="divider w-72 mx-auto my-2"></div>
          <div className="mx-auto text-center leading-6">
            <div className="flex justify-center items-center space-x-1">
              <FaMapMarkerAlt className="inline" />
              <p>
                {street} - {postalCode}, {city}
              </p>
            </div>
            <p className="text-sm italic">
              {freeShipping
                ? t("common.freeDelivery")
                : `${shippingCost} ${t("currencies." + defaultCurrency)} ${t(
                    "common.delivery"
                  )}`}
              ,
              <span className="pl-1">
                {minOrder > 0
                  ? `${minOrder} ${t("currencies." + defaultCurrency)} ${t(
                      "common.minOrder"
                    )}`
                  : null}
              </span>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BannerRestaurant;
