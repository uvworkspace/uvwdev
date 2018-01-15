'use strict';

const resolve = require('path').resolve;
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const BrowserSync = require('browser-sync');
const stripAnsi = require('strip-ansi');

module.exports = function (app, config) {
  const devConfig = config.devConfig;
  const webpackConfig = config.webpack;
  const webpackDevConfig = merge({
    publicPath: webpackConfig.output.publicPath,
    stats: false
  }, config.webpackDev);
  const browserSyncConfig = merge({
    logFileChanges: true,
    middleware: [],
    plugins: ['bs-fullscreen-message'],
    port: 3001,
    proxy: 'localhost:' + 3000,
    online: false,
    ui: {
      port: 3002
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0'
      }
    },
    open: false,
    files: [
      {
        match: [
          resolve(devConfig.projectRoot, 'client', '**', '*.css'),
          resolve(devConfig.projectRoot, 'src', '**', '*.html'),
          resolve(devConfig.projectRoot, 'webpack.config.js')
        ]
      }
    ]
  }, config.browserSync);

  const browserSync = BrowserSync.create();
  const compiler = webpack(webpackConfig);
  const devMiddleware = webpackDevMiddleware(compiler, webpackDevConfig);
  const hotMiddleware = webpackHotMiddleware(compiler);

  // Reload all devices when webpack bundle is complete
  // or send a fullscreen error message to the browser instead
  compiler.plugin('done', function (stats) {
    console.log('--- Webpack Stats: ---');
    console.log(stats.toString({colors: true, chunks: false}));
    console.log('------');

    if (stats.hasErrors() || stats.hasWarnings()) {
      return browserSync.sockets.emit('fullscreen:message', {
        title: 'Webpack Error:',
        body: stripAnsi(stats.toString()),
        timeout: 100000
      });
    }
  });

  app.use(devMiddleware);
  app.use(hotMiddleware);
  browserSync.init(browserSyncConfig);
};
