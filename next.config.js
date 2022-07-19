// @ts-check

const pwa = require('next-pwa')
const withPlugins = require('next-compose-plugins')
/**
 * @type {import('next').NextConfig}
 */
const nextConfig =  {
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
}

module.exports = withPlugins([pwa], nextConfig)