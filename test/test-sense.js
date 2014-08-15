var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require("fs");

var senseString = require("../lib/sense.js").senseString;

describe('sense.js test', function () {
    var ccda = "";
    var xml = "";
    var json = "";
    var large_json = "";
    var text = "";
    var broken_xml = "";

    before(function () {
        ccda = fs.readFileSync('./test/fixtures/sense/CCD.example.xml').toString();
        xml = fs.readFileSync('./test/fixtures/sense/empty.xml').toString();
        json = fs.readFileSync('./test/fixtures/sense/example.json').toString();
        large_json = fs.readFileSync('./test/fixtures/sense/large.json').toString();
        text = fs.readFileSync('./test/fixtures/sense/example.txt').toString();
        cms = fs.readFileSync('./test/fixtures/sense/cms_sample.txt').toString();
        broken_xml = fs.readFileSync('./test/fixtures/sense/broken.xml').toString();
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

    it('should return JSON for proper JSON input', function () {
        assert.equal('json', senseString(json).type);
        assert.equal('json', senseString(large_json).type);
    });

    it('should return CMS and version for CMS BB text input', function () {
        assert.equal('cms', senseString(cms).type);
        expect(senseString(cms).version).to.exist;
        assert.equal('2.0', senseString(cms).version);
    });

    it('should return UNKNOWN for text input', function () {
        assert.equal('unknown', senseString(text).type);
    });

    /* globals xit */
    xit('should return UNKNOWN for broken XML input', function () {
        assert.equal('unknown', sense(broken_xml));
    });

});
