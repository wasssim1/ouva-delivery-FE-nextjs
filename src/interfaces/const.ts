import { Dispatch, SetStateAction } from "react";

export interface AppContextType {
  selectedCuisine: string;
  setSelectedCuisine: Dispatch<SetStateAction<string>>;
}

export interface ResponsiveSettings {
  breakpoint: number;
  settings: {
    slidesToShow: number;
    slidesToScroll: number;
  };
}

export interface UserFormProfile {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  selectedAddress: {
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    };
    formatted: string;
    zone: string;
    addressComponents?: {
      [key: string]: string;
    };
  };
}
