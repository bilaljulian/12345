// next.config.js

const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPlugins([
  [withImages],
  [optimizedImages, {
    optimizeImagesInDev: true,
  }],
  [withPWA, {
    pwa: {
      dest: 'public',
      runtimeCaching,
    },
  }],
], {
  env: {
    SITE_NAME: 'eNull',
    SITE_DESCRIPTION: 'eNull - Your source for rare items',
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
  },
  images: {
    domains: ['your-image-domain.com'], // Add the domains you use for images
  },
  i18n: {
    locales: ['en-US', 'es', 'fr'],
    defaultLocale: 'en-US',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }
    return config;
  },
  reactStrictMode: true,
});
