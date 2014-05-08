//Mocha+Chai tests here for Node.js modules
//Browser based tests later

var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var parse = require('../lib/parser').parse;


xdescribe('Parse Sample Record', function() {

	var sampleFile = '';

	before(function(done) {
		fs.readFile(process.cwd() + '/test/fixtures/files/CCD_1.xml', 'utf8', function(err, data) {
			if (err) {
				done(err);
			}
			sampleFile = data;
			done();
		});
	});

	it('Execute Function', function(done) {

		parse(sampleFile, function(err, results) {
			if (err) {done(err);}
			done();

		});



	});



});