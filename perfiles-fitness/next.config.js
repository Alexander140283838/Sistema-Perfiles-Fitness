/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // 👈 le dice a Vercel que use la carpeta src/app
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 mantiene tu configuración actual
  },
};

module.exports = nextConfig;
