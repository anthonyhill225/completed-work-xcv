const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        fs: false,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
        timers: require.resolve('timers-browserify'),
        net: false,
        tls: false
      };
      return webpackConfig;
    },
  },
};