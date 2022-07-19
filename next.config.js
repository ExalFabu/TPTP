// @ts-check

const pwa = require('next-pwa')
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
/**
 * @type {import('next').NextConfig}
 */
const nextConfig =  {
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  webpack: function (config, { isServer, webpack }) {
    if (!isServer) {
      config.plugins.push(
            new webpack.IgnorePlugin({ resourceRegExp: /cheerio/ })
        );
    }
    return config;
},
  productionBrowserSourceMaps: true
}

module.exports = withPlugins([withBundleAnalyzer ,pwa], nextConfig)