var expect = require('chai').expect;
var fs = require('fs');

var bb = require('../../index.js');

describe('new sections testing', function () {
    var xmlfile = null;

    before(function (done) {
        xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ccda/CCD_1_newsections.xml', 'utf-8').toString();
        done();
    });

    it('reason for referral & hospital discharge instructions', function (done) {
        expect(xmlfile).to.exist;

        //convert string into JSON 
        var result = bb.parse(xmlfile);
        expect(result).to.exist;

        //console.log(JSON.stringify(result.data.header, null, 4));
        //console.log(result.data.header);

        var valid = bb.validator.validateDocumentModel(result);

        //if validation failed print all validation errors
        if (!valid) {
            //console.log(JSON.stringify(result.data.header, null, 4));
            //console.log(JSON.stringify(result.data.demographics, null, 4));
            console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
        }

        //console.log("All: \n", JSON.stringify(result, null, 4));

        expect(valid).to.be.true;

        done();
    });

});
