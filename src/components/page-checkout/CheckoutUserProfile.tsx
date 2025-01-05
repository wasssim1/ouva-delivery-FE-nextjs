"use client";
import { Field, FieldProps, Form, Formik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useFieldsPopulated } from "react-amazing-hooks";
import { FieldsState } from "react-amazing-hooks/dist/interfaces/const";
import { useDispatch, useSelector } from "react-redux";

import useCheckDeliveryEligibility from "@/hooks/useCheckDeliveryEligibility";
import { BasketState } from "@/interfaces/basket.interface";
import { UserFormProfile } from "@/interfaces/const";
import { updateUserInfo } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";

import { Input } from "@/components/ui/input";

interface CheckoutUserProfileProps {
  basketData: BasketState;
}

const CheckoutUserProfile = ({ basketData }: CheckoutUserProfileProps) => {
  const t = useTranslations();
  const language = useLocale();

  const dispatch = useDispatch();
  const router = useRouter();
  // const cart = useSelector((state: RootState) => state.cart);
  const userInfo = useSelector((state: RootState) => state.user);
  // const parsedTotalCart = calculateCartTotalRaw(cart);

  // check delivery eligibility before submitting the form
  const isEligibleForDelivery = useCheckDeliveryEligibility(basketData);
  const areUserFieldsPopulated = useFieldsPopulated(
    userInfo as unknown as FieldsState
  );


  const clearBasketStorage = () => {
    localStorage.removeItem(`${basketData.foodStore.slug}-basket-state`);
  };

  // submit handler
  const handleSubmit = async (
    values: UserFormProfile,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!areUserFieldsPopulated) {
      return;
    }

    if (basketData.orderItems.length && isEligibleForDelivery) {
      try {
        // const response = await fetch("/api/create-checkout-session", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   // body: JSON.stringify({ amount, language }),
        // });

        // const data = await response.json();
        // const stripe = await stripePromise;

        // if (stripe && data.sessionId) {
        //   await stripe.redirectToCheckout({ sessionId: data.sessionId });
        // }

        // clearBasketStorage();
        router.push(`/${language}/checkout/success`);
      } catch (error) {
        alert("An error occurred. Please try again.");
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
                      placeholder={t("components.cartUserProfile.yourName")}
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
                      placeholder={t("components.cartUserProfile.yourLastName")}
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
                      placeholder={t(
                        "components.cartUserProfile.yourPhoneNumber"
                      )}
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
              <h3 className="mb-5 text-lg">{t("common.deliveryAddress")}</h3>
              <div className="grid gap-4 gap-x-5 sm:grid-cols-2">
                <Field
                  name="address"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      placeholder={t("common.deliveryAddress")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(
                          updateUserInfo({ address: e.currentTarget.value })
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
                      placeholder="Zip Code"
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
                  name="addressZone"
                  render={({ field }: FieldProps) => (
                    <Input
                      className="capitalize disabled:cursor-not-allowed"
                      type="text"
                      placeholder={t("common.deliveryZone")}
                      disabled
                      {...field}
                    />
                  )}
                />
                {/* <Field
                  name="city"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      disabled
                      className="disabled:cursor-not-allowed"
                      placeholder={t("common.city")}
                      {...field}
                    />
                  )}
                /> */}
                <Field
                  name="country"
                  render={({ field }: FieldProps) => (
                    <Input
                      type="text"
                      disabled
                      className="disabled:cursor-not-allowed"
                      placeholder={t("common.country")}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="flex justify-center md:justify-end">
                <button
                  type="submit"
                  disabled={!(areUserFieldsPopulated && isEligibleForDelivery)}
                  className={`w-full xl:max-w-60 px-6 py-2 mt-5 md:mt-10 font-semibold rounded-md text-sm text-white bg-primary hover:text-primary hover:bg-white ring-1 ring-primary ${
                    !(areUserFieldsPopulated && isEligibleForDelivery)
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
