var translator = require('./node-yaml-localize/translator');
var middleware = require('./node-yaml-localize/middleware');
var init = require('./node-yaml-localize/init');

// Load all files available in specified path

/**
 * APIs export
 */

// Set path for YAML files
exports.setPath = translator.setPath;

// Translate api (and alias)
exports.translate = translator.translate;
exports.t = translator.translate;

// Current locale
exports.locale = translator.locale;

// Connect/Express middleware
exports.middleware = middleware;

// Initialize for use outside Connect/Express
exports.init = init;