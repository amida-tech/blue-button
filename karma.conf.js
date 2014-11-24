// Karma configuration for unit tests

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            'angulartest/app/lib/angular/angular.js',
            'angulartest/app/lib/angular-route/angular-route.js',
            'angulartest/app/lib/angular-mocks/angular-mocks.js',
            'angulartest/app/lib/blue-button-xml/dist/blue-button-xml.js',
            'angulartest/app/lib/blue-button-generate/dist/blue-button-generate.js',
            'angulartest/app/lib/blue-button-cms/dist/blue-button-cms.js',
            'angulartest/app/lib/dist/blue-button.js',
            'angulartest/app/scripts/app.js',
            'angulartest/app/scripts/**/*.js',
            'angulartest/unit/**/*.js'
        ],

        // list of files to exclude
        exclude: [

        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Firefox'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
