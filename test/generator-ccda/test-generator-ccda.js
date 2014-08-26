var expect = require('chai').expect;
var assert = require('chai').assert;
//var lib = require('./test-lib.js');
var fs = require("fs");
var bb = require('../../index.js');
var bbm = require('blue-button-meta');

//var test = new lib.testXML();
//test.verbose = true; // log setting

// testing options/cases
var TEST_CCDA_SAMPLES = false;
var TEST_CCD = false;
var TEST_SECTIONS = false;
var TEST_PARSE_GENERATE = true;

var supportedComponents = {
    payers: 'payers',
    allergies: 'allergies',
    procedures: 'procedures',
    immunizations: 'immunizations',
    medications: 'medications',
    encounters: 'encounters',
    vitals: 'vitals',
    results: 'results',
    social_history: 'social_history',
    demographics: 'demographics',
    plan_of_care: 'plan_of_care',
    problems: 'problems'
};

// test parse->generate->parse->generate
if (TEST_PARSE_GENERATE) {
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
}
