gc-ajax-plugin is a [gremlin-console](https://github.com/PommeVerte/gremlin-console-js) plugin that loads an http page rather than connecting directly to gremlin-server via websockets. This allows users to handle authentication and authorization on the server end.

[![Build Status](https://travis-ci.org/PommeVerte/gc-ajax-plugin.svg?branch=master)](https://travis-ci.org/PommeVerte/gc-ajax-plugin) [![Coverage Status](https://coveralls.io/repos/github/PommeVerte/gc-ajax-plugin/badge.svg?branch=master)](https://coveralls.io/github/PommeVerte/gc-ajax-plugin?branch=master) [![npm](https://img.shields.io/npm/v/gc-ajax-plugin.svg)]() [![GitHub license](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/PommeVerte/gc-ajax-plugin/master/LICENSE.txt)

## Install
```
npm install gc-ajax-plugin
```

## Getting started

##### Using ES2015/2016
```javascript
import GremlinConsole from 'gremlin-console';
import GCAjaxPlugin from 'gc-ajax-plugin';

//create a console + input combo by passing css selectors to GremlinConsole
//Load http://localhost:80/my/path
const gc = GremlinConsole('#console-window', '#console-input' {
    host:"http://localhost",
    port: 80,
    driverOptions: {path: "/my/path"}
});
gc.register(GCAjaxPlugin()); //register the plugin
```

##### In browser
It is **not** recomended that you do this as this is relatively heavy. `gremlin-console` and `gc-ajax-plugin` will contain duplicate dependencies (though they shouldn't conflict). However it is a possible use case.
```html
<head>
  <!-- ... -->
  <link rel="stylesheet" type="text/css" href="umd/css/default.css">
  <script src="path-to-umd/gremlin-console.min.js"></script>
  <script src="path-to-umd/gc-ajax-plugin.min.js"></script>
</head>
```
```javascript
//create a console + input combo by passing css selectors to GremlinConsole
//Load http://localhost:80/my/path
var gc = GremlinConsole.create('#console-window', '#console-input' {
    host:"http://localhost",
    port: 80,
    driverOptions: {path: "/my/path"}
});
gc.register(GCAjaxPlugin.init()); //register the plugin
```

## Server side requirements
It is the User's responsibility to set up the appropriate web page for the console to connect to. You can do any Authentication or Authorization you may require here.

In the examples above the console will send `POST` requests to `http://localhost:80/my/path`. These requests will provide the following form data :
- **`gremlin`** : a `string` containing the gremlin query.
- **`bindings`** : an `array` containing bindings for the query. _You can pretty much ignore this unless you are doing some really low level calls against the `Console` API_

In return the console expects to receive a `gremlin-server` response (`GraphSON` format) as a string (full result, no streaming supported at the moment).

**Note**: It may be required for you to set the following header for your response: `Access-Control-Allow-Origin: *`.

## Advanced

You can use this plugin along side other plugins (such as the text output plugin). Just be wary of the registration order. You'll want to register this plugin before the others
