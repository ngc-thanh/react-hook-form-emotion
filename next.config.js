/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MONGO_URL: process.env.MONGO_URL,
  },
};

module.exports = nextConfig;
