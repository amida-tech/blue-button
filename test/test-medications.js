var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');
var jsutil = require('../lib/jsutil');

describe('medications parser', function() {
    var meds = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/CCD_1_Medications.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, {component: 'ccda_medications'}, function(err, result) {
            meds = result.toJSON();
            jsutil.deepDelete(meds, '_id');
            //var json2Write = JSON.stringify(ccd, undefined, '\t');
            //var jsonFilePath = filepath.replace('.xml', '.json');
            //fs.writeFileSync(jsonFilePath, json2Write);
            done();
        });
    });
    
    it('full deep check', function(done) {
        expect(meds).to.exist;
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/json/CCD_1_Medications.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedMeds = jsutil.jsonParseWithDate(json2Read);
        expect(meds).to.deep.equal(expectedMeds);
        done();
    });
    
    it ('spot check', function(done) {
        expect(meds).to.exist;
        expect(meds.medicationsReported).to.exist;
        expect(meds.medicationsReported).to.have.length(1);
        
        expect(meds.medicationsReported[0].route).to.equal('RESPIRATORY (INHALATION)');
        expect(meds.medicationsReported[0].productName).to.exist;
        expect(meds.medicationsReported[0].productName.label).to.equal('Proventil HFA');
        expect(meds.medicationsReported[0].productName.code).to.equal('219483');

        expect(meds.medicationsReported[0].productName.code).to.equal('219483');

        expect(meds.medicationsReported[0].dosePeriod).to.exist;
        expect(meds.medicationsReported[0].dosePeriod.value).to.equal(6);
        expect(meds.medicationsReported[0].dosePeriod.unit).to.equal('h');

        done();
    });
});