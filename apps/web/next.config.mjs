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
  webpack: (config) => {
    // CSS loader Tailwind/PostCSS için varsayılan yeterli; burada ek ayar yok.
    return config;
  }
};

export default nextConfig;


