import Image from "next/image";

interface StaticRouteMapProps {
  start: { lat: number; lng: number } | undefined;
  end: { lat: number; lng: number } | undefined;
}

export function StaticRouteMap({ start, end }: StaticRouteMapProps) {
  if (!start?.lat || !start?.lng || !end?.lat || !end?.lng) {
    console.error("Invalid Order RouteMap - No coordinates provided");
    return null;
  }

//   const zzz = "https://maps.geoapify.com/v1/staticmap?style=positron&width=800&height=600&apiKey=d548c5ed24604be6a9dd0d989631f783&geometry=polyline:2.303309440612793,48.87913539780315,2.305106520652771,48.87817579776886;fillcolor:%23ff1234"
  const mapUrl = `${process.env.NEXT_PUBLIC_GEOAPIFY_STATIC_MAP_URL}?style=positron&width=800&height=400&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_MAP_KEY}&geometry=polyline:${start.lng},${start.lat},${end.lng},${end.lat};fillcolor:%23ff1234`;
//   const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=600&path=color:0x0000ff|weight:5|opacity:0.7|ENCODED_ROUTE&marker=type:material|color:blue|icon:home|52.5160,13.3779&marker=type:material|color:red|icon:flag|52.5206,13.3862&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_MAP_KEY}`;
//   const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat%3A-122.29009844646316%2C47.54607447032754&zoom=14.3497&marker=lonlat%3A-122.29188334609739%2C47.54403990655936%3Btype%3Aawesome%3Bcolor%3A%23bb3f73%3Bsize%3Ax-large%3Bicon%3Apaw%7Clonlat%3A-122.29282631194182%2C47.549609195001494%3Btype%3Amaterial%3Bcolor%3A%234c905a%3Bicon%3Atree%3Bicontype%3Aawesome%7Clonlat%3A-122.28726954893025%2C47.541766557545884%3Btype%3Amaterial%3Bcolor%3A%234c905a%3Bicon%3Atree%3Bicontype%3Aawesome&apiKey=08288514c082404bab235e4acc02f16e`;

  return (
    <>
      <Image src={mapUrl} alt="Route Map" width={800} height={400} priority />
    </>
  );
}
