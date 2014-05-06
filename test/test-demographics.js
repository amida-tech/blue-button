var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');
var jsutil = require('../lib/jsutil');

describe('demographics parser', function() {
    var demographics = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/CCD_1_Demographics.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, {component: 'ccda_demographics'}, function(err, result) {
            demographics = result.toJSON();
            jsutil.deepDelete(demographics, '_id');
            //var json2Write = JSON.stringify(ccd, undefined, '\t');
            //var jsonFilePath = filepath.replace('.xml', '.json');
            //fs.writeFileSync(jsonFilePath, json2Write);
            done();
        });
    });
    
    it('full deep check', function(done) {
        expect(demographics).to.exist;
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/json/CCD_1_Demographics.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedDemographics = jsutil.jsonParseWithDate(json2Read);
        expect(demographics).to.deep.equal(expectedDemographics);
        done();
    });
    
    it ('spot check', function(done) {
        expect(demographics.name).to.exists;
        expect(demographics.name.family).to.equal('Jones');
        expect(demographics.name.givens).to.have.length(2);
        expect(demographics.name.givens).to.have.members(['Isabella', 'Isa']);
        
        expect(JSON.stringify(demographics.birthTime)).to.equal('"1975-05-01T00:00:00.000Z"');
        
        expect(demographics.telecoms).to.exists;
        expect(demographics.telecoms).to.have.length(1);
        expect(demographics.telecoms[0].value).to.equal('tel:(816)276-6909');
        expect(demographics.telecoms[0].use).to.equal('primary home');

        done();
    });
});