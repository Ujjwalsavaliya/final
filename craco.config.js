const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      paths.appPublic = path.resolve(__dirname, '.');
      paths.appHtml = path.resolve(__dirname, 'index.html');
      webpackConfig.output.publicPath = './';
      webpackConfig.plugins.forEach((plugin) => {
        if (plugin.constructor.name === 'HtmlWebpackPlugin') {
          plugin.options.template = path.resolve(__dirname, 'index.html');
        }
      });
      return webpackConfig;
    },
  },
};
