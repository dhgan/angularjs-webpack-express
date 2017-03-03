var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var ENV = process.env.ENV;
var isDev = ENV === 'dev'

var pages = fs.readdirSync(path.join(__dirname, './src/pages'));

var config = {
	devtool: ENV == 'dev' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
	entry: [ path.join(__dirname, './src/main.js') ],
	output: {
		path: path.join(__dirname, 'public'),
		publicPath: '/',
		filename: 'js/[name].[hash:8].js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'ENV': JSON.stringify(ENV)
		}),
		new CleanWebpackPlugin(['public/*', 'views/*']),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'js/vendor.js'
		}),
		new HtmlWebpackPlugin({
			alwaysWriteToDisk: true,
			filename: path.join(__dirname, './views/index.html'),
			template: path.join(__dirname, './src/index.html'),
			inject: 'body'
		}),
		new ExtractTextPlugin({
			filename: 'styles/[name].[hash:8].css',
			allChunks: !isDev
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				htmlLoader: {
					ignoreCustomFragments: [/\{\{.*?}}/],
					attrs: ['img:src', 'link:href']
				}
			}
		})

	],
	module: {
		rules: [
			{
				test: /.html$/,
				use: ['html-loader']
			}, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    	fallback: 'style-loader',
                    	use: ['css-loader?minimize='+ !isDev, 'postcss-loader']
                     })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                          fallback: 'style-loader',
                          use: ['css-loader?minimize='+ !isDev, 'postcss-loader', 'sass-loader']
                     })
            }, {
            	test: /\.(png|jpg)$/,
    			use: 'url-loader?limit=8192&name=imgs/[name].[hash:8].[ext]'
            }
		]
    }
}

pages.forEach(function(page) {
	var conf = {
		alwaysWriteToDisk: true,
		filename: path.join(__dirname, './views/'+ page + '.html'),
		template: path.join(__dirname, './src/pages/'+ page + '/'+ page + '.html'),
		inject: false
	};
	config.plugins.push(new HtmlWebpackPlugin(conf));
});

// build环境
if(ENV === 'build') {
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        minimize: true,
        sourceMap: true
    }));
} else {
	config.plugins.push(new HtmlWebpackHarddiskPlugin());
}

module.exports = config;