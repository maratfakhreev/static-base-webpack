const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = files => {
  const htmlWebpackPlugins = files.map(filename => (
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), `src/views/${filename}`),
      filename: `${path.parse(filename).name}.html`,
      inject: 'body'
    })
  ));

  return {
    resolve: {
      modules: [
        path.resolve(process.cwd(), 'src')
      ],
      extensions: ['.js', '.css', '.pcss', '.pug']
    },
    resolveLoader: {
      modules: [
        path.resolve(__dirname, 'node_modules')
      ]
    },
    entry: path.resolve(process.cwd(), 'src/scripts/index.js'),
    output: {
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
      filename: 'application.js'
    },
    plugins: [
      ...htmlWebpackPlugins,
      new BrowserSyncPlugin({
        server: {
          baseDir: [path.resolve(process.cwd(), 'build')]
        },
        port: 3000,
        host: 'localhost',
        open: false
      }),
      new CopyWebpackPlugin([
        {
          context: 'src/assets/',
          from: '**/*',
          to: './assets'
        },
        {
          context: 'src/',
          from: '*.*',
          to: './'
        }
      ])
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: ['babel-loader']
        },
        {
          test: /\.pug$/,
          use: ['pug-loader']
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              query: {
                modules: true,
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(__dirname, 'postcss.config.js')
                }
              }
            }
          ]
        },
        {
          test: /\.(jpg|png|ttf|eot|svg|woff2|woff)$/,
          use: ['file-loader']
        }
      ]
    }
  };
};
