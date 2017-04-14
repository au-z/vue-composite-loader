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
	return input;

	function injectTemplate(script, template) {
		console.log('IDX: ', getInsertIndex(script.content));

	}

	function injectStyles(script, styles) {
		styles.forEach((s) => {
		});
	}

	/**
	 * Finds the closing bracket on the export default of the .vue file script tag
	 * @param {string} jsObj the input JS object as a string
	 */
	function getInsertIndex(jsObj) {
		return jsObj.lastIndexOf('}');
	}
};
