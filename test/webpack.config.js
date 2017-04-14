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
				loader: loaderPath,
				options: {},
			},
		],
	},
};
