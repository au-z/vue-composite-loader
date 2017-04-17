/* eslint-env node */
/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');
const parse = require('./parser');

module.exports = function(input){
	this.cacheable();

	const fileName = path.basename(this.resourcePath);
	const outFileName = fileName.replace(/\.vue$/, '.js');
	const options = loaderUtils.getOptions(this) || {};

	const parts = parse(input, fileName);
	// const hasScoped = parts.styles.some((s) => s.scoped);
	let output = formatScript(parts.script.content);
	output = injectTemplate(output, parts.template);
	output = injectStyles(output, parts.styles);
	output = toClosure(output);

	const outpath = path.resolve(options.path || '', outFileName);
	fs.writeFile(outpath, output);
	return input;

	/**
	 * Pre-processes the js.
	 * @param {string} js the input js
	 * @return {string} the formatted js
	 */
	function formatScript(js) {
		// remove Vue.use() statements
		js = js.replace(/Vue\.use\(.+\);?/igm, '');
		// remove import statements
		js = js.replace(/import.*\n/igm, '');
		// remove comments
		js = js.replace(/(\/\*.*\*\/)|(\/\/.*\n)/gm, '');
		// remove unnecessary whitespace
		js = js.trim().replace(/(\/\/\n)+/igm, '');
		return js;
	}

	/**
	 * Injects a given html template into the js Vue component definition.
	 * @param {string} js the Vue component definition js object
	 * @param {*} template the template to inject
	 * @return {string} the injected js Vue component
	 */
	function injectTemplate(js, template) {
		let insertIdx = getInsertIndex(js) - 1;
		let pre = js.slice(0, insertIdx);
		let post = js.slice(insertIdx);
		js = pre + '\n\ttemplate: `' + template.content.trim() + '`,' + post;
		return js;
	}

	/**
	 * Concatenates the parsed style content and injects it into the Vue component definition.
	 * @param {string} js the Vue component definition js object
	 * @param {Array} styles an array of style objects with content
	 * @return {string} the injected js
	 */
	function injectStyles(js, styles) {
		let allStyles = styles.map((s) => s.content.trim()).join('\n\t');
		let insertIdx = getInsertIndex(js) - 1;
		let pre = js.slice(0, insertIdx);
		let post = js.slice(insertIdx);
		js = pre + '\n\t_injectCss: `' + allStyles + '`,' + post;
		return js;
	}

	/**
	 * Turns a JS object into a self-executing function
	 * @param {Object} js the script to transform
	 * @return {Object} the transformed script
	 */
	function toClosure(js) {
		js = js.replace('export default', '').trim();
		return '(function() {\n\treturn ' + js + '\n})();\n';
	}

	/**
	 * Finds the closing bracket on the export default of the .vue file script tag
	 * @param {string} jsObj the input JS object as a string
	 * @return {number} the index of the closing bracket
	 */
	function getInsertIndex(jsObj) {
		return jsObj.lastIndexOf('}');
	}
};
