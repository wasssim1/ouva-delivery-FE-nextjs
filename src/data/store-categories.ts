import { StoreCategory } from "@/interfaces/foodStore.interface";
import {
  FaBirthdayCake,
  FaCocktail,
  FaDrumstickBite,
  FaFish,
  FaHamburger,
  FaLeaf,
  FaPizzaSlice,
  FaUtensils,
} from "react-icons/fa";
import { IoFastFood } from "react-icons/io5";

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    slug: "salade",
    name: "salade",
    image: "assets/img/cucine/cinese.jpg",
    CompIcon: FaLeaf,
  },
  {
    slug: "chicken",
    name: "chicken",
    image: "assets/img/cucine/fritti.jpg",
    CompIcon: FaDrumstickBite,
  },
  {
    slug: "pizza",
    name: "pizza",
    image: "assets/img/cucine/pizza.jpg",
    CompIcon: FaPizzaSlice,
  },
  {
    slug: "sandwich",
    name: "sandwich",
    image: "assets/img/cucine/giapponese.jpg",
    CompIcon: IoFastFood,
  },
  {
    slug: "hamburger",
    name: "hamburger",
    image: "assets/img/cucine/hamburger.jpg",
    CompIcon: FaHamburger,
  },
  {
    slug: "fish",
    name: "fish",
    image: "assets/img/cucine/sushi.jpg",
    CompIcon: FaFish,
  },
  {
    slug: "sides",
    name: "sides",
    image: "assets/img/cucine/italiano.jpg",
    CompIcon: FaUtensils,
  },
  {
    slug: "dessert",
    name: "dessert",
    image: "assets/img/cucine/dessert.jpg",
    CompIcon: FaBirthdayCake,
  },
  {
    slug: "drinks",
    name: "drinks",
    image: "assets/img/cucine/bevande.jpg",
    CompIcon: FaCocktail,
  },
];
