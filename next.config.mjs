/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Product photos are served by the backend (NEXT_PUBLIC_API_URL),
      // e.g. https://admin.sanctumchem.com/uploads/products/x.png —
      // without this, next/image silently refuses to load them.
      { protocol: 'https', hostname: 'admin.sanctumchem.com' },
      { protocol: 'https', hostname: '*.sanctumchem.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
  },
};

export default nextConfig;
