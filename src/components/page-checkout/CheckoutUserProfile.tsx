"use client";
import { Field, FieldProps, Form, Formik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useFieldsPopulated } from "react-amazing-hooks";
import { FieldsState } from "react-amazing-hooks/dist/interfaces/const";
import { useDispatch, useSelector } from "react-redux";

import { Input } from "@/components/ui/input";
import useCheckDeliveryEligibility from "@/hooks/useCheckDeliveryEligibility";
import { BasketState } from "@/interfaces/basket.interface";
import { UserFormProfile } from "@/interfaces/const";
import { FoodStore } from "@/interfaces/food-store.interface";
import { PlaceOrderRequestDto } from "@/interfaces/order.interface";
import { updateUserInfo } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";

import {
  clearAllLocalBaskets,
  clearLocalBasketByStorageKey,
} from "../dialog/BasketDialog";

interface CheckoutUserProfileProps {
  basketData: BasketState;
  storeInfo: FoodStore;
}

const CheckoutUserProfile = ({
  basketData,
  storeInfo,
}: CheckoutUserProfileProps) => {
  const t = useTranslations();
  const language = useLocale();

  const dispatch = useDispatch();
  const router = useRouter();
  // const cart = useSelector((state: RootState) => state.cart);
  const userInfo = useSelector((state: RootState) => state.user);
  // const parsedTotalCart = calculateCartTotalRaw(cart);

  // check delivery eligibility before submitting the form
  const isEligibleForDelivery = useCheckDeliveryEligibility(
    basketData,
    storeInfo
  );
  const areUserFieldsPopulated = useFieldsPopulated(
    userInfo as unknown as FieldsState
  );

  const clearBasketByStorageKey = () => {
    if (basketData.basketStorageKey) {
      clearLocalBasketByStorageKey(basketData.foodStoreSlug);
    } else {
      console.error("No basketStorageKey found in basketData");
      clearAllLocalBaskets();
    }
  };

  const placeOrderToApi = async (values: UserFormProfile) => {
    const payload: PlaceOrderRequestDto = {
      storeSlug: storeInfo.slug,
      basketStorageKey: basketData.basketStorageKey || "",
      email: values.email,
      name: values.name,
      phone: values.phone,
      deliveryAddress: {
        zoneSlug: values.addressZone, // to remove after adjusting geolocator extractor service in BE
        street: values.street,
        houseNumber: values.houseNumber,
        postalCode: values.zip,
        city: values.city,
        region: values.city, // TBD
        country: values.country,
      },
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_OUVA_API_URL}/orders/place`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response?.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      if (data.error) {
        console.error(data.error);
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // submit handler
  const handleSubmit = async (
    values: UserFormProfile,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!areUserFieldsPopulated) {
      return;
    }

    if (basketData.basketItems?.length && isEligibleForDelivery) {
      try {
        const responseData = await placeOrderToApi(values);
        if (responseData?.orderId) {
          setSubmitting(false);
          clearBasketByStorageKey();
          router.push(
            `/${language}/checkout/success?order=${responseData.orderId}`
          );
        }
      } catch (error) {
        setSubmitting(false);
        alert(
          `${t("common.error")} ${(error as any).message ?? error}.\n${t(
            "common.tryAgain"
          )}`
        );
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow lg:shadow-md xl:col-span-3">
      <h2 className="text-2xl">{t("components.cartUserProfile.title")}</h2>
      <Formik initialValues={userInfo} onSubmit={handleSubmit}>
        {({ values, isSubmitting }) => (
          <Form className="mt-5">
            <div>
              <h3 className="mb-5 text-lg">
                {t("components.cartUserProfile.yourInfo")}
              </h3>
              <div className="grid gap-4 gap-x-5 sm:grid-cols-2">
                <Field
                  name="name"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      placeholder={t("components.cartUserProfile.name")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(
                          updateUserInfo({ name: e.currentTarget.value })
                        );
                      }}
                    />
                  )}
                />
                <Field
                  name="lastname"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      placeholder={t("components.cartUserProfile.lastName")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(
                          updateUserInfo({ lastname: e.currentTarget.value })
                        );
                      }}
                    />
                  )}
                />
                <Field
                  name="email"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      placeholder={"Email"}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(
                          updateUserInfo({ email: e.currentTarget.value })
                        );
                      }}
                    />
                  )}
                />
                <Field
                  name="phone"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      placeholder={t("components.cartUserProfile.phoneNumber")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(
                          updateUserInfo({ phone: e.currentTarget.value })
                        );
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="mt-8">
              <h3 className="mb-5 text-lg">
                {t("components.cartUserProfile.deliveryAddress")}
              </h3>
              <div className="grid gap-4 gap-x-5 sm:grid-cols-2">
                <Field
                  name="street"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      placeholder={t("components.cartUserProfile.street")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(
                          updateUserInfo({ street: e.currentTarget.value })
                        );
                      }}
                    />
                  )}
                />
                <Field
                  name="houseNumber"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      placeholder={t("components.cartUserProfile.houseNumber")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(
                          updateUserInfo({ houseNumber: e.currentTarget.value })
                        );
                      }}
                    />
                  )}
                />
                <Field
                  name="zip"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      placeholder="Code Postal"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(
                          updateUserInfo({ zip: e.currentTarget.value })
                        );
                      }}
                    />
                  )}
                />
                <Field
                  name="city"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      disabled
                      className="disabled:cursor-not-allowed"
                      placeholder={t("components.cartUserProfile.city")}
                      {...field}
                    />
                  )}
                />
                <Field
                  name="addressZone"
                  render={({ field }: FieldProps) => (
                    <Input
                      className="capitalize disabled:cursor-not-allowed"
                      type="text"
                      placeholder={t("components.cartUserProfile.zone")}
                      disabled
                      {...field}
                    />
                  )}
                />
                <Field
                  name="country"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      disabled
                      className="disabled:cursor-not-allowed"
                      placeholder={t("components.cartUserProfile.country")}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="flex justify-center md:justify-end">
                <button
                  type="submit"
                  disabled={
                    !(areUserFieldsPopulated && isEligibleForDelivery) ||
                    isSubmitting
                  }
                  className={`w-full xl:max-w-60 px-6 py-2 mt-5 md:mt-10 font-semibold rounded-md text-sm text-white bg-primary hover:text-primary hover:bg-white ring-1 ring-primary ${
                    !(areUserFieldsPopulated && isEligibleForDelivery) ||
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100 hover:bg-emerald-700"
                  }`}
                >
                  {isSubmitting
                    ? t("common.sending") + "..."
                    : t("common.confirmOrder")}
                </button>
              </div>
              {!isEligibleForDelivery ? (
                <>
                  <p className="relative text-xs italic text-right text-red-600 top-2 lg:top-1 right-3">
                    {t("common.minOrderRequired")}
                  </p>
                </>
              ) : null}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CheckoutUserProfile;
