const path = require('path');

module.exports = {
  eslint: {
    enable: false,
  },
  webpack: {
    configure: (config) => {
      // Resolve @ alias for both build and dev server
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@': path.resolve(__dirname, 'src'),
      };

      // Exclude all node_modules from source-map-loader
      const rules = config.module.rules || [];
      for (const rule of rules) {
        if (
          rule &&
          rule.enforce === 'pre' &&
          rule.use &&
          Array.isArray(rule.use) &&
          rule.use.some((u) => u.loader && u.loader.includes('source-map-loader'))
        ) {
          rule.exclude = /node_modules/;
        }
      }

      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /Failed to parse source map/,
      ];

      return config;
    },
  },
};
