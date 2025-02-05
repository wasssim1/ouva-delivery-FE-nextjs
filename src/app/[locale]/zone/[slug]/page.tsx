import { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";
import { ZonePageInteractiveWrapper } from "@/components/page-zone/ZonePageInteractiveWrapper";

import { Zone } from "@/interfaces/zone.interface";

export async function generateStaticParams() {
  const zonesResp: Zone[] = await fetch(
    `${process.env.NEXT_PUBLIC_OUVA_API_URL}/zones/`
  ).then((res) => res.json());

  if (!zonesResp) {
    console.error("Error fetching zones data - static params");
    return [];
  }

  return zonesResp.map((zone) => ({
    params: { slug: zone.slug },
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const zoneData = await fetch(
    `${process.env.NEXT_PUBLIC_OUVA_API_URL}/zones/${params.slug}/`
  ).then((res) => res.json());
  if (!zoneData || zoneData.error) {
    console.error("Error fetching zone data - metadata");
    notFound();
  }

  return {
    title: `${zoneData.name} | Ouva Delivery`,
    description: `Find the best restaurants in ${zoneData.name}`,
  };
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const zoneData = await fetch(
    `${process.env.NEXT_PUBLIC_OUVA_API_URL}/zones/${params.slug}/`,
    { cache: "no-store" }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching zone data - slug", { err });
      notFound();
    });

  if (!zoneData || zoneData.error) {
    notFound();
  }

  const storesListDataResp = await fetch(
    `${process.env.NEXT_PUBLIC_OUVA_API_URL}/food-stores/find?zone=${params.slug}`,
    { cache: "no-store" }
  );
  const storeListData = await storesListDataResp.json();
  if (!storeListData || storeListData.error) {
    console.error(`Error fetching stores data by zone-slug: "${params.slug}"`);
  }
  const availableStoresListData = storeListData.foundStoresInZone;

  // const categoriesIdsSet = new Set();
  // availableStoresListData.forEach((store: FoodStore) => {
  //   store.categories.forEach((categId) => {
  //     categoriesIdsSet.add(categId);
  //   });
  // });
  // const storeCategoriesDataResp = await fetch(
  //   `${process.env.NEXT_PUBLIC_OUVA_API_URL}/store-categories/find?ids=${[
  //     ...categoriesIdsSet,
  //   ].join(",")}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // )
  //   .then((res) => res.json())
  //   .catch((err) => {
  //     console.error("Error fetching store categories data - slug", { err });
  //   });

  // const availableStoreCategoriesData = storeCategoriesDataResp?.categoriesList;
  // TODO: filter categories based on available stores
  // STORE_CATEGORIES.filter((category) =>
  //   availableStoresListData.some((store) =>
  //     store.categories.includes(category.slug)
  //   )
  // );

  return (
    <>
      <LayoutContainer>
        <Navbar />

        <ZonePageInteractiveWrapper
          zoneData={zoneData}
          // storeCategoriesData={availableStoreCategoriesData || []}
          storeCategoriesData={[]}
          storesListData={availableStoresListData || []}
        />

        <Footer />
      </LayoutContainer>
    </>
  );
};

export default Page;

export const dynamic = "force-dynamic";
