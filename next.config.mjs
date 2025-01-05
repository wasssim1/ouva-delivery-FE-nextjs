import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ouvadelivery.com", "glovo.dhmedia.io"],
  },
};

export default withNextIntl(nextConfig);
