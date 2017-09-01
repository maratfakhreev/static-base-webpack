const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = files => {
	const htmls = files.map(fileName => {
		const p = path.resolve(process.cwd(), `src/pages/${fileName}`);

		return new HtmlWebpackPlugin({
			template: path.resolve(process.cwd(), `src/index.html`),
			filename: fileName,
			inject: 'body',
			loadPages: () => require(`html-loader!${p}`)
		});
	});

	// console.log(htmls);

	const plugins = [
		...htmls,
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
				from: './img/**/*',
				to: './'
			}
		])
	];

	return {
		resolve: {
	    modules: [
	      path.resolve(process.cwd(), 'src'),
	      path.resolve(process.cwd(), 'node_modules'),
	    ],
	    extensions: ['.js', '.css']
	  },
		resolveLoader: {
			modules: [
	      path.resolve(__dirname, 'node_modules'),
	    ]
		},
		entry: path.resolve(process.cwd(), 'src/js/index.js'),
		output: {
			path: path.resolve(process.cwd(), 'build'),
			publicPath: '/',
			filename: 'application.js'
		},
		stats: {
	    assets: true,
	    chunks: false,
	    modules: false,
	    colors: true,
	    performance: true,
	    timings: true,
	    version: true,
	    warnings: true
	  },
		plugins: plugins,
		module: {
			rules: [
				{
	        test: /\.js$/,
	        exclude: [/node_modules/],
	        use: ['babel-loader']
	      },
				{
					test: /\.scss$/,
					use: [
						"style-loader",
						"css-loader",
						"sass-loader"
					]
				},
				{
					test: /\.css$/,
					use: [
						"style-loader",
						"css-loader"
					]
				},
				{
	        test: /\.(jpg|png|ttf|eot|svg|woff2|woff)$/,
	        use: ['file-loader']
	      }
			]
		}
	};
}
