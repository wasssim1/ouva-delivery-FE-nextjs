import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // domains: ["ouvadelivery.com", "maps.geoapify.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ouvadelivery.com",
      },
      {
        protocol: "https",
        hostname: "maps.geoapify.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
