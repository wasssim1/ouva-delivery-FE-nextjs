import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { RootState } from "@/redux/store";

const GEOAPIFY_API_KEY = "1d6e3dd797374c43aae4e8acb7761253";
// const MAP_MARKER_ICON_ASSET = "/assets/map/place-marker.svg";
const MAP_MARKER_ICON_ASSET_URL = "/favicon.ico";
const MAP_MARKER_ICON_RETINA_ASSET_URL = "/favicon.ico";
const MAP_MARKER_ICON_SHADOW_ASSET_URL = "/favicon.ico";

export function LeafletMapPicker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const userInfo = useSelector((state: RootState) => state.user);

  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: userInfo.selectedAddress?.coordinates?.latitude,
    lng: userInfo.selectedAddress?.coordinates?.longitude,
  });

  const handleSelectGeoLocation = (lat: number, lng: number) => {
    setSelectedCoordinates({ lat, lng });
    onLocationSelect(lat, lng);
  };

  useEffect(() => {
    const { lat, lng } = selectedCoordinates;
    if (!lat || !lng) {
      console.error("No coordinates provided");
      return;
    }

    const map = L.map("map", {
      // attributionControl: false,
      // center: [lat, lng],
      maxZoom: 20,
    }).setView([lat, lng], 17);

    L.tileLayer(
      `${process.env.NEXT_PUBLIC_GEOAPIFY_MAP_URL}/positron/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`,
      {
        // style: "positron",
        attribution: "&copy; OpenStreetMap",
        maxZoom: 25,
      }
    ).addTo(map);
    map.attributionControl.setPrefix("Ouva Delivery 🇹🇳");

    const customIcon = L.icon({
      iconUrl: MAP_MARKER_ICON_ASSET_URL,
      iconRetinaUrl: MAP_MARKER_ICON_RETINA_ASSET_URL,
      shadowUrl: MAP_MARKER_ICON_SHADOW_ASSET_URL,
      iconSize: [32, 32], // Adjust as needed
      shadowSize: [41, 41], // Adjust as needed
      iconAnchor: [16, 32], // Point of the icon that corresponds to the marker's location
      shadowAnchor: [12, 41],
    });

    let marker = L.marker([lat, lng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    const onMapClick = (event: L.LeafletMouseEvent) => {
      if (marker) marker.remove();
      const { lat, lng } = event.latlng;
      // marker = L.marker([lat, lng]).addTo(map);
      marker = L.marker([lat, lng], {
        icon: customIcon,
        draggable: true,
      })
        .addTo(map)
        .bindPopup("Vous êtes ici");
      // update coordinates on click
      handleSelectGeoLocation(lat, lng);

      // update coordinates on dragend

      // TODO: add animation
      // marker.bounce({ duration: 500, height: 15 });
    };

    const onMarkerDragEnd = (event: L.DragEndEvent) => {
      const { lat, lng } = event.target.getLatLng();
      handleSelectGeoLocation(lat, lng);
    };

    map.on("click", onMapClick);
    marker.on("dragend", onMarkerDragEnd);

    return () => {
      map.off("click", onMapClick);
      marker.off("dragend", onMarkerDragEnd);
      map.remove();
    };
  }, [onLocationSelect]);

  return (
    <>
      <div
        id="map"
        style={{ height: "300px", width: "100%", borderRadius: "1rem" }}
      />
    </>
  );
}
