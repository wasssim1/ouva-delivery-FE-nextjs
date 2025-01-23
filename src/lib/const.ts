import { UserFormProfile } from "@/interfaces/const";

export const initialProduct = { name: "", price: 0, quantity: 0 };

export const initialRestaurant = {
  id: "",
  category: "",
  name: "",
  address: {
    street: "",
    postalCode: "",
    city: "",
  },
  image: "",
  shippingCost: {
    freeShipping: true,
    shippingCost: 0,
    minOrder: 0,
  },
};

export const initialUserProfile: UserFormProfile = {
  name: "",
  lastname: "",
  email: "",
  phone: "",
  selectedAddress: {
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    formatted: "",
    zone: "",
    addressComponents: {},
  },
};
