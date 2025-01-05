"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";
import { useLocale } from "next-intl";

const Page = () => {
  const router = useRouter();
  const language = useLocale();

  return (
    <LayoutContainer>
      <Navbar />
      <div className="relative mt-32 text-center">
        <div className="flex justify-center">
          <Image
            src={"/assets/img/order-cancelled.png"}
            alt="order-cancelled.png"
            loading="eager"
            width={250}
            height={250}
            className="w-80 xs:w-96 md:w-[25rem] mx-auto cursor-pointer fading-in-animation"
            onClick={() => router.push(`/${language}/`)}
          />
        </div>
      </div>
      <Footer />
    </LayoutContainer>
  );
};

export default Page;
