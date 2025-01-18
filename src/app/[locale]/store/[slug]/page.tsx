import { Metadata } from "next";
import { notFound } from "next/navigation";

// components
import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";
import { StorePageInteractiveWrapper } from "@/components/page-store/StorePageInteractiveWrapper";

import { FoodStore } from "@/interfaces/food-store.interface";
import Head from "next/head";

export async function generateStaticParams() {
  return fetch(`${process.env.NEXT_PUBLIC_OUVA_API_URL}/food-stores`)
    .then((response) => response.json())
    .then((data) => {
      return data.ouvaStores?.map((store: FoodStore) => ({
        params: { slug: store.slug },
      }));
    })
    .catch((err) => {
      console.error("Error fetching store data", { err });
      return [];
    });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const storeData = await fetch(
    `${process.env.NEXT_PUBLIC_OUVA_API_URL}/food-stores/${params.slug}`
  ).then((response) => response.json());

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

const Page = async ({ params }: { params: { slug: string } }) => {
  const storeData = await fetch(
    `${process.env.NEXT_PUBLIC_OUVA_API_URL}/food-stores/${params.slug}`
  ).then((response) => response.json());

  if (!storeData) {
    notFound();
  }

  const menuItemsByStoreData = await fetch(
    `${process.env.NEXT_PUBLIC_OUVA_API_URL}/food-stores/${params.slug}/menu-items`
  ).then((response) => response.json());

  if (!menuItemsByStoreData || menuItemsByStoreData.error) {
    notFound();
  }

  return (
    <>
      <Head>
        <title>{`${storeData.name} | Ouva Delivery`}</title>
      </Head>

      <LayoutContainer>
        <Navbar />

        <StorePageInteractiveWrapper
          storeData={storeData}
          menuItemsPerStore={menuItemsByStoreData}
        />

        <Footer />
      </LayoutContainer>
    </>
  );
};

export default Page;

export const dynamic = "force-dynamic";
