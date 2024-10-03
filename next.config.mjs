/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard/organization",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/dashboard/organization",
        permanent: true,
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
