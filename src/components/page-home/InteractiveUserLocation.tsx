"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { MdLocationOff, MdLocationOn } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { updateUserInfo } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";

export function InteractiveUserLocation() {
  const t = useTranslations();
  const language = useLocale();
  const router = useRouter();

  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user);

  const [currentGeoCoordinates, setCurrentGeoCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isGeoLocationLoading, setIsGeoLocationLoading] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(
    userInfo.selectedAddress
  );

  const isSearchButtonEnabled = () => !!selectedAddress;

  const getNavigatorGeoLocation = async () => {
    if ("geolocation" in navigator) {
      setIsGeoLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentGeoCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsGeoLocationLoading(false);
        },
        (error) => {
          console.error("Error Code = " + error.code + " - " + error.message);
          alert(t("pages.home.enableLocationAlert"));
          setCurrentGeoCoordinates({
            latitude: 0,
            longitude: 0,
          });
          setIsGeoLocationLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not available");
      alert(t("pages.home.enableLocationAlert"));
      setCurrentGeoCoordinates({
        latitude: 0,
        longitude: 0,
      });
    }
  };

  const getReverseGeocoding = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `/api/address/georeverse?latlng=${latitude},${longitude}&lang=${language}`
    );
    if (!response.ok) {
      console.error("Failed to fetch geo-reverse address data.");
      return;
    }
    const data = await response.json();
    console.log({ data });
    if (!data.address) {
      console.error("Failed to fetch address data.");
      return;
    }

    const address = data.address;
    onAddressChange(address);
    console.log({ address });
  };

  const onAddressChange = (addressData: any) => {
    console.log({ addressData });

    setSelectedAddress(addressData);

    dispatch(updateUserInfo({ selectedAddress: addressData }));
  };

  const onSearchClick = () => {
    console.log({ selectedAddress });
    if (!selectedAddress) return;

    dispatch(
      updateUserInfo({
        selectedAddress: selectedAddress as any,
        addressZone: selectedAddress.zone,
      })
    );

    router.push(`/${language}/zone/${selectedAddress.zone}`);
  };

  useEffect(() => {
    // check if user info geo coordinates are different from current geo coordinates
    const userInfoSelectedAddress = userInfo.selectedAddress;
    if (
      (userInfoSelectedAddress &&
        userInfoSelectedAddress.coordinates?.latitude !==
          currentGeoCoordinates.latitude) ||
      userInfoSelectedAddress.coordinates?.longitude !==
        currentGeoCoordinates.longitude
    ) {
      setSelectedAddress(userInfoSelectedAddress); // move up
      setCurrentGeoCoordinates({
        latitude: userInfoSelectedAddress.coordinates?.latitude || 0,
        longitude: userInfoSelectedAddress.coordinates?.longitude || 0,
      });
    }
  }, []);

  useEffect(() => {
    if (currentGeoCoordinates.latitude && currentGeoCoordinates.longitude) {
      // get address from coordinates (reverse geocoding)
      getReverseGeocoding(
        currentGeoCoordinates.latitude,
        currentGeoCoordinates.longitude
      );
      //   }
    }
  }, [currentGeoCoordinates]);

  return (
    <>
      <div className="container px-3 mx-auto md:px-2 md:w-[70%] lg:w-[50%]">
        <div className="flex justify-between items-center w-full py-2 px-10 text-gray-700 bg-white border rounded-full focus:outline-none focus:border-secondary">
          <span className="mr-3">
            {isGeoLocationLoading ? (
              <MdLocationOn className="animate-ping" size={22} />
            ) : currentGeoCoordinates?.latitude &&
              currentGeoCoordinates?.longitude ? (
              <MdLocationOn
                size={22}
                className="text-primary cursor-pointer"
                title={t("pages.home.refreshLocation")}
                onClick={getNavigatorGeoLocation}
              />
            ) : (
              <MdLocationOff
                className="text-gray-400 cursor-pointer hover:text-secondary"
                size={22}
                title={t("pages.home.enableLocation")}
                onClick={getNavigatorGeoLocation}
              />
            )}
          </span>

          <input
            className="w-full bg-transparent text-center p-2 cursor-not-allowed"
            value={selectedAddress?.formatted || ""}
            disabled
            placeholder={t("pages.home.enableLocation")}
          />

          <div className="mx-1">
            <button
              className="p-2 rounded-lg ring-1 ring-primary bg-primary text-white hover:text-primary hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isSearchButtonEnabled()}
              onClick={onSearchClick}
            >
              <FaSearchLocation
                size={22}
                className="text-white hover:text-primary"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
