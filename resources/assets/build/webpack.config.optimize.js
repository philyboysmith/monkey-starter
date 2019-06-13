'use strict'; // eslint-disable-line

const { default: ImageminPlugin } = require('imagemin-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob-all');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const config = require('./config');

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  plugins: [
    new ImageminPlugin({
      optipng: { optimizationLevel: 2 },
      gifsicle: { optimizationLevel: 3 },
      pngquant: { quality: '65-90', speed: 4 },
      svgo: {
        plugins: [
          { removeUnknownsAndDefaults: false },
          { cleanupIDs: false },
          { removeViewBox: false },
        ],
      },
      plugins: [imageminMozjpeg({ quality: 75 })],
      disable: (config.enabled.watcher),
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 5,
        compress: {
          warnings: true,
          drop_console: true,
        },
      },
    }),
    new PurgecssPlugin({
      paths: glob.sync([
        'app/**/*.php',
        'resources/views/**/*.php',
        'resources/assets/scripts/**/*.js',
      ]),
      extractors: [
        {
          extractor: TailwindExtractor,
          extensions: ['html', 'js', 'php'],
        },
      ],
      whitelist: [
        'rtl',
        'home',
        'blog',
        'archive',
        'date',
        'error404',
        'logged-in',
        'admin-bar',
        'no-customize-support',
        'custom-background',
        'wp-custom-logo',
      ],
      whitelistPatterns: [
          /^search(-.*)?$/,
          /^(.*)-template(-.*)?$/,
          /^(.*)?-?single(-.*)?$/,
          /^postid-(.*)?$/,
          /^attachmentid-(.*)?$/,
          /^attachment(-.*)?$/,
          /^page(-.*)?$/,
          /^(post-type-)?archive(-.*)?$/,
          /^author(-.*)?$/,
          /^category(-.*)?$/,
          /^tag(-.*)?$/,
          /^tax-(.*)?$/,
          /^term-(.*)?$/,
          /^(.*)?-?paged(-.*)?$/,
      ],
    }),
  ],
};
