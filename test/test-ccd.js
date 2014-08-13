"use strict";

var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;
var assert = chai.assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');

describe('full ccd parser', function () {
    var ccd = null;
    var ccd_obj = null;

    before(function (done) {
        var filepath = path.join(__dirname, 'fixtures/files/CCD_1.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        ccd = bb.parseString(xml, {}).data;
        ccd_obj = bb.parseString(xml, {});

        done();
    });

    xit('full deep check', function (done) {
        expect(ccd).to.exist;
        var filepath = path.join(__dirname, 'fixtures/files/json/CCD_1.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedCCD = JSON.parse(json2Read);
        expect(ccd).to.deep.equal(expectedCCD);
        done();
    });

    it('demographics spot check', function (done) {
        expect(ccd.demographics).to.exist;
        expect(ccd.demographics.name).to.exists;
        expect(ccd.demographics.name.last).to.equal('Jones');
        expect(ccd.demographics.name.first).to.equal('Isabella');
        expect(ccd.demographics.name.middle).to.have.members(['Isa']);

        expect(JSON.stringify(ccd.demographics.dob.point.date)).to.equal('"1975-05-01T00:00:00Z"');

        expect(ccd.demographics.phone).to.exists;
        expect(ccd.demographics.phone).to.have.length(1);
        expect(ccd.demographics.phone[0].number).to.equal('(816)276-6909');
        expect(ccd.demographics.phone[0].type).to.equal('primary home');

        done();
    });

    it('vitals spot check', function (done) {
        expect(ccd.vitals).to.exist;
        expect(ccd.vitals).to.have.length(6);

        expect(ccd.vitals[0].vital.name).exist;
        expect(ccd.vitals[0].vital.name).to.equal('Height');
        expect(ccd.vitals[0].value).to.equal(177);
        expect(ccd.vitals[0].unit).to.equal('cm');

        expect(ccd.vitals[1].vital.name).exist;
        expect(ccd.vitals[1].vital.name).to.equal('Patient Body Weight - Measured');
        expect(ccd.vitals[1].value).to.equal(86);
        expect(ccd.vitals[1].unit).to.equal('kg');

        done();
    });

    it('medications spot check', function (done) {
        expect(ccd.medications).to.exist;
        expect(ccd.medications).to.exist;
        expect(ccd.medications).to.have.length(1);

        expect(ccd.medications[0].administration.route.name).to.equal('RESPIRATORY (INHALATION)');
        expect(ccd.medications[0].product.product.name).to.exist;
        expect(ccd.medications[0].product.product.name).to.equal('Proventil HFA');
        expect(ccd.medications[0].product.product.code).to.equal('219483');

        //expect(ccd.medications.medicationsReported[0].productName.code).to.equal('219483');
        //expect(ccd.medications.medicationsReported[0].dosePeriod).to.exist;
        //expect(ccd.medications.medicationsReported[0].dosePeriod.value).to.equal(6);
        //expect(ccd.medications.medicationsReported[0].dosePeriod.unit).to.equal('h');

        done();
    });

    it('problems spot check', function (done) {

        expect(ccd.problems).to.exist;
        expect(ccd.problems).to.have.length(2);

        done();
    });

    it('immunizations spot check', function (done) {
        expect(ccd.immunizations).to.exist;
        expect(ccd.immunizations).to.exist;
        expect(ccd.immunizations).to.have.length(4);

        expect(ccd.immunizations[0].administration.route.name).to.equal('Intramuscular injection');
        expect(ccd.immunizations[0].product.product.name).to.exist;
        expect(ccd.immunizations[0].product.product.code).to.equal('88');
        expect(ccd.immunizations[0].product.product.name).to.equal("Influenza virus vaccine");
        expect(JSON.stringify(ccd.immunizations[0].date_time.point.date)).to.equal('"1999-11-01T00:00:00Z"');
        expect(ccd.immunizations[0].date_time.point.precision).to.equal('month');

        done();
    });

    it('results spot check', function (done) {
        expect(ccd.results).to.exist;
        expect(ccd.results).to.have.length(1);

        expect(ccd.results[0]).to.exist;
        expect(ccd.results[0].result_set.code).to.equal('43789009');
        expect(ccd.results[0].result_set.name).to.equal("CBC WO DIFFERENTIAL");

        expect(ccd.results[0].results[2]).to.exist;
        expect(ccd.results[0].results[2].result.code).to.equal('26515-7');
        expect(ccd.results[0].results[2].result.name).to.equal('PLT');

        done();
    });

    it('meta check', function (done) {
        expect(ccd_obj.meta.sections).to.exist;

        expect(ccd_obj.meta.identifiers).to.exist;
        expect(ccd_obj.meta.identifiers).to.have.length(1);
        expect(ccd_obj.meta.identifiers[0].identifier).to.equal("2.16.840.1.113883.19.5.99999.1");
        expect(ccd_obj.meta.identifiers[0].extension).to.equal("TT988");

        done();
    });

});
