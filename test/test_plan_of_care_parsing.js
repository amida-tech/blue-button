var expect = require('chai').expect;
var assert = require('chai').assert;
var lib = require('./test-lib.js');
var fs = require("fs");
var bb = require('../index');
var jsutil = require('../lib/jsutil');

describe('parse plan of care', function() {
	it('plan of care spot check', function (done) {
		var ccd = null;
		// read the plan_of_care xml
		var filepath = path.join(__dirname, 'fixtures/sections/plan_of_care.xml');
  	var xml = fs.readFileSync(filepath, 'utf-8');
  	ccdJSON = bb.parseString(xml, {}).data;
	
  	// read the plan_of_care JSON data model
  	var filepath = path.join(__dirname, 'fixtures/file-snippets/json/CCD_1_Plan_Of_Care.json');
  	var json2Read = fs.readFileSync(filepath, 'utf-8');
  	var expectedCCD = jsutil.jsonParseWithDate(json2Read);
  	expect(ccd).to.deep.equal();
  	
  	done();
  });

});