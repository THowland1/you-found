const withPlugins = require("next-compose-plugins");
const nextTypeSafePages = require("next-type-safe-routes/plugin");

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  }
};

module.exports = withPlugins([nextTypeSafePages], nextConfig);
