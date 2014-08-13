var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../../index');

describe('procedures parser', function () {
    var procedures = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Procedures.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        procedures = bb.parseString(xml, {
            component: 'ccda_procedures'
        }).data;
        done();
    });

    xit('full deep check', function (done) {
        expect(procedures).to.exist;
        //console.log(JSON.stringify(procedures, null, 10));
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Procedures.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedProcedures = JSON.parse(json2Read);
        expect(procedures).to.deep.equal(expectedProcedures);
        done();
    });
});
