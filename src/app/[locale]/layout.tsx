import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AppProvider } from "@/context/AppContext";
import { Metadata } from "next";
import ReduxProvider from "@/redux/ReduxProvider";

// styles
import "@/styles/globals.css";
import "@/styles/animations.css";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Ouva Delivery",
  description: "Ouva Delivery 🍕 food delivery service and more in Tunis",
  authors: [
    {
      name: "Wassim Mhamdi",
      url: "https://oraniensquare.com",
    },
  ],
};

const RootLayout = async ({ children, params: { locale } }: Readonly<{ children: React.ReactNode, params: { locale: string } }>) => {

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <AppProvider>{children}</AppProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;