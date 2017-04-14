/* eslint-env node */
/* eslint-disable no-console */
const MemoryFS = require('memory-fs');
let webpack = require('webpack');
let expect = require('chai').expect;
// const hash = require('hash-sum');

const fs = new MemoryFS();
let webpackConfig = require('./webpack.config');

function bundle(options, cb) {
	let vueOptions = options.vue;
	delete options.vue;
	let config = Object.assign({}, webpackConfig, options);

	// assign vue Options
	if (vueOptions) {
		config.plugins = (config.plugins || []).concat(new webpack.LoaderOptionsPlugin({
			vue: vueOptions,
		}));
	}

	let compiler = webpack(config);
	compiler.outputFileSystem = fs;
	compiler.run((err, stats) => {
		// expect(err).to.be.null;
		if(err) {
			console.error(err);
		}
		if (stats.compilation.errors.length) {
			stats.compilation.errors.forEach((err) => console.error(err.message));
		}
		expect(stats.compilation.errors).to.be.empty;
		cb(fs.readFileSync('/test.build.js').toString(), stats.compilation.warnings);
	});
}

function test(options, assert) {
	bundle(options, (code, warnings) => {
		console.log('[CODE] ', code);
		assert(code);
		// jsdom.env({
		// 	html: '<!DOCTYPE html><html><head></head><body></body></html>',
		// 	src: [code],
		// 	done: (err, window) => {
		// 		if (err) {
		// 			console.log(err[0].data.error.stack);
		// 			expect(err).to.be.null;
		// 		}
		// 		assert(window, interopDefault(window.vueModule), window.vueModule);
		// 	}
		// });
	});
}

function interopDefault(module) {
	return module ? module.__esModule ? module.default : module : module;
}

/* eslint-disable no-undef */
describe('vue-component-loader', function() {
	it('parses template, script, and style', (done) => {
		test({entry: './test/fixtures/app.vue'}, (code) => {
			console.log('CODE: ', code);
			expect(code).to.not.be.null;
			done();
		});
	});
});
