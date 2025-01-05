import { Metadata } from "next";
import { notFound } from "next/navigation";

// components
import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";
import { StorePageInteractiveWrapper } from "@/components/page-store/StorePageInteractiveWrapper";

import { RESTAURANTS_LIST_DATA } from "@/data/restaurants";
import Head from "next/head";

export async function generateStaticParams() {
  return RESTAURANTS_LIST_DATA.map((store) => ({
    params: { slug: store.slug },
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const storeData = RESTAURANTS_LIST_DATA.find(
    (store) => store.slug === params.slug
  );

  if (!storeData) {
    return {
      title: "Store not found | Ouva Delivery",
      description: "Store not found",
    };
  }

  return {
    title: `${storeData.name} | Ouva Delivery`,
    description: storeData.description,
  };
}

const Page = ({ params }: { params: { slug: string } }) => {
  const storeData = RESTAURANTS_LIST_DATA.find(
    (store) => store.slug === params.slug
  );

  if (!storeData) {
    notFound();
  }

  return (
    <>
      <Head>
        <title>{`${storeData.name} | Ouva Delivery`}</title>
      </Head>

      <LayoutContainer>
        <Navbar />

        <StorePageInteractiveWrapper storeData={storeData} />

        <Footer />
      </LayoutContainer>
    </>
  );
};

export default Page;

export const dynamic = "force-dynamic"
