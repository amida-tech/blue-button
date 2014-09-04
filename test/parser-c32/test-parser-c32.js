var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var bb = require('../../index.js');

describe('Parser C32 Support Testing', function () {
    var xmlfile = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/parser-c32/VA_CCD_Sample_File_Version_12_5_1.xml');
        xmlfile = fs.readFileSync(filepath, 'utf-8').toString();
        done();
    });

    it('C32 Allergies Demo File Check Sense', function (done) {

        var senseResult = bb.senseString(xmlfile);
        
        expect(senseResult.xml.errors.length).to.equal(0);

        var senseXml = bb.senseXml(senseResult.xml);
        expect(senseResult.type).to.equal('c32');

        done();

    });

    it('C32 Allergies Demo File Check Allergies', function (done) {

        var result = bb.parseString(xmlfile);

        expect(result.data.allergies.length).to.equal(10);

        console.log(JSON.stringify(result.data.allergies, null, 10));
        done();

    });

    xit('C32 parser/model validation', function (done) {
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
        }

        expect(err.valid).to.equal(true);

        done();
    });

});
