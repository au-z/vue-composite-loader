/* eslint-env node */
/* eslint-disable require-jsdoc */
let compiler = require('vue-template-compiler');
let cache = require('lru-cache')(100);
let hash = require('hash-sum');
let SourceMapGenerator = require('source-map').SourceMapGenerator;

let splitRE = /\r?\n/g;
let emptyRE = /^(?:\/\/)?\s*$/;

module.exports = function(content, filename, needMap) {
	let cacheKey = hash(filename + content);
	// source-map cache busting for hot-reloadded modules
	let filenameWithHash = filename + '?' + cacheKey;
	let output = cache.get(cacheKey);
	if (output) return output;
	output = compiler.parseComponent(content, {pad: 'line'});
	if (needMap) {
		if (output.script && !output.script.src) {
			output.script.map = generateSourceMap(filenameWithHash, content, output.script.content);
		}
		if (output.styles) {
			output.styles.forEach((style) => {
				if (!style.src) {
					style.map = generateSourceMap(filenameWithHash, content, style.content);
				}
			});
		}
	}
	cache.set(cacheKey, output);
	return output;
};

function generateSourceMap(filename, source, generated) {
	let map = new SourceMapGenerator();
	map.setSourceContent(filename, source);
	generated.split(splitRE).forEach((line, index) => {
		if (!emptyRE.test(line)) {
			map.addMapping({
				source: filename,
				original: {
					line: index + 1,
					column: 0,
				},
				generated: {
					line: index + 1,
					column: 0,
				},
			});
		}
	});
	return map.toJSON();
}
