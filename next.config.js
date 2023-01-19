const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');

module.exports = withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: 'public',
          disable: process.env.NODE_ENV === 'development'
        }
      }
    ]
  ],
  {
    // Account for chunky CMS payloads
    experimental: {
      largePageDataBytes: 548 * 1000
    },
    staticPageGenerationTimeout: 300,
    typescript: {
      ignoreBuildErrors: true
    },
    webpack: (config) => {
      // Add SVGR support
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader']
      });

      return config;
    }
  }
);
