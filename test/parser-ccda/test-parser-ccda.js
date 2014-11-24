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

describe('parser.js', function () {
    var xmlfile = null;

    before(function (done) {
        xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ccda/CCD_1.xml', 'utf-8').toString();
        done();
    });

    it('CCDA parser/model validation', function (done) {
        expect(xmlfile).to.exist;

        //convert string into JSON 
        var result = bb.parseString(xmlfile);
        expect(result).to.exist;

        var valid = bb.validator.validateDocumentModel(result);

        //if validation failed print all validation errors
        if (!valid) {
            console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
        } else {
            JSONToFile(result, "CCD_1.xml.json");
        }

        expect(valid).to.be.true;

        done();
    });

});
