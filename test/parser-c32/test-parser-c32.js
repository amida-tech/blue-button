var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var bb = require('../../index.js');

var JSONToFile = function (json, filename) {
    var filepath = path.join(__dirname, '../fixtures/generated');
    var p = path.join(filepath, filename);
    var content = JSON.stringify(json, null, 2);
    fs.writeFileSync(p, content);
};

describe('Parser C32 Support Testing', function () {
    var xmlfile = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/parser-c32/VA_CCD_Sample_File_Version_12_5_1.xml');
        xmlfile = fs.readFileSync(filepath, 'utf-8').toString();
        done();
    });

    it('C32 Demo File Check Sense', function (done) {

        var senseResult = bb.senseString(xmlfile);

        expect(senseResult.xml.errors.length).to.equal(0);

        var senseXml = bb.senseXml(senseResult.xml);
        expect(senseResult.type).to.equal('c32');
        expect(senseXml.type).to.equal('c32');

        done();

    });

    it('C32 Demo File Check Sections', function (done) {

        var result = bb.parseString(xmlfile);

        //console.log(result.data.procedures);

        expect(result.data.demographics).to.exist;
        expect(result.data.allergies.length).to.equal(10);
        expect(result.data.encounters.length).to.equal(6);
        expect(result.data.immunizations.length).to.equal(6);
        expect(result.data.vitals.length).to.equal(2);
        expect(result.data.results.length).to.equal(2);
        expect(result.data.problems.length).to.equal(10);
        expect(result.data.procedures.length).to.equal(4);

        done();

    });

    it('C32 parser/model validation', function (done) {
        expect(xmlfile).to.exist;

        var result = bb.parseString(xmlfile);
        //convert string into JSON 

        expect(result).to.exist;

        val = bb.validator.validateDocumentModel(result);

        var err = bb.validator.getLastError();

        //if validation failed print all validation errors and summary by category of error
        if (!err.valid) {

            var _ = require("underscore");

            function count(numbers) {
                return _.reduce(numbers, function (result, current) {
                    return result + 1;
                }, 0);
            }
            var result = _.chain(err.errors)
                .groupBy("code")
                .map(function (value, key) {
                    return {
                        code: key,
                        count: count(_.pluck(value, "code"))
                    }
                })
                .value();

            console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
            console.log("Errors summary: \n ", JSON.stringify(result, null, 4));
        } else {
            JSONToFile(result, "VA_CCD_Sample_File_Version_12_5_1.json");
        }

        expect(err.valid).to.equal(true);

        done();
    });

});
