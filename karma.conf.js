var path = require('path');
var bodyParser = require('body-parser');

module.exports = function (config) {
    config.set({

        basePath: '.',

        frameworks: ['mocha', 'chai-jquery', 'sinon', 'chai', 'jquery-1.8.3', 'express-http-server'],
        singleRun: true, //just run once by default

         client: {
            //mocha configuration
            mocha: {
                timeout: 5000 // adding 3s to default timeout of 2000ms
            }
        },

        files: [
            'tests.webpack.js', //just load this file
            {pattern: 'test/index.html', watched: false, served:true} // load html file
        ],
        preprocessors: {
            'test/index.html': ['html2js'], // helps load html file for dom testing
            'tests.webpack.js': [ 'webpack', 'sourcemap'] //preprocess with webpack and our sourcemap loader
        },

        /**
         * Configure webpack
         */
        webpack: { //kind of a copy of your webpack config
            debug:true,
            devtool: 'inline-source-map', //just do inline source maps instead of the default
            output: {
                library: 'GCGraphSONTextPlugin',
                libraryTarget: 'umd'
            },
            module: {
                preLoaders: [
                    // instrument only testing sources with Istanbul
                    {
                        test: /\.js$/,
                        include: path.resolve('src/'),
                        loader: 'isparta'
                    }
                ],
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
                ]
            },
            node: {
                fs: 'empty'
            }
        },

        /**
         * Configure the mock server
         * This will return fake ajax results
         */
        expressHttpServer: {
            port: 9999,
            // this function takes express app object and allows you to modify it
            // to your liking. For more see http://expressjs.com/4x/api.html
            appVisitor: function (app, log) {
                log.info('sum');

                app.use( bodyParser.json() );       // to support JSON-encoded bodies
                app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
                    extended: true
                }));

                app.post('/fiveplusfive', function (req, res) {
                    res.header("Content-Type", "application/json");
                    res.header('Access-Control-Allow-Origin', '*');
                    //default result
                    var result = { err:{message: "Incorrect POST params"} };
                    if(typeof req.body.gremlin !== "undefined" && req.body.gremlin == "5+5") {
                        // 5+5
                        result = { results:[10] };
                    } else if(typeof req.body.gremlin !== "undefined" && req.body.gremlin == "5+variable"
                                && typeof req.body.bindings !== "undefined"
                                && typeof req.body.bindings.variable !== "undefined"
                                && req.body.bindings.variable == "5"
                    ) {
                        // 5+variable (variable : 5)
                        result = { results:[10] };
                    }else if(typeof req.body.gremlin !== "undefined" && req.body.gremlin == "5+doesnotexist") {
                        // 5+doesnotexist (doesnotexist : undefined)
                        result = { err:{message:"No such property: doesnotexist for class: Script (Error 597)"} };
                    }
                    res.status(200).send(JSON.stringify(result));
                });

            }
        },

        reporters: ['mocha', 'coverage', 'coveralls'],

        coverageReporter: {
            type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
            dir: 'coverage/'
        },

        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: false,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        browsers: [
            'Firefox'
        ],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-chai',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-mocha-reporter',
            'karma-coverage',
            'karma-coveralls',
            'karma-html2js-preprocessor',
            'karma-sinon',
            'karma-chai-jquery',
            'karma-jquery',
            'karma-express-http-server'
        ]

    });
};
