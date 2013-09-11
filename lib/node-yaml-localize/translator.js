var fs = require('fs');
var yml = require('js-yaml');

var _structure = {};
var _files = [];
var _initialized = false;
var _path = process.cwd();
var _cache = require('./store');

var locale = "en";

var _replacerRegexp = /%{[a-zA-Z]+[a-zA-Z0-9_]*}/g;

var performReplacements = function(string, replacements) {
	if (string !== null 
		&& replacements != null
		&& typeof replacements === "object") {
		var _matchesForRegex = string.match(_replacerRegexp);
		if (null !== _matchesForRegex) {
			// Some replacements have to be done!
			for(var _m in _matchesForRegex) {
				var _theMatch = _matchesForRegex[_m];
				if (_theMatch.replace("%{", "").replace("}", "") in replacements) {
					string = string.replace(_theMatch, replacements[_theMatch.replace("%{", "").replace("}", "")]);	
				}
			}
		}	
	}

	return string;
};

var translate = function(key, replacements) {
	if (_initialized) {

		if (!key) {
			throw new Error("[Traslate] No key specified");
		};

		if (_cache.get(locale + "." + key) != null) {
			// Objecy already cached for quick access
			return performReplacements(_cache.get(locale + "." + key));
		} else {
			// Walk yaml objects to find it!
			var chunks = key.split(".");
			var _walkerIndex = 0;
			var root = _structure[locale][chunks[_walkerIndex]];


			while(typeof root !== "string") { // Until a leaf is reached
				_walkerIndex += 1;
				if (typeof root === 'undefined') {
					root = null;
					break;
				} else {
					if (typeof chunks[_walkerIndex] !== 'undefined') {
						root = root[chunks[_walkerIndex]];
					} else {
						root = null;
						break;
					}
					
				}
				
			}

			if (root) {
				// Store in cache for later quick access
				_cache.set(locale + "." + key, root);
				return performReplacements(root, replacements);
			} else {
				return locale + "." + key + ".localization.not.found";
			}	
		}

		
		
	} else {
		return locale + "." + key + ".localization.not.available.yet";
	}
	
};

var setPath = function(path) {
	_initialized = false;
	_path = path;
	_initialize();
};

var _initialize = function() {
	var files = _walk(_path, function(file,results) {
		
		if (results) {
			_files = results;
			_structure = {};
			for (var i = 0; i < _files.length; i++) {
				var f = _files[i];

				// Load YAML from file (assume utf8)
				var ymlObject = yml.safeLoad(fs.readFileSync(f, 'utf8'));
				
				// Add lang root if not present
				var lang = Object.keys(ymlObject)[0];
				if (!(lang in _structure)) {
					_structure[lang] = {};
				}

				// Merge object
				for (var j = 0; j < Object.keys(ymlObject[lang]).length; j++) {
					var k = Object.keys(ymlObject[lang])[j];
					_structure[lang][k] = ymlObject[lang][k];
				};				

			};
			_initialized = true;
			console.log("yaml-localize ready, loaded " + results.length + " files");			
		}
	});
};

var _walk = function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		var i = 0;
		
		(function next() {
			var file = list[i++];
			if (!file) return done(null, results);
			file = dir + '/' + file;
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					_walk(file, function(err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					if (file.match(/^.*\.(yml|YML)/)) {
						results.push(file);
					}
					next();
				}
			});
		})(); // Next

	}); // Read dir
};

module.exports.locale = locale;
module.exports.ready = _initialized;
module.exports.setPath = setPath;
module.exports.translate = translate;