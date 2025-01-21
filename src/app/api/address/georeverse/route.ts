import { NextRequest, NextResponse } from "next/server";
import { AddressResult } from "../lookup/route";

const GEO_APIFY_URL = "https://api.geoapify.com/v1";
const GEO_APIFY_API_KEY = "1d6e3dd797374c43aae4e8acb7761253";

export async function GET(
  request: NextRequest
): Promise<AddressResult | NextResponse> {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("lang") || "fr";
  const latlng = searchParams.get("latlng");
  if (!latlng) {
    return NextResponse.json(
      { error: "Invalid latlng parameter" },
      { status: 400 }
    );
  }

  const [latitude, longitude] = latlng.split(",").map(Number);
  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Invalid latlng parameter" },
      { status: 400 }
    );
  }

  // const mrjTst = {
  //   latitude: 36.7062232,
  //   longitude: 10.201925,
  // };

  // TBD: strategy: use request coordinates to calculate and find the closet subZone key Point in the database (each subZone should be associated to a zone)
  // instead of gowApify

  const geoApifyResponse = await fetch(
    `${GEO_APIFY_URL}/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEO_APIFY_API_KEY}&lang=${language}&format=json`
    // `${GEO_APIFY_URL}/geocode/reverse?lat=${mrjTst.latitude}&lon=${mrjTst.longitude}&apiKey=${GEO_APIFY_API_KEY}&lang=${language}&format=json`
  );
  const response = await geoApifyResponse.json();

  if (!response.results?.length) {
    return NextResponse.json({ error: "No address found" }, { status: 404 });
  }

  const zoneSlug = handleAddressMatchedZone(response.query);

  const address = mapGeoApifyResponse(response, zoneSlug);
  // const addressProperties = EL_MOUROUJ_AUTOCOMPLETE_ADDRESSES[0] as any;

  //   const address =
  //     latitude > 36.71
  //       ? EL_MOUROUJ_AUTOCOMPLETE_ADDRESSES[0]
  //       : EL_MOUROUJ_AUTOCOMPLETE_ADDRESSES[1];
  return NextResponse.json(
    { address },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

const formatAddress = (_addressProps: any) => {
  if (_addressProps.street && _addressProps.houseNumber && _addressProps.city) {
    return `${_addressProps.street} ${_addressProps.houseNumber}, ${_addressProps.city}`;
  }

  const isFormattedEnough = _addressProps.formatted?.split(",")?.length > 2;

  return `${
    isFormattedEnough
      ? ""
      : `${_addressProps.plus_code_short || _addressProps.plus_code}, `
  }${_addressProps.formatted}`;
};

const mapGeoApifyResponse = (response: any, zoneSlug: string) => {
  const addressProperties = response.results[0];
  const responseQuery = response.query;
  const address: AddressResult = {
    formatted: formatAddress(addressProperties),
    coordinates: {
      latitude: responseQuery?.lat || addressProperties.lat,
      longitude: responseQuery?.lon || addressProperties.lon,
    },
    zone: zoneSlug,
    addressComponents: {
      plusCode: responseQuery?.plus_code || addressProperties.plus_code,
      plusCodeShort: addressProperties.plus_code_short,
      street: addressProperties.street,
      houseNumber: addressProperties.housenumber,
      zip: addressProperties.postcode,
      city: addressProperties.city,
      state: addressProperties.state,
      country: addressProperties.country,
    },
  };

  return address;
};

const handleAddressMatchedZone = ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): string => {
  if (!lat || !lon) {
    return "el-mourouj";
  }

  // TODO: call the database to get the Zone Polygon within

  const zoneSlug = "el-mourouj";
  return zoneSlug;
};
