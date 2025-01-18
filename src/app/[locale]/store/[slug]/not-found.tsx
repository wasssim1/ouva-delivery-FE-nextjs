"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";

export default function NotFound() {
  const t = useTranslations();
  const language = useLocale();

  return (
    <LayoutContainer>
      <Navbar />

      <hr />
      <div className="container text-center items-center min-h-screen mt-10 space-y-5">
        <div>
          <h2 className="m-auto text-secondary text-2xl">
            {t("pages.store.storeNotFound")}
          </h2>
        </div>
        {/* return to home */}
        <div>
          <Link
            href={`/${language}/`}
            className="text-primary hover:text-secondary transition duration-300 ease-in-out"
          >
            {t("common.returnToHome")}
          </Link>
        </div>
      </div>

      <Footer />
    </LayoutContainer>
  );
}
