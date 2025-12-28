/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental:{
globalNotFound:true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "ibb.co",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
      },
    ],
  },
  // i18n: {
  //   locales: ['en', 'es'],
  //   defaultLocale: 'es',

  // },
};

export default nextConfig;