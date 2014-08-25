/*global module*/

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Project configuration.
    grunt.initConfig({
        jshint: {
            files: ['*.js', './lib/*.js', './test/*.js'],
            options: {
                browser: true,
                smarttabs: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,
                boss: true,
                eqnull: true,
                node: true,
                expr: true,
                globals: {
                    'it': true,
                    'xit': true,
                    'describe': true,
                    'before': true,
                    'after': true,
                    'done': true
                }
            }
        },
        watch: {
            all: {
                files: ['./lib/*.js', '*.js', './test/*.js'],
                tasks: ['default']
            }
        },
        jsbeautifier: {
            beautify: { // ***** WARNING: please do not remove '!lib/generator/**/*.js' from src array.  *****
                // It will make generator files very unreadable and take many hours to undo
                src: ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js', 'test/*.js', 'test/**/*.js', '!lib/generator/**/*.js'],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            check: {
                src: ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js', 'test/*.js', 'test/**/*.js'],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: '10000',
                    recursive: true
                },
                src: ['test/*.js', 'test/**/*.js'],
                generator: ['test/test-generator.js']
            }
        },
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: 'coverage/lcov.info',

                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: false
            },
            //your_target: {
            // Target-specific LCOV coverage file
            //src: 'coverage-results/extra-results-*.info'
            //},
        },
        coverage: {
            options: {
                thresholds: {
                    'statements': 50,
                    'branches': 25,
                    'lines': 50,
                    'functions': 50
                },
                dir: 'coverage/',
                root: '.'
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['beautify', 'jshint', 'mochaTest']);
    //Express omitted for travis build.
    grunt.registerTask('commit', ['jshint', 'mochaTest']);
    grunt.registerTask('mocha', ['mochaTest']);
    grunt.registerTask('timestamp', function () {
        grunt.log.subhead(Date());
    });

    // Alias the `generator:ccda_samples` task to run `mocha test --recursive --grep generator` instead
    grunt.registerTask('generator:ccda_samples', 'mocha test --recursive --grep [ccda_samples]', function () {
        var done = this.async();
        require('child_process').exec('mocha test --recursive --grep ccda_samples', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });
    });

    // Alias the `generator:ccda_samples` task to run `mocha test --recursive --grep generator` instead
    grunt.registerTask('generator:ccda', 'mocha test --recursive --grep ccda', function () {
        var done = this.async();
        require('child_process').exec('mocha test --recursive --grep ccda', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });
    });

    // Alias the `generator:ccda_samples` task to run `mocha test --recursive --grep generator` instead
    grunt.registerTask('generator:sections', 'mocha test --recursive --grep sections', function () {
        var done = this.async();
        require('child_process').exec('mocha test --recursive --grep sections', function (err, stdout) {
            grunt.log.writeln(stdout);
            done(err);
        });
    });

    //JS beautifier
    grunt.registerTask('beautify', ['jsbeautifier:beautify']);

};
