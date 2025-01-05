import { StoreCategory } from "@/interfaces/food-store.interface";

/* 
  Supported Languages Configuration
  - Update the `supportedLanguages` array below if you add or remove languages.
  - IMPORTANT: after updating `supportedLanguages`, make sure to also update the `matcher` pattern in the `config` object in `src/middleware.ts`. Failure to update the `matcher` pattern will result in routing issues.
*/
export const supportedLanguages = ["fr", "en"];
// export const supportedLanguages = ['en', 'it', 'es', 'de', 'fr'];
export const defaultLanguage = "fr";
export const defaultFoodCategory = "pizza";

export const defaultCurrency = "tnd"; // 🇹🇳
export const defaultCurrencyLocale = "fr-TN"; // 🇹🇳

/*
  These string values correspond to translations in the language JSON files (path -> ouva\languages). If these values are modified, the corresponding entries in the translations should also be updated to maintain consistency
*/
export const footerLinksList: Array<string[]> = [
  [
    "aboutUs",
    "contactUs",
    "workWithUs",
    "downloadOuvaApp",
    "termsAndConditions",
  ],
  [
    "restaurants",
    "becomeOuvaCourier",
    "becomeOuvaMerchant",
    "customOuvaOrders",
  ],
  ["customerService", "faq", "orderNotReceived", "registerOuva"],
];

/*
  These are the filenames located in the specified path. If any changes are made to the file names in that path, the corresponding values in this list must also be updated to reflect those changes
*/
const cuisineImages: StoreCategory[] = [];
