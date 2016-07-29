/**
 * Simple init method to initialize the translation instead of installing it as a middleware
 */

var translator = require('./translator');

module.exports = function (options, callback)
{
	options = options || {};
	options.defaultLanguage = options.defaultLanguage || 'en';
	options.path = options.path || __dirname + "config/locales";
	options.locale = options.locale || function () {
		return options.defaultLanguage;
	};
	translator.setPath(options.path, callback);
	translator.locale = options.locale;
};