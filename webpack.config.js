const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const appDir = path.resolve(process.cwd(), 'src');
const buildDir = path.resolve(process.cwd(), 'build');
let appVersion;

try {
  const pjson = require(path.resolve(process.cwd(), 'package.json')); //eslint-disable-line

  appVersion = pjson.version;
} catch {
  appVersion = '0.0.1';
}

module.exports = ({ NODE_ENV }) => {
  const appConfig = {
    mode: NODE_ENV,
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
          NODE_ENV: JSON.stringify(NODE_ENV),
        },
      }),
      new HandlebarsPlugin({
        entry: path.resolve(appDir, 'views', '*.hbs'),
        output: path.resolve(buildDir, '[name].html'),
        partials: [
          path.resolve(appDir, 'views', 'components', '*', '*.hbs'),
        ],
        data: {
          appVersion,
          dev: NODE_ENV === 'development',
        },
      }),
      new ExtractTextPlugin(`application.${appVersion}.css`),
      new CopyWebpackPlugin([
        {
          context: appDir,
          from: '**/*',
          to: './',
        },
      ], {
        ignore: ['*.js', '*.css', '*.hbs'],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  require('@babel/preset-env').default,
                  {
                    modules: false,
                    targets: {
                      browsers: [
                        'last 2 versions',
                      ],
                    },
                  },
                ],
              ],
              plugins: [
                require('@babel/plugin-proposal-class-properties').default,
              ],
            },
          },
        },
        {
          test: /\.hbs$/,
          use: {
            loader: 'handlebars-loader',
            options: {
              rootRelative: 'views/components/',
            },
          },
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(__dirname, 'postcss.config.js'),
                },
              },
            },
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
    devtool: 'source-map',
    plugins: [
      new LiveReloadPlugin(),
    ],
  };

  const productionConfig = {};

  const configs = {
    development: developmentConfig,
    production: productionConfig,
  };

  return merge(appConfig, configs[NODE_ENV]);
};
