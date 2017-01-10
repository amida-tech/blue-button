var expect = require('chai').expect;
var fs = require('fs');

var bb = require('../../index.js');

describe('reference resolution', function () {
    var xmlfile = null;

    before(function (done) {
        xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ccda/CCDA_ReferencedValuesSample_v1.xml', 'utf-8').toString();
        done();
    });

    it('resolves references', function (done) {
        expect(xmlfile).to.exist;

        //convert string into JSON
        var result = bb.parse(xmlfile);
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
