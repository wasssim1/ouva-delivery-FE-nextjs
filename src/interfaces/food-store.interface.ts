export interface FoodStore {
  slug: string;
  name: string;
  description?: string;
  address: {
    addressTxt: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  distance?: number;
  zone: string;
  logoUrl: string;
  imageUrl: string;
  shippingCost: StoreShippingCost;
  deliveryTime: StoreDeliveryTime;
  storeMaxOrderCount?: number;
  categories: string[];
  menuItems: MenuItem[];
  tags?: string[];
  rating?: number;
  reviews?: FoodStoreReview[];
}

export interface StoreCategory {
  slug: string;
  name: string;
  image: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;

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
  imageUrl?: string;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  slug: string;
  name: string;
  description?: string;
  maxOrderCount?: number;
  basePrice: number;
  imageUrl: string;
  ingredients: string[];
  menuSection: MenuSection;
  options?: MenuItemOptionsGroup[];
  extras?: MenuItemExtra[];
}

export interface MenuItemOptionsGroup {
  optionKey: string;
  optionValues: MenuItemOption[];
}

export interface MenuItemOption {
  slug: string;
  name: string;
  price: number;
  image?: string;
}

export interface MenuItemExtra {
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
