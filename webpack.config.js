const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const appDir = path.resolve(process.cwd(), 'src');
const buildDir = path.resolve(process.cwd(), 'build');

module.exports = {
  mode: 'production',
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
    filename: 'application.js',
  },
  plugins: [
    new ExtractTextPlugin('application.css'),
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
    new CopyWebpackPlugin([
      {
        context: 'src/assets/',
        from: '**/*',
        to: './assets',
      },
      {
        context: 'src/',
        from: '*.*',
        to: './',
      },
    ], {
      ignore: ['index.js'],
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
        test: /\.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html',
            },
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true,
              exports: false,
            },
          },
        ],
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
