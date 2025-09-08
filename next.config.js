/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable source maps for better debugging in development and production
  productionBrowserSourceMaps: true,
  // Enable source maps in development (optional, as this is true by default in dev mode)
  devIndicators: {
    buildActivity: true,
  },
  // Optimize React for production
  reactStrictMode: true, // Helps catch potential issues in development
  // Add other configurations as needed
  webpack: (config, { isServer }) => {
    // Add custom webpack configurations if needed
    if (!isServer) {
      // Ensure source maps are generated for client-side code
      config.devtool = 'source-map';
    }
    return config;
  },
  // Enable experimental features (optional, only include if needed)
  // experimental: {
  //   // Add experimental features here, e.g., optimizeFonts, serverActions, etc.
  // },
};

module.exports = nextConfig;
