node-yaml-localize
=========

A simple nodejs module to localize your applications with yaml files (rails-like)

Installation
--------------

```sh
npm install node-yaml-localize
```

Setup
--------------
You can use the provided middleware to install node-yaml-localize in your application

```sh
var localize = require('node-yaml-localize');

...

app.use(localize.middleware({
    path: __dirname + "/config/locales",
    locale: function(req, res) {
        // Check if we are using sessions
        if (typeof req.session !== 'undefined') {
            return req.session.locale || 'en';
        } else {
            return req.param('locale') || 'en';
        }
    }
}));
```

where <i>path</i> is the root of the directory structure containing your yaml files (defaults to <__dirname>/config/locales) and <i>locale</i> is a string or a function returning a string identifying a locale to use on each request (edit the implementation for your needs, this is just an example).

If you want to use the library as an helper in your view, you can simply do this in your app.js

```sh
app.locals.t = localize.translate;
```

Usage
------------
Example of using the helper in a Jade view
```sh
div.greetings
    p= t("home.greetings.welcome")
```

Having somewhere in your <i>path</i> a YML file containing
```sh
en:
  home:
    greetings:
      welcome:  "Welcome to nodejs"
```

will output

```sh
Welcome to nodejs
```

First entry in the YML file denotes the locale its children are for (in the example, english). Just add more files with different roots and same structure for more localizations.

Placeholders
------------------

Example of using the helper in a Jade view with placeholders
```sh
div.greetings
    p= t("home.greetings.welcome", {name : "John Doe"})
```

Having somewhere in your <i>path</i> a YML file containing
```sh
en:
  home:
    greetings:
      welcome:  "Welcome to nodejs %{name}"
```

will output the localized string with the replaced placeholder

```sh
Welcome to nodejs John Doe
```

Notes
-------------
node-yaml-localize assumes well formed utf-8 YAML files. Do not mess up.

License
-----------------
Released under BSD license.
