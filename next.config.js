/** @type {import('next').NextConfig} */
const nextConfig = {
  // We removed the 'experimental.turbopack.root' setting as we fixed the .env.local location.
  reactStrictMode: true,
};

module.exports = nextConfig;