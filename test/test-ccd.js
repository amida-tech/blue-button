
var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;
var assert = chai.assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');
var jsutil = require('../lib/jsutil');

describe('full ccd parser', function() {
    var ccd = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/files/CCD_1.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, {}, function(err, result) {
            ccd = result.toJSON();
            //console.log(JSON.stringify(ccd, null, 10));
            done();
        });
    });
    
    it('full deep check', function(done) {
        expect(ccd).to.exist;
        var filepath  = path.join(__dirname, 'fixtures/files/json/CCD_1.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedCCD = jsutil.jsonParseWithDate(json2Read);
        expect(ccd).to.deep.equal(expectedCCD);
        done();
    });
    
    it ('demographics spot check', function(done) {
        expect(ccd.demographics).to.exist;
        
        expect(ccd.demographics.name).to.exists;
        expect(ccd.demographics.name.last).to.equal('Jones');
        expect(ccd.demographics.name.first).to.equal('Isabella');
        expect(ccd.demographics.name.middle).to.have.members(['Isa']);
        
        expect(JSON.stringify(ccd.demographics.dob[0].date)).to.equal('"1975-05-01T00:00:00.000Z"');
        
        expect(ccd.demographics.phone).to.exists;
        expect(ccd.demographics.phone).to.have.length(1);
        expect(ccd.demographics.phone[0].number).to.equal('(816)276-6909');
        expect(ccd.demographics.phone[0].type).to.equal('primary home');

        done();
    });

    it ('vitals spot check', function(done) {
        expect(ccd.vitals).to.exist;
        expect(ccd.vitals.panels).to.have.length(2);
        
        expect(ccd.vitals.panels[0].vitals).to.have.length(3);
        expect(ccd.vitals.panels[0].vitals[0].vitalName).exist;
        expect(ccd.vitals.panels[0].vitals[0].vitalName.name).to.equal('Height');
        expect(ccd.vitals.panels[0].vitals[0].physicalQuantity).exist;
        expect(ccd.vitals.panels[0].vitals[0].physicalQuantity.value).to.equal(177);
        expect(ccd.vitals.panels[0].vitals[0].physicalQuantity.unit).to.equal('cm');

        expect(ccd.vitals.panels[1].vitals).to.have.length(3);
        expect(ccd.vitals.panels[1].vitals[1].vitalName).exist;
        expect(ccd.vitals.panels[1].vitals[1].vitalName.name).to.equal('Patient Body Weight - Measured');
        expect(ccd.vitals.panels[1].vitals[1].physicalQuantity).exist;
        expect(ccd.vitals.panels[1].vitals[1].physicalQuantity.value).to.equal(88);
        expect(ccd.vitals.panels[1].vitals[1].physicalQuantity.unit).to.equal('kg');
        
        done();
    });
    
    it ('medications spot check', function(done) {
        expect(ccd.medications).to.exist;
        expect(ccd.medications.medicationsPrescribed).to.exist;
        expect(ccd.medications.medicationsPrescribed).to.have.length(1);
        
        expect(ccd.medications.medicationsPrescribed[0].route).to.equal('RESPIRATORY (INHALATION)');
        expect(ccd.medications.medicationsPrescribed[0].productName).to.exist;
        expect(ccd.medications.medicationsPrescribed[0].productName.name).to.equal('Proventil HFA');
        expect(ccd.medications.medicationsPrescribed[0].productName.code).to.equal('219483');

        //expect(ccd.medications.medicationsReported[0].productName.code).to.equal('219483');
        //expect(ccd.medications.medicationsReported[0].dosePeriod).to.exist;
        //expect(ccd.medications.medicationsReported[0].dosePeriod.value).to.equal(6);
        //expect(ccd.medications.medicationsReported[0].dosePeriod.unit).to.equal('h');

        done();
    });

    it ('problems spot check', function(done) {

        expect(ccd.problems).to.exist;
        expect(ccd.problems.problems).to.exist;
        expect(ccd.problems.problems).to.have.length(2);
        
        done();
    });
    
    it('immunizations spot check', function(done) {
        expect(ccd.immunizations).to.exist;
        expect(ccd.immunizations.immunizations).to.exist;
        expect(ccd.immunizations.immunizations).to.have.length(4);
        
        expect(ccd.immunizations.immunizations[0].administration.route.name).to.equal('Intramuscular injection');
        expect(ccd.immunizations.immunizations[0].product.name).to.exist;
        expect(ccd.immunizations.immunizations[0].product.code).to.equal('88');
        expect(ccd.immunizations.immunizations[0].product.name).to.equal("Influenza virus vaccine");
        expect(JSON.stringify(ccd.immunizations.immunizations[0].date[0].date)).to.equal('"1999-11-01T00:00:00.000Z"');
        expect(ccd.immunizations.immunizations[0].date[0].precision).to.equal('month');
        
        done();
    });

    it ('results spot check', function(done) {
        expect(ccd.results).to.exist;
        expect(ccd.results.panels).to.have.length(1);
        
        expect(ccd.results.panels[0].panelName).to.exist;
        expect(ccd.results.panels[0].panelName.code).to.equal('43789009');
        expect(ccd.results.panels[0].panelName.name).to.equal("CBC WO DIFFERENTIAL");
        
        expect(ccd.results.panels[0].results).to.exist;
        expect(ccd.results.panels[0].results).to.have.length(3);
        
        expect(ccd.results.panels[0].results[2].resultName).to.exist;
        expect(ccd.results.panels[0].results[2].resultName.code).to.equal('26515-7');
        expect(ccd.results.panels[0].results[2].resultName.name).to.equal('PLT');
        
        done();
    });
    
});