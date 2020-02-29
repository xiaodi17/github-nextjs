const webpack = require('webpack')
const withCss = require('@zeit/next-css')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const config = require('./config')

const configs = {
  // compile dest
  distDir: 'dest',
  generateEtags: true,
  onDemandEntries: {
    // session time limit（ms）
    maxInactiveAge: 25 * 1000,
    // page limit
    pagesBufferLength: 2
  },
  pageExtensions: ['jsx', 'js'],
  generateBuildId: async () => {
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID
    }
    return null
  },
  // webpack config
  webpack(config, options) {
    return config
  },
  // change webpackDevMiddleware config
  webpackDevMiddleware: config => {
    return config
  },
  env: {
    customKey: 'value'
  },
  // server rendering config
  serverRuntimeConfig: {
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET
  },
  // client side rendering config
  publicRuntimeConfig: {
    staticFolder: '/static'
  }
}

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}

module.exports = withBundleAnalyzer(
  withCss({
    webpack(config) {
      config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
      return config
    },
    publicRuntimeConfig: {
      GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
      OAUTH_URL: config.OAUTH_URL
    },
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: '../bundles/server.html'
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: '../bundles/client.html'
      }
    }
  })
)
