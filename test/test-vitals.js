var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');
var jsutil = require('../lib/jsutil');

describe('vitals parser', function() {
    var vitals = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/CCD_1_Vitals.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, {component: 'ccda_vitals'}, function(err, result) {
            vitals = result.toJSON();
            done();
        });
    });
    
    it('full deep check', function(done) {
        expect(vitals).to.exist;
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/json/CCD_1_Vitals.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedVitals = jsutil.jsonParseWithDate(json2Read);
        expect(vitals).to.deep.equal(expectedVitals);
        done();
    });
    
    it ('spot check', function(done) {
        expect(vitals).to.exist;
        expect(vitals.panels).to.have.length(2);
        
        expect(vitals.panels[0].vitals).to.have.length(3);
        expect(vitals.panels[0].vitals[0].vitalName).exist;
        expect(vitals.panels[0].vitals[0].vitalName.name).to.equal('Height');
        expect(vitals.panels[0].vitals[0].physicalQuantity).exist;
        expect(vitals.panels[0].vitals[0].physicalQuantity.value).to.equal(177);
        expect(vitals.panels[0].vitals[0].physicalQuantity.unit).to.equal('cm');

        expect(vitals.panels[1].vitals).to.have.length(3);
        expect(vitals.panels[1].vitals[1].vitalName).exist;
        expect(vitals.panels[1].vitals[1].vitalName.name).to.equal('Patient Body Weight - Measured');
        expect(vitals.panels[1].vitals[1].physicalQuantity).exist;
        expect(vitals.panels[1].vitals[1].physicalQuantity.value).to.equal(88);
        expect(vitals.panels[1].vitals[1].physicalQuantity.unit).to.equal('kg');
        
        done();
    });
});