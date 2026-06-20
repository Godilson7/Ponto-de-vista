/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage (uploads de media)
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
