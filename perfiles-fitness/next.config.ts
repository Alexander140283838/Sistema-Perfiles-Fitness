import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    // Ignora los errores de ESLint al hacer el build (útil para producción en Vercel)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
