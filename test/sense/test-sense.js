var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require("fs");

var senseString = require("../../index.js").senseString;

describe('sense.js test', function () {
    var ccda = "";
    var xml = "";
    var json = "";
    var large_json = "";
    var text = "";
    var broken_xml = "";
    var va = {};

    before(function () {
        ccda = fs.readFileSync('./test/fixtures/sense/CCD.example.xml').toString();
        xml = fs.readFileSync('./test/fixtures/sense/empty.xml').toString();
        xml_no_declaration = fs.readFileSync('./test/fixtures/sense/empty_no_declaration.xml').toString();
        json = fs.readFileSync('./test/fixtures/sense/example.json').toString();
        large_json = fs.readFileSync('./test/fixtures/sense/large.json').toString();
        bb_json = fs.readFileSync('./test/fixtures/sense/blue-button.json').toString();
        text = fs.readFileSync('./test/fixtures/sense/example.txt').toString();
        format_x = fs.readFileSync('./test/fixtures/sense/format_x.txt').toString();
        cms = fs.readFileSync('./test/fixtures/sense/cms_sample.txt').toString();
        c32 = fs.readFileSync('./test/fixtures/sense/c32_sample.xml').toString();
        broken_xml = fs.readFileSync('./test/fixtures/sense/broken.xml').toString();
        pdf = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12_6.pdf').toString();

        var va_versions = ["12", "12_2", "12_2_1", "12_3", "12_4", "12_5", "12_5_1", "12_6"];
        for (var v in va_versions) {
            va[va_versions[v]] = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_' + va_versions[v] + '.txt').toString();
        };

    });

    it('should return NULL for no string with data passed', function () {
        assert.notStrictEqual(undefined, senseString(undefined));
        assert.notStrictEqual(undefined, senseString(null));
        assert.notStrictEqual(undefined, senseString(2013));
    });

    it('should return CCDA for proper CCDA/XML input', function () {
        assert.equal('ccda', senseString(ccda).type);
    });

    it('should return XML for proper basic XML input', function () {
        assert.equal('xml', senseString(xml).type);
    });

    it('should return XML for XML input (no <?xml declaration)', function () {
        assert.equal('xml', senseString(xml_no_declaration).type);
    });

    it('should return C32 for proper VA C32 XML input', function () {
        assert.equal('c32', senseString(c32).type);
    });

    it('should return BLUE-BUTTON.JS for proper BB JSON input', function () {
        assert.equal('blue-button.js', senseString(bb_json).type);
    });

    it('should return JSON for proper JSON input', function () {
        assert.equal('json', senseString(json).type);
        assert.equal('json', senseString(large_json).type);
    });

    it('should return CMS and version for CMS BB text input', function () {
        assert.equal('cms', senseString(cms).type);
        expect(senseString(cms).version).to.exist;
        assert.equal('2.0', senseString(cms).version);
    });

    it('should return VA and version for VA BB text input', function () {
        for (v in Object.keys(va)) {
            var key = Object.keys(va)[v];
            //console.log(key);
            var ver = key.split("_");
            if (ver.length === 1) {
                ver = ver[0];
            } else if (ver.length > 1) {
                ver = ver[0] + "." + ver[1];
            }
            //console.log(ver);
            //console.log(senseString(va[key]));
            assert.equal('va', senseString(va[key]).type);
            expect(senseString(va[key]).version).to.exist;
            assert.equal(ver, senseString(va[key]).version);
        }
    });

    it('should return PDF for PDF file input', function () {
        assert.equal('pdf', senseString(pdf).type);
    });

    it('should return FORMAT-X for format X text input', function () {
        assert.equal('format-x', senseString(format_x).type);
    });

    it('should return UNKNOWN for text input', function () {
        assert.equal('unknown', senseString(text).type);
    });

    it('should return UNKNOWN for broken XML input', function () {
        assert.equal('unknown', senseString(broken_xml).type);
    });

});
