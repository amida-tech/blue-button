var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../../index');

describe('medications parser', function () {
    var meds = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Medications.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        meds = bb.parseString(xml, {
            component: 'ccda_medications'
        }).data;
        done();
    });

    xit('full deep check', function (done) {
        expect(meds).to.exist;
        //console.log(JSON.stringify(meds, null, 10));
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Medications.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedMeds = JSON.parse(json2Read);
        expect(meds).to.deep.equal(expectedMeds);
        done();
    });

    it('spot check', function (done) {
        expect(meds).to.exist;
        expect(meds).to.have.length(1);
        //expect(meds[0].administration.route.name).to.equal('RESPIRATORY (INHALATION)');
        //expect(meds[0].product).to.exist;
        //expect(meds[0].product.product.name).to.equal('Proventil HFA');
        //expect(meds[0].product.product.code).to.equal('219483');
        //expect(meds.medicationsReported[0].productName.code).to.equal('219483');

        //expect(meds.medicationsReported[0].dosePeriod).to.exist;
        //expect(meds.medicationsReported[0].dosePeriod.value).to.equal(6);
        // expect(meds.medicationsReported[0].dosePeriod.unit).to.equal('h');

        done();
    });

    it('Check PIVL_TS Support', function (done) {
        expect(meds[0].administration.interval).to.exist;
        expect(meds[0].administration.interval.period).to.exist;
        expect(meds[0].administration.interval.period.value).to.equal(6);
        expect(meds[0].administration.interval.period.unit).to.equal("h");
        expect(meds[0].administration.interval.frequency).to.equal(true);
        done();
    });

});
