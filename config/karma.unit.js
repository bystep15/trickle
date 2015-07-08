// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../src/',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'lib/seajs/2.3.0/sea.js',
            'lib/seajs-preload/1.0.0/seajs-preload.js',
            'lib/seajs-css/1.0.4/seajs-css.js',
            'lib/seajs-text/1.1.1/seajs-text.js',
            'config.js',
            '**/js/*.js',
            'vendor/jquery/1.11.2/jquery.js',
            '**/test/*Spec.js'
        ],

        // list of files / patterns to exclude
        exclude: [
            '**/js/*.js'
        ],

        // web server port
        port: 8080,

        urlRoot: '/',

        proxies: {
            '/project/': 'http://localhost:2999/project/'
        },

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['IE', 'Chrome', 'Firefox', 'Safari', 'Opera'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
