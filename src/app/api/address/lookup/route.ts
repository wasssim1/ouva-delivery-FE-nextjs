import { EL_MOUROUJ_AUTOCOMPLETE_ADDRESSES } from "@/data/addresses.data";
import { NextRequest, NextResponse } from "next/server";

const ADDRESS_LOOKUP_API =
  "https://api.glovoapp.com/v3/addresslookup/pub/address?address=";

type GeoIPData = {
  ip?: string;
  geo?: { lat: number; lng: number };
};

export type AddressResult = {
  formatted: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  zone: string;
  addressComponents?: any;
};

type SearchAddressResponse = {
  results: AddressResult[];
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  const ip = request.headers.get("x-forwarded-for");
  const host = request.headers.get("x-forwarded-host");


  if (!query || query.length < 3) {
    return NextResponse.json(
      { error: "Invalid search query." },
      { status: 400 }
    );
  }

  try {
    // const fetchedResponse: AddressResult[] = await fetchFromGlovo(query);
    // console.log({ fetchedResponse });

    // let results: AddressResult[] = fetchedResponse.map((addr: any) => {
    //   console.log({ addr });
    //   return {
    //     formatted: addr.fullAddress || `${addr.title}, ${addr.subtitle}`,
    //     coordinates: {
    //       latitude: addr.latitude,
    //       longitude: addr.longitude,
    //     },
    //     zone: addr.zone || isAddressZoneInMourouj(addr) ? "el-mourouj" : "",
    //     addressComponents: addr.addressComponents,
    //   };
    // });

    // if (!results.length) {
    //   results = EL_MOUROUJ_AUTOCOMPLETE_ADDRESSES;
    // }
    const results = EL_MOUROUJ_AUTOCOMPLETE_ADDRESSES;

    return NextResponse.json<SearchAddressResponse>({ results });
  } catch (error) {
    console.log({ error });

    return NextResponse.json(
      { error: "Failed to fetch address data." },
      { status: 500 }
    );
  }
}

async function fetchFromGlovo(query: string): Promise<AddressResult[]> {
  const headers = new Headers();

  headers.set("Glovo-Delivery-Location-Latitude", "36.7127935");
  headers.set("Glovo-Delivery-Location-Longitude", "10.1996502");
  const response = await fetch(
    ADDRESS_LOOKUP_API + encodeURIComponent(query),
    //   `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    //     query
    //   )}.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN`
    {
      headers,
    }
  );
  const data = await response.json();
  console.log({ data });
  if (!data || !data.addresses) {
    console.warn(`No search results for: ${query}`);
    return [];
  }

  return data.addresses?.filter(
    (addr: any) =>
      addr.countryCode === "TN" || addr.subtitle.includes("Tunisia")
  );
}

function isAddressZoneInMourouj(addressData: any) {
  return (
    addressData.title.toLowerCase().includes("mourouj") ||
    addressData.subtitle.toLowerCase().includes("mourouj") ||
    addressData.fullAddress.toLowerCase().includes("mourouj")
  );
}
