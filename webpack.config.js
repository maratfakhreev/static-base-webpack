const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HandlebarsPlugin = require('handlebars-webpack-plugin');

const appDir = path.resolve(process.cwd(), 'src');
const buildDir = path.resolve(process.cwd(), 'build');
let appVersion;

try {
  const pjson = require(path.resolve(process.cwd(), 'package.json')); //eslint-disable-line

  appVersion = pjson.version;
} catch {
  appVersion = '0.0.1';
}

module.exports = ({ env }) => {
  const appConfig = {
    mode: env || 'development',
    entry: [path.resolve(appDir, 'index.js')],
    context: appDir,
    resolve: {
      modules: [appDir, 'node_modules'],
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, 'node_modules')],
    },
    output: {
      path: buildDir,
      publicPath: '/',
      filename: `application.${appVersion}.js`,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env),
        },
      }),
      new HandlebarsPlugin({
        entry: path.resolve(appDir, 'views', '*.hbs'),
        output: path.resolve(buildDir, '[name].html'),
        partials: [
          path.resolve(appDir, 'views', 'components', '*', '*.hbs'),
        ],
        data: { appVersion },
      }),
      new ExtractTextPlugin(`application.${appVersion}.css`),
      new CopyWebpackPlugin([
        {
          context: appDir,
          from: '**/*',
          to: './',
        },
      ], {
        copyUnmodified: true,
        ignore: ['*.js', '*.css', '*.hbs'],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: ['babel-loader'],
        },
        {
          test: /\.hbs$/,
          use: ['handlebars-loader'],
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: path.resolve(__dirname, 'postcss.config.js'),
                  },
                },
              },
            ],
          }),
        },
        {
          test: /\.(jpg|png|ttf|eot|svg|woff2|woff)$/,
          use: ['file-loader'],
        },
      ],
    },
  };

  const developmentConfig = {
    plugins: [
      new BrowserSyncPlugin({
        port: 3000,
        open: false,
        server: {
          baseDir: buildDir,
          serveStaticOptions: {
            extensions: ['html'],
          },
        },
      }),
    ],
    devtool: 'source-map',
  };

  const productionConfig = {};

  return merge(appConfig, env === 'production' ? productionConfig : developmentConfig);
};
