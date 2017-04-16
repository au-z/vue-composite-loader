/* eslint-env node */
/* eslint-disable no-console */
const path = require('path');
const parse = require('./parser');

module.exports = function(input){
	this.cacheable();

	const fileName = path.basename(this.resourcePath);
	const parts = parse(input, fileName);
	console.log(parts);
	const hasScoped = parts.styles.some((s) => s.scoped);
	parts.script = injectTemplate(parts.script, parts.template);
	parts.script = injectStyles(parts.script, parts.styles);
	parts.script = toClosure(parts.script);
	console.log('out: ', parts.script.content);
	return input;

	function injectTemplate(script, template) {
		let insertIdx = getInsertIndex(script.content) - 1;
		let pre = script.content.slice(0, insertIdx);
		let post = script.content.slice(insertIdx);
		script.content = pre + '\n\ttemplate: `' + template.content.trim() + '`,' + post;
		return script;
	}

	function injectStyles(script, styles) {
		let allStyles = styles.map((s) => s.content.trim()).join('\n\t');
		let insertIdx = getInsertIndex(script.content) - 1;
		let pre = script.content.slice(0, insertIdx);
		let post = script.content.slice(insertIdx);
		script.content = pre + '\n\t_injectCss: `' + allStyles + '`,' + post;
		return script;
	}

	/**
	 * Turns a JS object into a self-executing function
	 * @param {Object} script the script to transform
	 * @return {Object} the transformed script
	 */
	function toClosure(script) {
		let retObj = script.content.replace('export default', '');
		console.log(retObj);
		return '(function() {\n\t return' + retObj + '\n})();\n';
	}

	/**
	 * Finds the closing bracket on the export default of the .vue file script tag
	 * @param {string} jsObj the input JS object as a string
	 */
	function getInsertIndex(jsObj) {
		return jsObj.lastIndexOf('}');
	}
};
