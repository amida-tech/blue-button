var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../../index');

describe('encounters parser', function () {
    var encounters = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Encounters.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        encounters = bb.parseString(xml, {
            component: 'ccda_encounters'
        }).data;
        done();
    });

    xit('full deep check', function (done) {
        expect(encounters).to.exist;
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Encounters.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedEncounters = JSON.parse(json2Read);
        expect(encounters).to.deep.equal(expectedEncounters);
        done();
    });

    it('spot check', function (done) {
        expect(encounters).to.exist;
        expect(encounters).to.have.length(1);
        expect(encounters[0].date_time).to.exist;
        expect(JSON.stringify(encounters[0].date_time.point.date)).to.equal('"2009-02-27T13:00:00Z"');
        expect(encounters[0].encounter.code).to.equal('99213');
        done();
    });
});
