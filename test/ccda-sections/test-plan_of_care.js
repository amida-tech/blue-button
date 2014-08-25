var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require("fs");
var path = require('path');

var bb = require('../../index');

describe('plan of care parser', function () {
    var plan_of_care = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Plan_Of_Care.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        plan_of_care = bb.parseString(xml, {
            component: 'ccda_plan_of_care'
        }).data;
        var writeFilePath = path.join(__dirname, '../fixtures/file-snippets/generatedJSON/CCD_1_Plan_Of_Care.json');
        fs.writeFileSync(writeFilePath, JSON.stringify(plan_of_care, null, 4), 'utf-8');
        done();
    });

    it('full deep check', function (done) {
        expect(plan_of_care).to.exist;
        // console.log(JSON.stringify(plan_of_care, null, 10));
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Plan_Of_Care.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expected = JSON.parse(json2Read);
        expect(plan_of_care).to.deep.equal(expected);
        done();
    });

});
