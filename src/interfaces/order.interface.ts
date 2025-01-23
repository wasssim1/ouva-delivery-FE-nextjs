export interface OrderAddressDto {
  // latitude: number;

  // longitude: number;
  formatted: string;

  coordinates: {
    latitude: number;
    longitude: number;
  };

  zoneSlug: string;

  addressComponents?: {
    [key: string]: string;
  };
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
