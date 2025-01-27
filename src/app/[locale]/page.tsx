"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-amazing-hooks";

// components
import Header from "@/components/Header";
import LayoutContainer from "@/components/LayoutContainer";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { InteractiveUserLocation } from "@/components/page-home/InteractiveUserLocation";
import Paragraph from "@/components/typography/Paragraph";
import Title from "@/components/typography/Title";

// assets
const headerImage = "/assets/img/gallery/image-5.png";
const appStore = "/assets/img/app-store.png";
const appStoreMobile = "/assets/img/app-store-mobile.jpg";
const smartPhoneImage = "/assets/img/logo-large-ouva.png";

export default function HomePage() {
  const t = useTranslations();
  const isDesktop = useMediaQuery({ min: 992 });
  const isMobile = useMediaQuery({ max: 600 });
  const [showImages, setShowImages] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const focusInputFunction = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImages(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LayoutContainer>
        <Navbar />

        <div className="w-full" onLoad={focusInputFunction}>
          <Header bgSRC={headerImage} />

          <main className="fading-in-animation select-none">
            <div className="mt-10 text-center">
              <Title>{t("pages.home.title")}</Title>
            </div>

            <InteractiveUserLocation/>

            {/* <div className="mt-10 text-center">
              <Link href={`/${language}/orders`}>
                <Button
                  className={
                    "focus:outline-none bg-primary hover:bg-secondary text-white focus:ring-0 font-semibold text-xl rounded-lg py-3 px-4 mr-4 mb-4 min-h-[2.8125em] md:w-72"
                  }
                >
                  {t("pages.home.button")}
                </Button>
              </Link>
            </div> */}

            <div className="gap-6 mx-auto mt-20 xl:mt-28 xl:flex xl:justify-evenly max-w-7xl">
              <div className="flex justify-center mx-auto xl:block xl:mx-0">
                {showImages && (
                  <>
                    <Image
                      src={smartPhoneImage}
                      className={`${isMobile ? "w-52" : "w-80"}`}
                      width={`${isMobile ? 208 : 320}`}
                      height={`${isMobile ? 208 : 320}`}
                      alt="App OuvaDelivery"
                      title="App OuvaDelivery"
                      loading="lazy"
                    />
                  </>
                )}
              </div>
              <div className="text-center pt-14 md:pt-20 lg:pt-24">
                <Paragraph>
                  <span className="px-2">
                    {t("pages.home.paragraph1")}
                    <span className="inline-block pl-1 sm:block sm:pl-0">
                      {t("pages.home.paragraph2")}
                    </span>
                  </span>
                </Paragraph>
                <div className="flex justify-center mt-20 sm:mt-14">
                  {showImages && (
                    <>
                      <Image
                        src={isDesktop ? appStore : appStoreMobile}
                        width={`${isDesktop ? 384 : 160}`}
                        height={`${isDesktop ? 384 : 160}`}
                        alt="App OuvaDelivery"
                        title="App OuvaDelivery"
                        loading="lazy"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </LayoutContainer>
    </>
  );
}
