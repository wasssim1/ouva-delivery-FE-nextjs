"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/footer/Footer";
import LayoutContainer from "@/components/LayoutContainer";
import Navbar from "@/components/navbar/Navbar";
import { toLocaleCurrency } from "@/lib/utils";

type OrderTrackDetail = {
  id: string;
  status: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: string;
  history: { fromStatus?: string; toStatus: string; timestamp: number }[];
  store: {
    slug: string;
    name: string;
    addressFormatted: string;
    coordinates: { lat: number; lng: number } | undefined;
  };
  deliveryAddress: {
    formatted: string;
    coordinates: { lat: number; lng: number } | undefined;
  };
};

export default function TrackOrderPage() {
  const params = useSearchParams();
  const t = useTranslations();
  const language = useLocale();

  const [orderDetail, setOrderDetail] = useState<OrderTrackDetail | null>(null);
  const [fetchError, setFetchError] = useState("");

  const fetchOrderDetail = async () => {
    const orderId = params.get("id");
    if (!orderId) {
      setFetchError(t("pages.trackOrder.orderNotFound"));
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OUVA_API_URL}/orders/track/${orderId}`
    );
    if (!response.ok) {
      setFetchError(t("pages.trackOrder.orderNotFound"));
      console.error("Error fetching order detail", response);
      return;
    }
    const data = await response.json();

    if (
      !data?.orderDetail ||
      !data.orderDetail.store?.address?.coordinates.lat ||
      !data.orderDetail.store?.address?.coordinates.lng ||
      !data.orderDetail.deliveryAddress?.coordinates.lat ||
      !data.orderDetail.deliveryAddress?.coordinates.lng
    ) {
      setFetchError(t("pages.trackOrder.orderNotFound"));
      console.error("Error fetching order detail", response);
      return;
    }

    const _orderDetail = {
      id: data.orderDetail.orderId,
      status: data.orderDetail.orderStatus,
      totalAmount: data.orderDetail.totalAmount,
      deliveryFee: data.orderDetail.deliveryFee,
      paymentMethod: data.orderDetail.paymentMethod,
      history: data.orderDetail.history,
      store: {
        slug: data.orderDetail.store.storeSlug,
        name: data.orderDetail.store.storeName,
        addressFormatted: data.orderDetail.store.address.addressFormatted,
        coordinates: {
          lat: data.orderDetail.store.address.coordinates.lat,
          lng: data.orderDetail.store.address.coordinates.lng,
        },
      },
      deliveryAddress: {
        formatted: data.orderDetail.deliveryAddress.formatted,
        coordinates: {
          lat: data.orderDetail.deliveryAddress.coordinates.lat,
          lng: data.orderDetail.deliveryAddress.coordinates.lng,
        },
      },
    };
    setOrderDetail(_orderDetail);
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [params]);

  return (
    <>
      <LayoutContainer>
        <Navbar />
        <div className="container h-screen mt-10 text-center">
          <div className="text-primary text-2xl">
            <h1>
              {`${t("pages.trackOrder.pageTitle")} "${params.get("id")}"`}
            </h1>
          </div>

          {!!orderDetail && (
            <div className="flex justify-center mt-10 mx-1">
              <ul className="list-disc text-start space-y-2">
                <li>
                  {t("pages.trackOrder.storeName")}: {orderDetail.store?.name}
                </li>
                <li>
                  {t("pages.trackOrder.storeAddress")}:{" "}
                  {orderDetail.store?.addressFormatted}
                </li>
                <li>
                  {t("pages.trackOrder.destinationAddress")}:{" "}
                  {orderDetail.deliveryAddress?.formatted}
                </li>
                <li>
                  {t("pages.trackOrder.orderStatus")}:{" "}
                  {t(`enums.${orderDetail.status}`)}
                </li>
                <li>
                  {t("pages.trackOrder.totalOrderAmount")}:{" "}
                  {toLocaleCurrency(orderDetail.totalAmount)}
                </li>
                <li>
                  {t("pages.trackOrder.deliveryFee")}:{" "}
                  {toLocaleCurrency(orderDetail.deliveryFee)}
                </li>
                <li>
                  {t("pages.trackOrder.totalAmountToPay")}:{" "}
                  {toLocaleCurrency(
                    orderDetail.deliveryFee + orderDetail.totalAmount
                  )}
                </li>
                <li>
                  {t("pages.trackOrder.paymentMethod")}:{" "}
                  {t(`enums.${orderDetail.paymentMethod}`)}
                </li>
                <li>
                  {t("pages.trackOrder.orderHistory")}:
                  <ul className="list-decimal ml-7">
                    {orderDetail.history.map((h, idx) => (
                      <li key={idx + "-" + h.timestamp}>
                        {h.fromStatus ? t(`enums.${h.fromStatus}`) + "->" : ""}{" "}
                        {t(`enums.${h.toStatus}`)}
                        {": "}
                        {new Date(h.timestamp).toLocaleDateString(
                          `${language}-TN`,
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            weekday: "long",
                            hourCycle: "h23",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
              {fetchError && <div className="text-secondary">{fetchError}</div>}
            </div>
          )}

          {/* <div className="flex justify-center mt-10">
            {orderDetail.store?.coordinates &&
            orderDetail.deliveryAddress?.coordinates ? (
              <StaticRouteMap
                start={orderDetail.store.coordinates}
                end={orderDetail.deliveryAddress.coordinates}
              />
            ) : (
              <div className="text-secondary">{fetchError}</div>
            )}
          </div> */}
        </div>

        <Footer />
      </LayoutContainer>
    </>
  );
}
