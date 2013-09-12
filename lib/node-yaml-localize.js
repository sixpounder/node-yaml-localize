var translator = require('./node-yaml-localize/translator');

var middleware = require('./node-yaml-localize/middleware');

// Load all files available in specified path

exports.ready = translator.ready;
exports.setPath = translator.setPath;
exports.translate = translator.translate;
exports.t = translator.translate; // Alias
exports.locale = translator.locale;

exports.middleware = middleware;