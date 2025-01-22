import { NextRequest, NextResponse } from "next/server";
import { AddressResult } from "../lookup/route";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const GEOAPIFY_API_URL = process.env.GEOAPIFY_API_URL;
  const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

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

  const mrjTst = {
    latitude: 36.7062232,
    longitude: 10.201925,
  };

  // TBD: strategy: use request coordinates to calculate and find the closet subZone key Point in the database (each subZone should be associated to a zone)
  // instead of gowApify

  const geoApifyResponse = await fetch(
    `${GEOAPIFY_API_URL}/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}&lang=${language}&format=json`
    // `${GEO_APIFY_URL}/geocode/reverse?lat=${mrjTst.latitude}&lon=${mrjTst.longitude}&apiKey=${GEO_APIFY_API_KEY}&lang=${language}&format=json`
  );
  const response = await geoApifyResponse.json();

  if (!response.results?.length) {
    return NextResponse.json({ error: "No address found" }, { status: 404 });
  }

  const address = mapGeoApifyResponse(response);

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

const mapGeoApifyResponse = (response: any) => {
  const addressProperties = response.results[0];
  const responseQuery = response.query;
  const addressZone = findSelectedAddressZone(addressProperties);
  const address: AddressResult = {
    formatted: formatAddress(addressProperties),
    coordinates: {
      latitude: responseQuery?.lat || addressProperties.lat,
      longitude: responseQuery?.lon || addressProperties.lon,
    },
    zone: addressZone, //zoneSlug || addressProperties.city.toLowerCase().includes("mourouj") ? 'el-mourouj' : undefined,
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

const findSelectedAddressZone = (addressProps: any): string | undefined => {
  const zones = [
    {
      zoneSlug: "el-mourouj",
      cityKey: "mourouj",
      stateDistrictKey1: "معتمدية المروج",
      stateDistrictKey2: "Délégation El Mourouj",
      countyKey: "المروج",
      postCodeKey: "2074",
    },
  ];

  const foundZone = zones.find((zone) => {
    return isAddressInZone(addressProps, zone);
  });

  if (!foundZone) {
    return undefined;
  }
  // return undefined;

  return foundZone.zoneSlug;
};

const isAddressInZone = (
  addressProps: any,
  zoneSearchKeys: {
    cityKey: string;
    stateDistrictKey1: string;
    stateDistrictKey2: string;
    countyKey: string;
    postCodeKey: string;
  }
): boolean => {
  const city = addressProps.city?.toLowerCase();
  const stateDistrict = addressProps.state_district?.toLowerCase();
  const county = addressProps.county?.toLowerCase();
  const postCode = addressProps.postcode?.toLowerCase();

  return (
    city?.includes(zoneSearchKeys.cityKey) ||
    stateDistrict?.includes(zoneSearchKeys.stateDistrictKey1.toLowerCase()) ||
    stateDistrict?.includes(zoneSearchKeys.stateDistrictKey2) ||
    county?.includes(zoneSearchKeys.countyKey.toLowerCase()) ||
    postCode?.includes(zoneSearchKeys.postCodeKey)
  );
};

// TODO: try boundingbox

/* const handleAddressMatchedZone = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<string | undefined> => {
  if (!lat || !lon) {
    return undefined;
  }
  return undefined;

  // TODO: call the database to get the Zone Polygon within
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_OUVA_API_URL}/zones/check?latlng=${lat},${lon}`
  // );
  // const data = await response.json();

  // return data?.zone;
}; */
