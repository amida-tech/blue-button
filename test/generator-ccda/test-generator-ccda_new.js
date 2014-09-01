var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require("fs");
var bb = require('../../index.js');

describe('parse generate parse generate', function () {
    it('should still be same', function () {
        var data = fs.readFileSync("./sample.JSON").toString();

        //convert string into JSON 
        var result = JSON.parse(data);

        // write generated json
        //fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated.json", JSON.stringify(result, null, 4));

        // check validation
        //var val = bb.validator.validateDocumentModel(result);

        // generate ccda

        //console.log(result.demographics);
        var xml = bb.generateCCDA(result).toString();

        console.log(xml);
        // write ccda
        //fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated.xml", xml);

        // parse generated ccda
        //var result2 = bb.parseString(xml);
        // write the parsed json from the generated ccda
        //fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated_2.json", JSON.stringify(result2, null, 4));

        // re-generate
        //var xml2 = bb.generateCCDA(result2).toString();
        //fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated_2.xml", xml2);

        //delete result.errors;
        //delete result2.errors;

        //assert.deepEqual(result2, result);
    });
});
