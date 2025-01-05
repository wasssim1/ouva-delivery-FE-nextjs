export interface FoodStore {
  slug: string;
  name: string;
  description?: string;
  address: string;
  zone: string;
  logo: string;
  image: string;
  shippingCost: StoreShippingCost;
  deliveryTime: StoreDeliveryTime;
  storeMaxOrder?: number;
  categories: string[];
  menuSections: MenuSection[];
  tags?: StoreTag[];
  rating?: number;
  reviews?: FoodStoreReview[];
}

export interface StoreCategory {
  slug: string;
  // name: string;
  image: string;
  CompIcon?: any;
}

export interface StoreShippingCost {
  isFreeShipping: boolean;
  minOrder: number;
  cost: number;
}

export interface StoreDeliveryTime {
  min: number;
  max: number;
}

export interface StoreTag {
  slug: string;
  name: string;
}

export interface MenuSection {
  sectionSlug: string;
  sectionTitle: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  slug: string;
  name: string;
  description?: string;
  basePrice: number;
  image: string;
  options?: MenuItemOption[];
  ingredients: string[];
  extraIngredients?: ExtraIngredient[];
}

export interface MenuItemOption {
  slug: string;
  name: string;
  price: number;
  image?: string;
}

export interface ExtraIngredient {
  slug: string;
  name: string;
  extraPrice: number;
}

export interface FoodStoreReview {
  id: string;
  user: string;
  rating: number;
  review: string;
  date: string;
}
