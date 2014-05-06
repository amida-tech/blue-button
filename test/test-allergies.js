var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');
var jsutil = require('../lib/jsutil');

describe('allergies parser', function() {
    var allergies = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/CCD_1_Allergies.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, {component: 'ccda_allergies'}, function(err, result) {
            allergies = result.toJSON();
            jsutil.deepDelete(allergies, '_id');
            //var json2Write = JSON.stringify(allergies, undefined, '\t');
            //var jsonFilePath = filepath.replace('file-snippets', 'file-snippets/json');
            //jsonFilePath = jsonFilePath.replace('.xml', '.json');
            //fs.writeFileSync(jsonFilePath, json2Write);
            done();
        });
    });
    
    it('full deep check', function(done) {
        expect(allergies).to.exist;
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/json/CCD_1_Allergies.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedAllergies = jsutil.jsonParseWithDate(json2Read);
        expect(allergies).to.deep.equal(expectedAllergies);
        done();
    });
    
    it ('spot check', function(done) {
        expect(allergies).to.exist;
        expect(allergies).to.have.length(3);
        
        expect(allergies[1].dateRange).to.exist;
        expect(allergies[1].dateRange.point).to.exist;

        expect(JSON.stringify(allergies[1].dateRange.point)).to.equal('"2006-05-01T00:00:00.000Z"');

        expect(allergies[1].severity).to.equal('Moderate');
        expect(allergies[1].status).to.equal('Active');
        expect(allergies[1].label).to.equal('Codeine');
        
        done();
    });
});