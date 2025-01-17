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
  addressZone: "",
  street: "",
  houseNumber: "",
  zip: "",
  city: "Tunis",
  region: "Tunis",
  country: "Tunisie",
};
