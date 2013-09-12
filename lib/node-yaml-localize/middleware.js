var translator = require('./translator');

module.exports = function(options) {
	options = options || {};

	if (typeof options !== 'undefined') {
		// setting path, triggers file loading
		if (typeof this.setPath !== 'undefined'
			&& typeof options.path === 'string') {
			
		}
	}

	options.path = options.path || __dirname + "config/locales";
	options.locale = options.locale || function() {
		return 'en';
	};	

	translator.setPath(options.path);

	function middleware(req,res,next) {
		try {
			
			if (typeof options.locale !== 'undefined') {
				if (typeof options.locale === 'function') {
					translator.locale = options.locale(req,res);
				} else if (typeof options.locale === 'string') {
					translator.locale = options.locale;
				}
			}	
		} catch(e) {
			console.log(e);
		} finally {
			next();	
		}
	};

	return middleware;

};