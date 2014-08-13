var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../../index');

describe('socialHistory parser', function () {
    var socialHistory = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Social_History.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        socialHistory = bb.parseString(xml, {
            component: 'ccda_social_history'
        }).data;
        done();
    });

    xit('full deep check', function (done) {
        expect(socialHistory).to.exist;
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Social_History.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedSocialHistory = JSON.parse(json2Read);
        expect(socialHistory).to.deep.equal(expectedSocialHistory);
        done();
    });
});
