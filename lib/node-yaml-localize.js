var translator = require('./node-yaml-localize/translator');

// Load all files available in specified path

module.exports.ready = translator.ready;
module.exports.setPath = translator.setPath;
module.exports.translate = translator.translate;
module.exports.t = translator.translate;