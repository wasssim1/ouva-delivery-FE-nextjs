"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";

const Page = () => {
  const params = useSearchParams();
  const t = useTranslations();
  const language = useLocale();

  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!params.get("order")?.trim()) {
      notFound();
    }

    setOrderId(params.get("order"));
  }, [params]);

  return (
    <LayoutContainer>
      <Navbar />
      <div className="mt-10 text-center">
        <div className="mx-3 space-y-3">
          <p className="text-2xl md:text-3xl font-bold tracking-tight top-2">
            {t("common.orderPlaced")}!
          </p>
        </div>

        <div className="bottom-8 md:bottom-12">
          <p className="tracking-tight text-center text-balance opacity-90 p-1.5 text-sm sm:text-md md:text-base">
            {t("pages.orderPlaced.paragraph")}
          </p>
          <p className="tracking-tight text-center text-balance opacity-90 p-1.5 text-sm sm:text-md md:text-base">
            {t("pages.orderPlaced.trackOrder")}{" "}
            <Link
              className="text-primary hover:text-secondary"
              href={`/${language}/track-order?id=${orderId}`}
            >
              {orderId}
            </Link>
            .
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src={"/assets/img/ouva-order-success.png"}
            alt="ouva-order-success.png"
            loading="eager"
            width={320}
            height={320}
            className="w-80 xs:w-96 md:w-[34rem] mx-auto bottom-5"
          />
        </div>
      </div>
      <Footer />
    </LayoutContainer>
  );
};

export default Page;
