/** @type {import('next').NextConfig} */
const config= {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
}

export default config;