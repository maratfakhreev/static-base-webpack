const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appDir = path.resolve(process.cwd(), 'src');
const buildDir = path.resolve(process.cwd(), 'build');

module.exports = {
  resolve: {
    modules: [
      appDir
    ]
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'node_modules')
    ]
  },
  entry: path.resolve(appDir, 'index.js'),
  output: {
    path: buildDir,
    publicPath: '/',
    filename: 'application.js'
  },
  plugins: [
    new BrowserSyncPlugin({
      server: {
        baseDir: [
          buildDir
        ],
        serveStaticOptions: {
          extensions: ['html']
        }
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
    ], {
      ignore: ['index.js']
    })
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
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html'
            }
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true,
              exports: false
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
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
