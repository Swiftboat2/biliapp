/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@biliapp/shared-types', '@biliapp/validators'],
};

module.exports = nextConfig;

