var fs = require('fs');

var _structure = {};
var _files = [];
var _initialized = false;
var _path = process.cwd();

var translate = function(key) {
	if (_initialized) {
		if (!key) {
			throw new Error("[Traslate] No key specified");
		};

		// Stub
		return key + ".translation.here";
	} else {
		return key + ".localization.not.available.yet";
	}
	
};

var setPath = function(path) {
	_initialized = false;
	_path = path;
	_initialize();
};

var _initialize = function() {
	var files = _walk(_path, function(file,results) {
		_initialized = true;
		if (results) {
			_files = results;
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