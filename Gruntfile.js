/*global module*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-istanbul-coverage');
  grunt.loadNpmTasks('grunt-coveralls');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      files: ['*.js', './lib/*.js', './test/*.js'],
      options: {
        browser: true,
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
        expr:true,
        globals: {
          'it': true,
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
    mochaTest: {
      test: {
        options: {
          //reporter: 'spec',
          timeout: '10000'
        },
        src: ['test/*.js']
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
  grunt.registerTask('default', ['jshint', 'mochaTest']);
  //Express omitted for travis build.
  grunt.registerTask('commit', ['jshint', 'mochaTest']);
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

};