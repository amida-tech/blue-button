var expect = require('chai').expect;
var fs = require('fs');

var bb = require('../../index.js');

describe('functional status section parser', function () {
    var xmlfile = null;

    before(function (done) {
        xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ccda/CCDA_Functional_Status_v1.xml', 'utf-8').toString();
        done();
    });

    it('validity', function (done) {
        expect(true);
        expect(xmlfile).to.exist;

        var result = bb.parse(xmlfile);
        expect(result).to.exist;

        // fs.writeFileSync(__dirname + '/functional.json', beautify(JSON.stringify(result)));

        var valid = bb.validator.validateDocumentModel(result);

        //if validation failed print all validation errors
        if (!valid) {
            console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
        }

        expect(valid).to.be.true;

        done();
    });

});
