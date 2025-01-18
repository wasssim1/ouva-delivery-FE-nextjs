export interface OrderAddressDto {
  // latitude: number;

  // longitude: number;

  zoneSlug: string;

  street: string;

  houseNumber: string;

  postalCode: string;

  city: string;

  region: string;

  country: string;
}

export interface PlaceOrderRequestDto {
  storeSlug: string;

  // customerId?: string;

  name: string;

  email: string;

  phone: string;

  basketStorageKey: string;

  deliveryAddress: OrderAddressDto;
}
