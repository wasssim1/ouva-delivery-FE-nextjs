"use client";

import { RootState } from "@/redux/store";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-amazing-hooks";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";

// components
import Hamburger from "@/components/navbar/Hamburger";
import NavbarItem from "@/components/navbar/NavItem";
import SelectLanguage from "@/components/SelectLanguage";

// const FILL_COLOR = "#06484F";
const FILL_COLOR = "#E5212F";

const Navbar = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const language = useLocale();
  const isLessThan640 = useMediaQuery({ max: 640 });
  const logoSize = isLessThan640 ? 102 : 150;
  const [isMounted, setIsMounted] = useState(false);

  const navigateFunction = (value: string) => {
    router.push(`/${language}/${value}`);
  };

  // function to calculate the total number of items in all carts
  const calculateTotalItems = () => {
    let totalItems = 0;

    // iterate over each cart
    cart.forEach((cartItem) => {
      // iterate over each product in the current cart and add the quantity to the total
      cartItem.products.forEach((product: any) => {
        totalItems += product.quantity;
      });
    });

    return totalItems;
  };

  // calculate the total number of items in all carts
  const totalItems = isMounted ? calculateTotalItems() : 0;

  // mobile menu
  const openMobileMenu = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <nav className="bg-white dark:bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded select-none">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigateFunction("/")}
          >
            <Image
              src="/assets/img/logo-large-ouva.png"
              className="mr-2"
              alt="JustEat Logo"
              placeholder="empty"
              width={logoSize ?? "auto"}
              height={logoSize ?? "auto"}
            />
            {/* <h1 className="self-center pt-1 text-2xl font-extrabold whitespace-nowrap text-primary">
              Ouva
            </h1> */}
          </div>
          <div className="flex md:order-2">
            <span className="hidden sm:inline relative top-1.5 right-1">
              <SelectLanguage />
            </span>
            <div
              className="px-5 py-2.5 sm:flex gap-2 cursor-pointer"
              onClick={() => navigateFunction("/login")}
            >
              <FaUser fill={FILL_COLOR} size={21} />
              <span className="hidden sm:inline w-4 text-center">
                <span className={`${totalItems > 0 ? "" : "invisible"}`}>
                  {totalItems}
                </span>
              </span>
            </div>
            <Hamburger openFunction={openMobileMenu} />
          </div>
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              open ? "block" : "hidden"
            }`}
          >
            <ul className="flex flex-col p-4 pt-5 mt-4 border border-gray-200 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
              <NavbarItem>
                <Link href={`/${language}/partner-up-courier`}>
                  {t("components.navbar.becomeARider")}
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link href={`/${language}/partner-up-merchant`}>
                  {t("components.navbar.becomeAMerchant")}
                </Link>
              </NavbarItem>
              {isLessThan640 ? (
                <>
                  {/* <NavbarItem className={"sm:hidden"}>
                    <Link href={`/${language}/cart`}>
                      {t("components.navbar.cart")}
                    </Link>
                  </NavbarItem> */}
                  <NavbarItem className={"sm:hidden flex justify-start"}>
                    <SelectLanguage />
                  </NavbarItem>
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
