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
            jsutil.deepDelete(ccd, '_id');
            //var json2Write = JSON.stringify(ccd, undefined, '\t');
            //var jsonFilePath = filepath.replace('.xml', '.json');
            //fs.writeFileSync(jsonFilePath, json2Write);
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
        expect(ccd.demographics.name.family).to.equal('Jones');
        expect(ccd.demographics.name.givens).to.have.length(2);
        expect(ccd.demographics.name.givens).to.have.members(['Isabella', 'Isa']);
        
        expect(JSON.stringify(ccd.demographics.birthTime)).to.equal('"1975-05-01T00:00:00.000Z"');
        
        expect(ccd.demographics.telecoms).to.exists;
        expect(ccd.demographics.telecoms).to.have.length(1);
        expect(ccd.demographics.telecoms[0].value).to.equal('tel:(816)276-6909');
        expect(ccd.demographics.telecoms[0].use).to.equal('primary home');

        done();
    });

    it ('vitals spot check', function(done) {
        expect(ccd.vitals).to.exist;
        expect(ccd.vitals.panels).to.have.length(2);
        
        expect(ccd.vitals.panels[0].vitals).to.have.length(3);
        expect(ccd.vitals.panels[0].vitals[0].vitalName).exist;
        expect(ccd.vitals.panels[0].vitals[0].vitalName.label).to.equal('Height');
        expect(ccd.vitals.panels[0].vitals[0].physicalQuantity).exist;
        expect(ccd.vitals.panels[0].vitals[0].physicalQuantity.value).to.equal(177);
        expect(ccd.vitals.panels[0].vitals[0].physicalQuantity.unit).to.equal('cm');

        expect(ccd.vitals.panels[1].vitals).to.have.length(3);
        expect(ccd.vitals.panels[1].vitals[1].vitalName).exist;
        expect(ccd.vitals.panels[1].vitals[1].vitalName.label).to.equal('Patient Body Weight - Measured');
        expect(ccd.vitals.panels[1].vitals[1].physicalQuantity).exist;
        expect(ccd.vitals.panels[1].vitals[1].physicalQuantity.value).to.equal(88);
        expect(ccd.vitals.panels[1].vitals[1].physicalQuantity.unit).to.equal('kg');
        
        done();
    });
    
    it ('medications spot check', function(done) {
        expect(ccd.medications).to.exist;
        expect(ccd.medications.medicationsReported).to.exist;
        expect(ccd.medications.medicationsReported).to.have.length(1);
        
        expect(ccd.medications.medicationsReported[0].route).to.equal('RESPIRATORY (INHALATION)');
        expect(ccd.medications.medicationsReported[0].productName).to.exist;
        expect(ccd.medications.medicationsReported[0].productName.label).to.equal('Proventil HFA');
        expect(ccd.medications.medicationsReported[0].productName.code).to.equal('219483');

        expect(ccd.medications.medicationsReported[0].productName.code).to.equal('219483');

        expect(ccd.medications.medicationsReported[0].dosePeriod).to.exist;
        expect(ccd.medications.medicationsReported[0].dosePeriod.value).to.equal(6);
        expect(ccd.medications.medicationsReported[0].dosePeriod.unit).to.equal('h');

        done();
    });

    it ('problems spot check', function(done) {
        expect(ccd.problems).to.exist;
        expect(ccd.problems.problemConcerns).to.exist;
        expect(ccd.problems.problemConcerns).to.have.length(2);

        expect(ccd.problems.problemConcerns[1].concernStatus).to.equal('completed');
        expect(ccd.problems.problemConcerns[1].problems).to.exist;
        expect(ccd.problems.problemConcerns[1].problems).to.have.length(1);
        expect(ccd.problems.problemConcerns[1].problems[0].problemName).to.exist;
        expect(ccd.problems.problemConcerns[1].problems[0].problemName.label).to.equal('Asthma');
        expect(ccd.problems.problemConcerns[1].problems[0].dateRange).to.exist;
        expect(ccd.problems.problemConcerns[1].problems[0].dateRange.low).to.exist;
        expect(JSON.stringify(ccd.problems.problemConcerns[1].problems[0].dateRange.low)).to.equal('"2007-01-03T00:00:00.000Z"');
        expect(ccd.problems.problemConcerns[1].problems[0].dateRange.lowResolution).to.equal('day');
        
        done();
    });
    
    it ('immunizations spot check', function(done) {
        expect(ccd.immunizations).to.exist;
        expect(ccd.immunizations.immunizationsGiven).to.exist;
        expect(ccd.immunizations.immunizationsGiven).to.have.length(2);
        
        expect(ccd.immunizations.immunizationsGiven[0].route).to.equal('Intramuscular injection');
        expect(ccd.immunizations.immunizationsGiven[0].productName).to.exist;
        expect(ccd.immunizations.immunizationsGiven[0].productName.code).to.equal('88');
        expect(ccd.immunizations.immunizationsGiven[0].productName.label).to.equal("Influenza virus vaccine");
        expect(JSON.stringify(ccd.immunizations.immunizationsGiven[0].date.point)).to.equal('"1999-11-01T00:00:00.000Z"');
        expect(ccd.immunizations.immunizationsGiven[0].date.pointResolution).to.equal('month');
        
        done();
    });

    it ('results spot check', function(done) {
        expect(ccd.results).to.exist;
        expect(ccd.results.panels).to.have.length(1);
        
        expect(ccd.results.panels[0].panelName).to.exist;
        expect(ccd.results.panels[0].panelName.code).to.equal('43789009');
        expect(ccd.results.panels[0].panelName.label).to.equal("CBC WO DIFFERENTIAL");
        
        expect(ccd.results.panels[0].results).to.exist;
        expect(ccd.results.panels[0].results).to.have.length(3);
        
        expect(ccd.results.panels[0].results[2].resultName).to.exist;
        expect(ccd.results.panels[0].results[2].resultName.code).to.equal('26515-7');
        expect(ccd.results.panels[0].results[2].resultName.label).to.equal('PLT');
        
        done();
    });
    
});