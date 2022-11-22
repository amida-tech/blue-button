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
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsbeautifier');
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
          'expect': true,
          'before': true,
          'after': true,
          'done': true
        }
      }
    },
    watch: {
      all: {
        files: ['./lib/**/*.js', '*.js', './test/**/*.js'],
        tasks: ['default']
      }
    },
    jsbeautifier: {
      beautify: {
        src: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      check: {
        src: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    run: {
      test: {
        exec: 'npx jest'
      },
      coverage: {
        exec: 'npx jest --coverage'
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '127.0.0.1'
        }
      }
    }
  });

  grunt.registerTask('gen-change-detect', 'generates files to detect changes in generation', function () {
    generateChangeDetectionFiles(grunt);
  });

  // Default task.
  grunt.registerTask('default', ['beautify', 'jshint', 'test']); //, 'browser-test', 'gen-change-detect']);
  //Express omitted for travis build.
  grunt.registerTask('commit', ['jshint', 'test']);
  grunt.registerTask('test', ['run:test']);
  grunt.registerTask('coverage', ['run:coverage']);
  grunt.registerTask('timestamp', function () {
    grunt.log.subhead(Date());
  });
  grunt.registerTask('coverage', ['run:coverage']);

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
