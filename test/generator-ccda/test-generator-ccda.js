var expect = require('chai').expect;
var assert = require('chai').assert;
//var lib = require('./test-lib.js');
var fs = require("fs");
var bb = require('../../index.js');
var bbm = require('blue-button-meta');

describe('parse generate parse generate', function () {
    it('should still be same', function () {
        var data = fs.readFileSync("./test/fixtures/generator-ccda/CCD_1.xml").toString();

        //convert string into JSON 
        var result = bb.parseString(data);
        // console.log(JSON.stringify(result, null, 4));

        for (var section in result.meta.sections) {
            // console.log(result.meta.sections[section], " ", result.data[result.meta.sections[section]].length);
        }

        // write generated json
        fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated.json", JSON.stringify(result, null, 4));

        // check validation
        var val = bb.validator.validateDocumentModel(result);
        // console.log("validation result: ", val);
        // console.log(JSON.stringify(bb.validator.getLastError(), null, 4));

        // generate ccda
        var xml = bb.generateCCDA(result).toString();
        // write ccda
        fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated.xml", xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        // write the parsed json from the generated ccda
        fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated_2.json", JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bb.generateCCDA(result2).toString();
        fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated_2.xml", xml2);

        assert.deepEqual(result2, result);
    });
});
