var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');
var jsutil = require('../lib/jsutil');

describe('problems parser', function() {
    var problems = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/CCD_1_Problems.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, {component: 'ccda_problems'}, function(err, result) {
            problems = result.toJSON();
            jsutil.deepDelete(problems, '_id');
            //var json2Write = JSON.stringify(ccd, undefined, '\t');
            //var jsonFilePath = filepath.replace('.xml', '.json');
            //fs.writeFileSync(jsonFilePath, json2Write);
            done();
        });
    });
    
    xit('full deep check', function(done) {
        expect(problems).to.exist;
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/json/CCD_1_Problems.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedProblems = jsutil.jsonParseWithDate(json2Read);
        expect(problems).to.deep.equal(expectedProblems);
        done();
    });
    
    it ('spot check', function(done) {
        console.log(JSON.stringify(problems, null, 4));
        expect(problems).to.exist;
        expect(problems.problemConcerns).to.exist;
        expect(problems.problemConcerns).to.have.length(2);

        expect(problems.problemConcerns[1].concernStatus).to.equal('completed');
        expect(problems.problemConcerns[1].problems).to.exist;
        expect(problems.problemConcerns[1].problems).to.have.length(1);
        expect(problems.problemConcerns[1].problems[0].problemName).to.exist;
        expect(problems.problemConcerns[1].problems[0].problemName.label).to.equal('Asthma');
        expect(problems.problemConcerns[1].problems[0].dateRange).to.exist;
        expect(problems.problemConcerns[1].problems[0].dateRange.low).to.exist;
        expect(JSON.stringify(problems.problemConcerns[1].problems[0].dateRange.low)).to.equal('"2007-01-03T00:00:00.000Z"');
        expect(problems.problemConcerns[1].problems[0].dateRange.lowResolution).to.equal('day');
        
        done();
    });
});