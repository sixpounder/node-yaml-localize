node-yaml-localize
=========

A simple nodejs module to localize your applications with yaml files (rails-like)

Installation
--------------

```sh
npm install node-yaml-localize
```

Usage
--------------
You can use the provided middleware to install node-yaml-localize in your application

```sh
var localize = require('node-yaml-localize');

...

app.use(localize.middleware({
    path: __dirname + "/config/locales",
    locale: function() {
        // Check if we are using sessions
        if (typeof req.session !== undefined) {
            return req.session.locale || 'en';
        } else {
            return req.param('locale') || 'en';
        }
    }
});
```

where <i>path</i> is the root of the directory structure containing your yaml files and <i>locale</i> is a string or a function returning a string identifying a locale to use on each request (edit the implementation for your needs, this is just an example).