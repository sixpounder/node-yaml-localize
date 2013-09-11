var fs = require('fs');
var yml = require('js-yaml');

var _structure = {};
var _files = [];
var _initialized = false;
var _path = process.cwd();

var locale = "en";

var translate = function(key) {
	if (_initialized) {
		if (!key) {
			throw new Error("[Traslate] No key specified");
		};

		var chunks = key.split(".");
		var _walkerIndex = 0;
		var root = _structure[locale][chunks[_walkerIndex]];

		while(typeof root !== "string") { // Until a leaf is reached
			_walkerIndex += 1;
			root = root[chunks[_walkerIndex]];
		}

		if (root) {
			return root;	
		} else {
			return locale + "." + key + ".localization.not.found";
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
					walk(file, function(err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					results.push(file);
					next();
				}
			});
		})(); // Next

	}); // Read dir
};

module.exports.ready = _initialized;
module.exports.setPath = setPath;
module.exports.translate = translate;