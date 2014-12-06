var expect = require('chai').expect;
var fs = require('fs');
var bb = require('../../index.js');

describe('Parser C32 Support Testing', function () {
    var xmlfile = null;

    before(function (done) {
        xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-c32/VA_CCD_Sample_File_Version_12_5_1.xml', 'utf-8').toString();
        done();
    });

    it('C32 Demo File Check Sense', function (done) {

        var senseResult = bb.senseString(xmlfile);
        expect(senseResult.type).to.equal('c32');

        var senseXml = bb.senseXml(senseResult.xml);
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

        var result = bb.parse(xmlfile);
        //convert string into JSON 

        expect(result).to.exist;

        var valid = bb.validator.validateDocumentModel(result);

        //if validation failed print all validation errors
        if (!valid) {
            console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
        }

        expect(valid).to.be.true;

        done();
    });

});
