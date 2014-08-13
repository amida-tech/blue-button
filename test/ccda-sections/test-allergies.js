var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../../index');

describe('allergies parser', function () {
    var allergies = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Allergies.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        allergies = bb.parseString(xml, {
            component: 'ccda_allergies'
        }).data;
        done();
    });

    xit('full deep check', function (done) {
        expect(allergies).to.exist;
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Allergies.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedAllergies = JSON.parse(json2Read);
        expect(allergies).to.deep.equal(expectedAllergies);
        done();
    });

    xit('spot check', function (done) {
        expect(allergies).to.exist;
        expect(allergies).to.have.length(3);

        expect(allergies[1].date_time).to.exist;

        expect(JSON.stringify(allergies[1].date_time.point.date)).to.equal('"2006-05-01T00:00:00Z"');

        expect(allergies[1].severity).to.equal('Moderate');
        expect(allergies[1].status).to.equal('Active');
        expect(allergies[1].allergen.name).to.equal('Codeine');

        done();
    });

    xit('epic permutation', function (done) {
        var filepath = path.join(__dirname, '../fixtures/file-snippets/Epic_Guess_Allergies.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parseString(xml, {
            component: 'ccda_allergies',
            sourceKey: 'epic'
        }, function (err, result) {
            if (err) {
                done(err);
            } else {
                var allergiesEpic = result.toJSON();
                var filepath = path.join(__dirname, '../fixtures/file-snippets/json/Epic_Guess_Allergies.json');
                var json2Read = fs.readFileSync(filepath, 'utf-8');
                var expectedAllergies = JSON.parse(json2Read);
                expect(allergiesEpic).to.deep.equal(expectedAllergies);
                done();
            }
        });
    });
});
