/* eslint-env node */
/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');
const MemoryFS = require('memory-fs');
let webpack = require('webpack');
let expect = require('chai').expect;

const mfs = new MemoryFS();
let webpackConfig = require('./webpack.config');

/**
 * Runs webpack with the given configuration, calling the cb function when done
 * @param {Object} options webpack loader options
 * @param {*} cb a callback fn
 */
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
	compiler.outputFileSystem = mfs;
	compiler.run((err, stats) => {
		// expect(err).to.be.null;
		if(err) {
			console.error(err);
		}
		if (stats.compilation.errors.length) {
			stats.compilation.errors.forEach((err) => console.error(err.message));
		}
		expect(stats.compilation.errors).to.be.empty;
		// console.log(compiler.outputFileSystem);
		const output = mfs.readFileSync('/test.build.js').toString();
		cb(output, stats.compilation.warnings);
	});
}

/**
 * Tests a given webpack configuration output, calling assert after webpack is complete
 * @param {Object} options weboack options
 * @param {*} assert the assertion function to test
 */
function test(options, assert) {
	bundle(options, (code, warnings) => {
		assert(code);
	});
}

/* eslint-disable no-undef */
describe('vue-component-loader', function() {
	it('combines template, script, and style', (done) => {
		test({entry: './test/fixtures/app.vue'}, (code) => {
			let file = fs.readFileSync(path.resolve(__dirname, 'output/app.js')).toString();
			expect(file).to.not.be.null;
			done();
		});
	});
	it('strips import statements, comments, and Vue.use() statements', (done) => {
		test({entry: './test/fixtures/scriptNeedsParsing.vue'}, (code) => {
			let file = fs.readFileSync(path.resolve(__dirname, 'output/scriptNeedsParsing.js')).toString();
			expect(file.indexOf('import') === -1).to.be.true;
			expect(file.indexOf('Vue.use(') === -1).to.be.true;
			expect(file.indexOf('/*') === -1).to.be.true;
			expect(file.indexOf('http://testurl.com') === -1).to.be.false;
			done();
		});
	});
});
