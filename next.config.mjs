/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: ./out se publica en S3 + CloudFront (ver .github/workflows/deploy.yml)
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: false,
};

export default nextConfig;
