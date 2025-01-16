export interface BasketItemOptionGroup {
  optionKey: string;
  optionValueSlug: string;
}

export interface BasketItem {
  basketItemKey?: string; // for edit mode only
  // menuItemInfo: MenuItem; // TODO: check if needed to calculate basket item price in FE
  menuItemSlug: string;
  unitPrice: number;
  selectedOptions: BasketItemOptionGroup[];
  selectedExtrasSlugs?: string[];
  quantity: number;
  note?: string;
}

export interface BasketState {
  basketStorageKey?: string;
  foodStoreSlug: string;
  basketItems: BasketItem[];
  totalPrice: number;
}

export interface UpsertBasketItemRequestDto {
  basketStorageKey?: string; // only for update
  quantity: number;
  unitPrice: number;
  selectedOptions: { optionKey: string; optionValueSlug: string }[];
  selectedExtrasSlugs?: string[];
  menuItemSlug: string;
  note?: string;

  // relations
  foodStoreSlug: string;
  userId?: string;
}

export interface UpsertBasketItemResponseDto {
  basketStorageKey: string;
  basketItemsCount: number;
  basketItems: {
    basketItemKey: string;
    quantity: number;
    unitPrice: number;
    selectedOptions: {
      optionKey: string;
      optionValueSlug: string; // slug or whole object?
    }[];
    selectedExtrasSlugs?: string[];
    menuItemSlug: string;
    note?: string;
  }[];
  totalAmount: number;
  foodStoreSlug: string;
  userId?: string;
}
