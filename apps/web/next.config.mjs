/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    // CI/prod build sırasında eslint hataları nedeniyle derlemeyi durdurma
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev }) => {
    // Geliştirmede dosya sistemi cache'ini kapat (Docker volume üzerinde rename hatalarını azaltır)
    if (dev) {
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;


