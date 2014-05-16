var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');
var jsutil = require('../lib/jsutil');

describe('results parser', function() {
    var results = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/CCD_1_Results.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, {component: 'ccda_results'}, function(err, result) {
            results = result.toJSON();
            done();
        });
    });
    
    it('full deep check', function(done) {
        expect(results).to.exist;
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/json/CCD_1_Results.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedResults = jsutil.jsonParseWithDate(json2Read);
        expect(results).to.deep.equal(expectedResults);
        done();
    });
    
    it ('spot check', function(done) {
        expect(results).to.exist;
        expect(results).to.have.length(1);
        
        expect(results[0]).to.exist;
        expect(results[0].code).to.equal('43789009');
        expect(results[0].name).to.equal("CBC WO DIFFERENTIAL");
        
        expect(results[0].results).to.exist;
        expect(results[0].results).to.have.length(3);
        
        expect(results[0].results[2]).to.exist;
        expect(results[0].results[2].code).to.equal('26515-7');
        expect(results[0].results[2].name).to.equal('PLT');
        
        done();
    });
});