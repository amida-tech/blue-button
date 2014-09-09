var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require("fs");
var path = require('path');
var mkdirp = require('mkdirp');
var bb = require('../../index.js');

describe('parse generate parse generate', function () {
    var generatedDir = null;

    before(function () {
        generatedDir = path.join(__dirname, "../fixtures/files/parse_gen_parse/generated");
        mkdirp.sync(generatedDir);
        expect(generatedDir).to.exist;
    });

    it('CCD_1 should still be same', function () {
        var data = fs.readFileSync("./test/fixtures/generator-ccda/CCD_1.xml").toString();

        //convert string into JSON 
        var result = bb.parseString(data);

        // write generated json
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated.json"), JSON.stringify(result, null, 4));

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bb.generateCCDA(result).toString();
        // write ccda
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_2.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bb.generateCCDA(result2).toString();
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_2.xml"), xml2);

        delete result.errors;
        delete result2.errors;

        assert.deepEqual(result2, result);
    });

    it('Vitera_CCDA_SMART_Sample.xml should still be same', function () {
        var data = fs.readFileSync("./test/fixtures/generator-ccda/Vitera_CCDA_SMART_Sample.xml").toString();

        //convert string into JSON 
        var result = bb.parseString(data);

        // write generated json
        fs.writeFileSync(path.join(generatedDir, "Vitera_CCDA_SMART_Sample_generated.json"), JSON.stringify(result, null, 4));

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bb.generateCCDA(result).toString();
        // write ccda
        fs.writeFileSync(path.join(generatedDir, "Vitera_CCDA_SMART_Sample_generated.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "Vitera_CCDA_SMART_Sample_generated_2.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bb.generateCCDA(result2).toString();
        fs.writeFileSync(path.join(generatedDir, "Vitera_CCDA_SMART_Sample_generated_2.xml"), xml2);

        delete result.errors;
        delete result2.errors;
        delete result.data.social_history;
        delete result2.data.social_history; // To be fixed.

        assert.deepEqual(result2.data, result.data);
    });

    it('cms_sample.xml should not crash', function () {
        var data = fs.readFileSync("./test/fixtures/generator-ccda/cms_sample.txt").toString();

        //convert string into JSON 
        var result = bb.parseText(data);

        // write generated json
        fs.writeFileSync(path.join(generatedDir, "cms_sample_generated.json"), JSON.stringify(result, null, 4));

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bb.generateCCDA(result).toString();
        // write ccda
        fs.writeFileSync(path.join(generatedDir, "cms_sample_generated.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "cms_sample_generated_2.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bb.generateCCDA(result2).toString();
        fs.writeFileSync(path.join(generatedDir, "cms_sample_generated_2.xml"), xml2);

        delete result.errors;
        delete result2.errors;

        //assert.deepEqual(result2.data, result.data);
    });
});
