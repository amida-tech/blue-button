/*global module*/

var bb = require('./index');
var path = require('path');

var generateChangeDetectionFiles = function (grunt) {
    var srcs = [
        'test/fixtures/parser-c32/VA_CCD_Sample_File_Version_12_5_1.xml',
        'test/fixtures/parser-ccd/SampleCCDDocument.xml',
        'test/fixtures/parser-ccda/CCD_1.xml'
    ];
    var dest = 'test/fixtures/generated';

    srcs.forEach(function (src) {
        var content = grunt.file.read(src);
        var sensed = bb.senseString(content);
        var cms = sensed.type === 'cms';
        var result = cms ? bb.parseText(content) : bb.parseString(content);

        var baseName = path.basename(src, path.extname(src));
        var destName = baseName + '.json';
        var destPath = path.join(dest, destName);
        var destContent = JSON.stringify(result, undefined, 2);
        grunt.file.write(destPath, destContent);
    });
};

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['*.js', './lib/**/*.js', './test/**/*.js'],
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
            beautify: {
                src: ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js', 'test/*.js', 'test/**/*.js'],
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
                src: ['test/*.js', 'test/**/*.js']
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
        },
        browserify: {
            require: {
                src: ['<%=pkg.main%>'],
                dest: 'dist/<%=pkg.name%>.js',
                options: {
                    alias: [__dirname + "/index.js:<%=pkg.name%>"],
                    external: ["blue-button-xml", "blue-button-generate", "blue-button-cms"]
                }
            },
            tests: {
                src: ['test/**/*.js'],
                dest: 'dist/mocha_tests.js',
                options: {
                    external: ["blue-button-xml", "blue-button-generate", "blue-button-cms"],
                    transform: ['brfs']
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: '127.0.0.1'
                }
            }
        },
        'mocha_phantomjs': {
            all: {
                options: {
                    urls: [
                        'http://127.0.0.1:8000/dist/mocha_runner.html'
                    ]
                }
            }
        }
    });

    grunt.registerTask('browser-test', ['browserify:require', 'browserify:tests', 'connect:server', 'mocha_phantomjs']);
    grunt.registerTask('gen-change-detect', 'generates files to detect changes in generation', function () {
        generateChangeDetectionFiles(grunt);
    });

    // Default task.
    grunt.registerTask('default', ['beautify', 'jshint', 'mochaTest', 'browser-test', 'gen-change-detect']);
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

    //JS beautifier
    grunt.registerTask('beautify', ['jsbeautifier:beautify']);

};
