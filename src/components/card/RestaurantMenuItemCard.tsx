import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { MenuItem } from "@/interfaces/foodStore.interface";
import { defaultCurrency } from "@/settings/const";

interface RestaurantMenuItemsCardsProps {
  menuItem: MenuItem;
  onClick: (dishTakenFromCategoryCard: MenuItem) => void;
}

export function RestaurantMenuItemCard({
  menuItem,
  onClick,
}: RestaurantMenuItemsCardsProps) {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex gap-4">
        <Image
          src={menuItem.image}
          alt={menuItem.name}
          width={120}
          height={120}
          className="rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg">{menuItem.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{menuItem.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-secondary font-bold">
              {menuItem.basePrice?.toLocaleString("fr-TN", {
                style: "currency",
                currency: defaultCurrency,
              })}
            </p>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => onClick(menuItem)}
            >
              <Plus className="w-6 h-6 text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
