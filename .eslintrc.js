module.exports = {
	parserOptions: {
		ecmaVersion: 6
 	},
	root: true,
	extends: ['eslint:recommended', 'auz'],
	rules: {
		'linebreak-style': ['off', 'windows'],
		'max-len': ['error', 120],
	},
};
