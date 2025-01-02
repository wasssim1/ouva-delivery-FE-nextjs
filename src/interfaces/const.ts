import { Dispatch, SetStateAction } from "react";

export interface AppContextType {
  selectedCuisine: string;
  setSelectedCuisine: Dispatch<SetStateAction<string>>;
}

/* export interface ICuisineImage {
  id: number;
  title: string;
  src: string;
  CompIcon: any;
} */

export interface ResponsiveSettings {
  breakpoint: number;
  settings: {
    slidesToShow: number;
    slidesToScroll: number;
  };
}

/* export interface DishOption {
  slug?: number;
  name: string;
  price: number;
  image?: string;
} */

/* export interface Dish {
  name: string;
  price: number;
  options?: DishOption[];
} */

/* export interface SelectedDish extends Dish {
  quantity: number;
} */

/* export interface ShippingCost {
  freeShipping: boolean;
  minOrder: number;
  shippingCost: number;
} */

export interface Address {
  street: string;
  postalCode: string;
  city: string;
}

/* export interface RestaurantDetails {
  id: string;
  category: string;
  name: string;
  address: Address;
  image: string;
  shippingCost: ShippingCost;
} */

/* export interface RestaurantOrder {
  restaurant: RestaurantDetails;
  orderItems: MenuItemOrder[];
} */

/* export interface Category {
  categoryTitle: string;
  dishes: Dish[];
} */

/* export interface Shipping {
  freeShipping: boolean;
  shippingCost: number;
  minOrder: number;
} */

/* export interface Restaurant {
  id: string;
  category: string;
  name: string;
  address: Address;
  image: string;
  rating: number;
  shipping: Shipping;
  menu?: MenuSection[];
} */

export interface UserFormProfile {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  country: string;
}
