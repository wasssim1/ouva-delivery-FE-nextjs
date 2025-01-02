import { Metadata } from "next";
import { notFound } from "next/navigation";

// components
import { StorePageInteractiveWrapper } from "@/components/StorePageInteractiveWrapper";
import { RESTAURANTS_LIST_DATA } from "@/data/restaurants";

export async function generateStaticParams() {
  return RESTAURANTS_LIST_DATA.map((store) => ({
    params: { slug: store.slug },
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const storeData = RESTAURANTS_LIST_DATA.find((store) => store.slug === params.slug);

  if(!storeData) {
    return {
      title: "Store not found",
      description: "Store not found",
    }
  }

  return {
    title: storeData.name,
    description: storeData.description,
  }
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
      <head>
        <title>{storeData.name}</title>
      </head>
      <StorePageInteractiveWrapper storeData={storeData} />
    </>
  );
};

export default Page;
