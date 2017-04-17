/* eslint-env node */
const path = require('path');
const loaderPath = path.resolve(__dirname, '../index.js');

module.exports = {
	output: {
		path: '/',
		filename: 'test.build.js',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: [
					{
						loader: 'vue-loader',
					},
					{
						loader: loaderPath,
						options: {
							path: path.resolve(__dirname, 'output/'),
						},
					},
				],
				// use: [
				// 	// {
				// 	// 	loader: 'vue-loader',
				// 	// },
				// 	{
				// 		loader: require(loaderPath),
				// 		options: {
				// 			path: path.resolve(__dirname, 'output/'),
				// 		},
				// 	},
				// ],
			},
		],
	},
};
