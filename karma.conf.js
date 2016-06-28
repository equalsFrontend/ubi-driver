module.exports = function(config) {
    config.set({

        basePath: '',

        frameworks: ['jasmine'],

        //THIS MUST MATCH THE FILE LIST IN Gruntfile.js
        files: [
            //LIBRARIES MUST MATCH GRUNTTASKS CONFIGS
            "bower_components/angular/angular.min.js",
            "bower_components/angular-animate/angular-animate.min.js",
            "bower_components/angular-hotkeys/angular-hotkeys.min.js",
            "bower_components/angular-mocks/angular-mocks.js",
            "bower_components/angular-route/angular-route.min.js",
            "bower_components/angular-sanitize/angular-sanitize.min.js",
            "bower_components/angular-ui-router/release/angular-ui-router.min.js",
            "bower_components/angular-local-storage/dist/angular-local-storage.min.js",
            "bower_components/angular-load/angular-load.js",
            "bower_components/angular-base64/angular-base64.min.js",
            "bower_components/jquery/dist/jquery.min.js",
            "bower_components/highcharts/highcharts.js",
            "bower_components/highcharts-ng/dist/highcharts-ng.min.js",
            "bower_components/webcomponents.min.js",

            //SOURCE MUST MATCH GRUNTASKS CONFIG
            "client/*/*.js",
            "client/*/*/*.js",
            "client/*/*/*/*.js",
            "client/*/*/*/*/*.js",
            "client/*/*/*/*/*/*.js",

            {pattern: 'client/ubi/components/bing/bing.services.js', watched: false},

            //TEST SUITES
            "test/**/*Spec.js"
        ],

        exclude: [],

        preprocessors: {
            "client/*/*.js": ['coverage'],
            "client/*/*/*.js": ['coverage'],
            "client/*/!(*components)/*/*.js": ['coverage'], //we disable tests on the components section since there are too many dependency libraries to test
            "client/*/*/*/*/*.js": ['coverage'],
            "client/*/*/*/*/*/*.js": ['coverage']
        },

        reporters: ['coverage', 'junit', 'spec'],

        junitReporter: {
            outputDir: 'test/log', // results will be saved as $outputDir/$browserName.xml
            suite: ''
        },

        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-spec-reporter',
            'karma-junit-reporter',
            'karma-phantomjs-launcher'
        ],

        coverageReporter: {
            dir: 'test/coverage/',
            check: {
                global: {
                    statements: 0,
                    branches: 0,
                    functions: 0,
                    lines: 0
                },
                each: {
                    statements: 0,
                    branches: 0,
                    functions: 0,
                    lines: 0
                }
            }
        },

        port: 9876,

        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        autoWatch: false,

        browsers: ['PhantomJS'],
        //browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari'],

        singleRun: true
    });
};
