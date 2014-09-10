var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require("fs");
var bb = require('../../index.js');
var path = require('path');
var mkdirp = require('mkdirp');

describe('try skewed sample data from app.', function () {
    var generatedDir = null;

    before(function () {
        generatedDir = path.join(__dirname, "../fixtures/files/parse_gen_parse/generated");
        mkdirp.sync(generatedDir);
        expect(generatedDir).to.exist;
    });

    it('should still be same', function () {
        //var data = fs.readFileSync("./sample.JSON").toString();

        var data = fs.readFileSync(path.join(__dirname, 'sample.JSON'));

        //convert string into JSON 
        var result = JSON.parse(data);

        // write generated json
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_new.json"), JSON.stringify(result, null, 4));

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda

        //console.log(result.demographics);
        var xml = bb.generateCCDA(result).toString();

        // write ccda
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_new.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_2_new.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bb.generateCCDA(result2).toString();
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_2_new.xml"), xml2);

        delete result.errors;
        delete result2.errors;

        //assert.deepEqual(result2, result);
    });
});
