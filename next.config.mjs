import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ouvadelivery.com", "maps.geoapify.com"],
    // remotePatterns: ["https://ouvadelivery.com/*", "https://maps.geoapify.com"],
  },
};

export default withNextIntl(nextConfig);
