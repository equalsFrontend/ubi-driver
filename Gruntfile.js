module.exports = function (grunt) {

    var tasksFile, tasks,
        bwrFile, bowerDeps,
        karmaDeps,
        client;

    tasksFile = grunt.file.readJSON('Grunttasks.json');
    bwrFile = grunt.file.readJSON('bower.json');
    client = grunt.file.readJSON('client.conf.json');
    theme = grunt.file.readJSON('themes/theme_' + client.name + '.json');

    tasks = tasksFile;

    //sets versioning regex pattern
    //we must do this here since a json file can't have regex
    tasks.replace["version"] = {
        "options": {
            "patterns": [
                {
                    "match": /_v(.*?)=*.(js|css)/g,
                    "replacement": "_v<%= pkg.version %>.$2"
                }
            ]
        },
        "files": [
            {
                "expand": true,
                "flatten": true,
                "src": ["index.html"],
                "dest": ""
            }
        ]
    };

    //DEPS MUST MATCH THE FILE LIST IN karma.conf.js
    karmaDeps = [

        //LIBRARIES MUST MATCH GRUNTTASKS CONFIGS
        "bower_components/angular/angular.min.js",
        "bower_components/angular-animate/angular-animate.min.js",
        "bower_components/angular-hotkeys/angular-hotkeys.min.js",
        "bower_components/angular-material/angular-material.min.js",
        "bower_components/angular-aria/angular-aria.min.js",
        "bower_components/angular-mocks/angular-mocks.js",
        "bower_components/angular-route/angular-route.min.js",
        "bower_components/angular-sanitize/angular-sanitize.min.js",
        "bower_components/angular-ui-router/release/angular-ui-router.min.js",
        "bower_components/angular-local-storage/dist/angular-local-storage.min.js",
        "bower_components/angular-load/angular-load.js",
        "bower_components/angular-base64/angular-base64.min.js",
        "bower_components/angular-hotkeys/build/hotkeys.min.js",
        "bower_components/angular-loading-bar/build/loading-bar.min.js",
        "bower_components/ng-dialog/js/ngDialog.min.js",
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/jquery-bootstrap-pagination/vendor/assets/javascripts/jquery-bootstrap-pagination.js",
        "bower_components/moment/moment.js",
        "bower_components/mobiscroll/js/mobiscroll.custom-2.17.0.min.js",
        "bower_components/devicejs/lib/device.min.js",
        "bower_components/bootstrap-daterangepicker/daterangepicker.js",
        "bower_components/highstock/js/highstock.src.js",
        "bower_components/highcharts-ng/dist/highcharts-ng.min.js",
        "js/mobiscroll/mobiscroll.min.js",

        //SOURCE MUST MATCH GRUNTASKS CONFIG
        "client/*/*.js",
        "client/*/*/*.js",
        "client/*/*/*/*.js",
        "client/*/*/*/*/*.js",
        "client/*/*/*/*/*/*.js",

        "test/**/*Spec.js"
    ];

    tasks["pkg"] = grunt.file.readJSON('package.json');

    tasks["karmaDeps"] = {
        'jsFilesForTesting': karmaDeps
    };

    tasks["json_generator"] = {
        target: {
            dest: "scss/theme_map.json",
            options: theme
        }
    };

    require('time-grunt')(grunt);

    grunt.initConfig(tasks);

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-json-generator');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-maven-deploy');
    grunt.loadNpmTasks('grunt-maven-tasks');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-typescript');


    //command: grunt
    //when: just checking if grunt setup is completing, will not complete if this file or grunttasks.json has errors
    grunt.registerTask('default', []);



    /*
         Task:       grunt dev:(watch|null):(test|null)
         Params:     watch [boolean] if set to watch, watch will be fired
                     test [boolean] if set to test, test will be fired
         When:       Working on JS, CSS or HTML in the project
         Produces:   Non-minifed js & css files containing all libs and app files
         Sources:    index.html will refer to non-minified versions
     */
    grunt.registerTask('dev', function(watch, test){
        grunt.task.run([
            'clean:dist',               //remvoves files from dist folder
            'replace:version',          //replaces the version value in index.html
            'typescript',               //generates js from ts wherever it's found in the client folder
            'concat',                   //concats all js in app-angular folder to make app file
            'clean:typescript',         //deletes temp .ts folder
            'json_generator',           //gets client file from root and generates theme from it
            'compass',                  //processes SASS into CSS
            'cssmin',                   //minifies all the CSS
            'replace:dev',              //removes the "min" suffixes from the library script tags to point to dev version
            ((watch && watch != "null") ? 'watch' : 'json_generator'),  //if watch is true starts watcher to update files on change
            ((test && test != "null") ? 'karma:development' : 'json_generator') //if test, run unit tests
        ]);
    });



    /*
         Task:       grunt build:(debug|null):(test|null)
         Params:     debug [boolean] if set to true, or provided, will set sources to non minified versions (accepts "debug")
                     test [boolean] if set to test, test will be fired (accepts "test")
         When:       We want to test the minified version of the project
         Produces:   Concated & Minified js & css files containing all libs and app files
         Sources:    index.html will refer to minified versions
     */
    grunt.registerTask('build', function(debug, test){
        grunt.task.run([
            'clean:dist',               //remvoves files from dist folder
            'replace:version',          //replaces the version value in index.html
            'typescript',               //generates js from ts wherever it's found in the client folder
            'concat',                   //concats all js in app-angular folder to make app file
            'json_generator',           //gets client file from root and generates theme from it
            'clean:typescript',         //deletes temp .ts folder
            'compass',                  //processes SASS into CSS
            'cssmin',                   //minifies all the CSS
            'uglify',
            'replace:' + ((debug && debug == "debug") ? "dev" : "dist"),         //if debug set to false, replaces .js and .css to min.js and min.css
            ((test && test == "test") ? 'karma:development' : 'json_generator') //if test, run unit tests
        ]);
    });



    /*
     Task:       grunt test
     When:       We want to run our unit tests
     Produces:   Unit testing report and code coverage
     */
    grunt.registerTask('doc', [
        'concat',
        'karma:development'
    ]);



    /*
         Task:       grunt doc
         When:       We want to test and then generate the documentation for the app
         Produces:   doc folder with documentation
     */
    grunt.registerTask('doc', [
        'concat',
        'karma:development',
        'jsdoc'
    ]);



    /*
         Task:       grunt deploy-snapshot
         When:       We want to send the project to nexus for future deployment that sources debug version
         Produces:   Zips and deploys debug and prod versions of project to nexus
         Sources:    index.html will refer to debug versions
     */
    grunt.registerTask('deploy-snapshot', [
        'maven_deploy:snapshot'
    ]);



    /*
         Task:       grunt deploy-release
         When:       We want to send the project to nexus for future deployment that sources prod version
         Produces:   Zips and deploys debug and prod versions of project to nexus
         Sources:    index.html will refer to minified versions
     */
    grunt.registerTask('deploy-release', [
        'maven_deploy:release'
    ]);



    /*
         Task:       grunt build-deploy:(snapshot|release):(debug|null):(test|null)
         Params:     debug [boolean] if set to true, will build a debug version (accepts "debug")
                     test (test|null) if set to test, tests will run before snapshot is made (only accepts "test")
                     type (snapshot|release) selects the type of deployment (accepts "snapshot" or "release")
         When:       We want to build and send the project to nexus for future deployment into an environment
         Produces:   Zips and deploys debug and prod versions of project to nexus
         Sources:    index.html will refer to min if debug is true
     */
    grunt.registerTask('build-deploy', function(type, debug, test){
        grunt.task.run([
            'build' + ((debug && debug == "debug") ? ":debug" : "") + ((test && test == "test") ? ":test" : ""),
            'maven_deploy:' + type
        ]);
    });

};