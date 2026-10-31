/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix MapLibre GL web worker MIME type issue in Next.js
      // The worker file must be served as JS, not bundled inline
      config.module.rules.push({
        test: /\.(js|mjs)$/,
        include: /node_modules\/maplibre-gl/,
        resolve: {
          fullySpecified: false,
        },
      });
    }

    // Don't attempt to bundle maplibre-gl on the server (it uses browser APIs)
    if (isServer) {
      const existingExternals = Array.isArray(config.externals)
        ? config.externals
        : typeof config.externals === 'function'
        ? [config.externals]
        : config.externals
        ? [config.externals]
        : [];
      config.externals = [...existingExternals, 'maplibre-gl'];
    }

    return config;
  },
};

module.exports = nextConfig;

