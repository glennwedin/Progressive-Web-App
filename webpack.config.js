var webpack = require('webpack'),
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
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-1'],
                plugins: [
					'transform-decorators-legacy',
                    'transform-async-to-generator',
                    'transform-regenerator'
				]
            }
        }, {
            test: /\.scss$/,
            loaders: ["style", "css", "scss", "sass"]
        }]
    },
	plugins: [
	    new CompressionPlugin({
	        asset: "[path].gz[query]",
	        algorithm: "gzip",
	        test: /\.js$|\.html$/,
	        threshold: 10240,
	        minRatio: 0.8
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
            loader: 'babel-loader',
			query: {
                presets: ['react', 'es2015', 'stage-1'],
                plugins: [
					'transform-decorators-legacy',
                    'transform-async-to-generator',
                    'transform-regenerator'
				]
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
	]
}]
