import { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";
import { ZonePageInteractiveWrapper } from "@/components/page-zone/ZonePageInteractiveWrapper";

import { RESTAURANTS_LIST_DATA } from "@/data/restaurants";
import { STORE_CATEGORIES } from "@/data/store-categories";
import { ZONES_LIST_DATA } from "@/data/zones";
import Head from "next/head";

export async function generateStaticParams() {
  return ZONES_LIST_DATA.map((zone) => ({
    params: { slug: zone.slug },
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const zoneData = ZONES_LIST_DATA.find((zone) => zone.slug === params.slug);

  if (!zoneData) {
    return {
      title: "Zone not found | Ouva Delivery",
      description: "Zone not found",
    };
  }

  return {
    title: `${zoneData.name} | Ouva Delivery`,
    description: `Find the best restaurants in ${zoneData.name}`,
  };
}

const Page = ({ params }: { params: { slug: string } }) => {
  const zoneData = ZONES_LIST_DATA.find((zone) => zone.slug === params.slug);

  if (!zoneData) {
    notFound();
  }

  const availableStoresListData = RESTAURANTS_LIST_DATA.filter(
    (store) => store.zone === zoneData.slug
  );

  const availableStoreCategoriesData = STORE_CATEGORIES.filter((category) =>
    availableStoresListData.some((store) =>
      store.categories.includes(category.slug)
    )
  );

  return (
    <>
      <Head>
        <title>{`${zoneData.name} | Ouva Delivery`}</title>
      </Head>

      <LayoutContainer>
        <Navbar />

        <ZonePageInteractiveWrapper
          zoneData={zoneData}
          storeCategoriesData={availableStoreCategoriesData}
          storesListData={availableStoresListData}
        />

        <Footer />
      </LayoutContainer>
    </>
  );
};

export default Page;

export const dynamic = "force-dynamic"
