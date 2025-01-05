import {
  ExtraIngredient,
  FoodStore,
  MenuItem,
  MenuItemOption,
} from "./food-store.interface";

export interface BasketItem {
  basketItemKey: string;
  itemDetails: MenuItem;
  baseUnitPrice: number;
  finalUnitPrice: number;
  selectedOption: MenuItemOption;
  selectedExtras: ExtraIngredient[];
  quantity: number;
  note?: string;
}

export interface BasketState {
  foodStore: FoodStore;
  orderItems: BasketItem[];
  //   totalPrice: number;
}
