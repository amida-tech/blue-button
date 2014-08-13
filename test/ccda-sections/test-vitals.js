var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../../index');

describe('vitals parser', function () {
    var vitals = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Vitals.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        vitals = bb.parseString(xml, {
            component: 'ccda_vitals'
        }).data;
        done();
    });

    xit('full deep check', function (done) {
        expect(vitals).to.exist;
        //console.log(JSON.stringify(vitals, null, 10));
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Vitals.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedVitals = JSON.parse(json2Read);
        expect(vitals).to.deep.equal(expectedVitals);
        done();
    });

    it('spot check', function (done) {
        expect(vitals).to.exist;
        expect(vitals).to.have.length(6);

        expect(vitals[0]).exist;
        expect(vitals[0].vital.name).to.equal('Height');
        expect(vitals[0]).exist;
        expect(vitals[0].value).to.equal(177);
        expect(vitals[0].unit).to.equal('cm');
        expect(vitals[1]).exist;
        expect(vitals[1].vital.name).to.equal('Patient Body Weight - Measured');
        expect(vitals[1]).exist;
        expect(vitals[1].value).to.equal(86);
        expect(vitals[1].unit).to.equal('kg');
        done();
    });
});
