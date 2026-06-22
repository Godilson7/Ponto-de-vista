/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Capas SVG self-hosted em /public/covers (de confiança, sem scripts).
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // Supabase Storage (uploads de media)
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
