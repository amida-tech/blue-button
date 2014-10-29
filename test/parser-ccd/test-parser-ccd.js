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

describe('Parser CDA R2 CCD Support Testing', function () {
    var xmlfile = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/parser-ccd/SampleCCDDocument.xml');
        xmlfile = fs.readFileSync(filepath, 'utf-8').toString();
        done();
    });

    it('CDA R2 CCD Demo File 1 Check Sense', function (done) {

        var senseResult = bb.senseString(xmlfile);

        expect(senseResult.xml.errors.length).to.equal(0);

        var senseXml = bb.senseXml(senseResult.xml);

        expect(senseResult.type).to.equal('cda');
        expect(senseXml.type).to.equal('cda');

        done();

    });

    it('CDA R2 CCD Demo File 1 Check Sections', function (done) {

        var result = bb.parseString(xmlfile);

        //console.log(JSON.stringify(result.data.providers, null, 10));

        expect(result.data.demographics).to.exist;
        expect(result.data.problems.length).to.equal(4);
        expect(result.data.encounters.length).to.equal(1);

        //Medication Activity Template Currently Unsupported, support 2.16.840.1.113883.10.20.1.34.
        //expect(result.data.medications.length).to.equal(69);
        expect(result.data.procedures.length).to.equal(1);
        expect(result.data.results.length).to.equal(2);
        expect(result.data.payers.length).to.equal(1);
        expect(result.data.providers.length).to.equal(1);
        done();

    });

    it('CCD 1 parser/model validation', function (done) {
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
            JSONToFile(result, "SampleCCDDocument.json");
        }

        expect(err.valid).to.equal(true);

        done();
    });

});
