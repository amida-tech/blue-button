var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');
var jsutil = require('../lib/jsutil');

describe('immunizations parser', function() {
    var immunizations = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/CCD_1_Immunizations.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, {component: 'ccda_immunizations'}, function(err, result) {
            immunizations = result.toJSON();
            jsutil.deepDelete(immunizations, '_id');
            //var json2Write = JSON.stringify(ccd, undefined, '\t');
            //var jsonFilePath = filepath.replace('.xml', '.json');
            //fs.writeFileSync(jsonFilePath, json2Write);
            done();
        });
    });
    
    it('full deep check', function(done) {
        expect(immunizations).to.exist;
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/json/CCD_1_Immunizations.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedImmunizations = jsutil.jsonParseWithDate(json2Read);
        expect(immunizations).to.deep.equal(expectedImmunizations);
        done();
    });
    
    it ('spot check', function(done) {
        expect(immunizations).to.exist;
        expect(immunizations.immunizationsGiven).to.exist;
        expect(immunizations.immunizationsGiven).to.have.length(2);
        
        expect(immunizations.immunizationsGiven[0].route).to.equal('Intramuscular injection');
        expect(immunizations.immunizationsGiven[0].productName).to.exist;
        expect(immunizations.immunizationsGiven[0].productName.code).to.equal('88');
        expect(immunizations.immunizationsGiven[0].productName.label).to.equal("Influenza virus vaccine");
        expect(JSON.stringify(immunizations.immunizationsGiven[0].date[0].date)).to.equal('"1999-11-01T00:00:00.000Z"');
        expect(immunizations.immunizationsGiven[0].date[0].precision).to.equal('month');
        
        done();
    });
});