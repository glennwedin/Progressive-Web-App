var webpack = require('webpack'),
ExtractTextPlugin = require('extract-text-webpack-plugin'),
CompressionPlugin = require("compression-webpack-plugin");

module.exports = [{
	name: "client",
    entry: "./src/client.js",
    output: {
        path: __dirname + "/dist",
        filename: "client.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015', 'stage-1'],
                plugins: [
					"transform-decorators-legacy"
				]
            }
        }, {
            test: /\.scss$/,
            loaders: [ExtractTextPlugin.extract('style'),
				         'css?modules&importLoaders=1&localIdentName=[local]',
				         'sass?sourceMap&config=sassLoader'
					 ]
        }]
    },
	plugins: [
		new ExtractTextPlugin("../dist/css/[name].css"),
	    new CompressionPlugin({
	        asset: "[path].gz[query]",
	        algorithm: "gzip",
	        test: /\.js$|\.html$/,
	        threshold: 10240,
	        minRatio: 0.8
	    }),
		new webpack.DefinePlugin({
		  'process.env': {
		    NODE_ENV: JSON.stringify('development')
		  }
		})
	]
}, {
	name: "server",
    entry: "./src/server.js",
    output: {
        path: __dirname + "/dist",
        filename: "server.js"
    },
    target: "node",
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
			query: {
                presets: ['react', 'es2015', 'stage-1'],
                plugins: ["transform-decorators-legacy"]
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
	plugins: [
		new webpack.DefinePlugin({
		  'process.env': {
		    NODE_ENV: JSON.stringify('development')
		  }
		})
	]
}]
