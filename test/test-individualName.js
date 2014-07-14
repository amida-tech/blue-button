var chai = require('chai');
var fs = require('fs');
var path = require('path');

var xmlParser = require('../lib/xml');
var component = require('../lib/parser/ccda/component');
var shared = require('../lib/parser/ccda/shared');

var expect = chai.expect;
var assert = chai.assert;

var bb = require('../index');

describe('individualName functionality verification', function () {
    var parsedNames = null;

    it('parse example xml file', function (done) {
        //var filepath  = path.join(__dirname, 'fixtures/file-snippets/CCD_1_Allergies.xml');
        var filepath = path.join(__dirname, 'fixtures/file-snippets/individualNameTestCases.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        var doc = xmlParser.parse(xml);
        //var parser = require("../lib/parser/ccda/sections/allergies").allergiesSection;

        var entry = component.define('entry')
            .fields([
                ["name", "1..1", "h:name", shared.IndividualName]
            ]);

        var top = component.define('top')
            .templateRoot(['0.0.99'])
            .fields([
                ["entry", "0..*", "h:entry", entry]
            ]);

        var parser = component.define('parser')
            .fields([
                ['top', '1..1', top.xpath(), top]
            ]);

        var p = parser.instance();
        p.run(doc);
        p.cleanupTree();
        var result = p.toJSON();

        parsedNames = result && result.top && result.top.entry;

        expect(parsedNames).to.exist;
        expect(parsedNames).to.have.length(5);

        parsedNames = parsedNames.map(function (parsedName) {
            return parsedName.name;
        });

        done();
    });

    it('normal first middle last', function (done) {
        var name = parsedNames[0];
        expect(name.last).to.equal('DoeOne');
        expect(name.first).to.equal('JaneOne');
        expect(name.middle).to.exist;
        expect(name.middle).to.have.length(1);
        expect(name.middle[0]).to.equal('A');
        done();
    });

    it('normal first last', function (done) {
        var name = parsedNames[1];
        expect(name.last).to.equal('DoeTwo');
        expect(name.first).to.equal('JaneTwo');
        expect(name.middle).to.not.exist;
        done();
    });

    it('freetext first last', function (done) {
        var name = parsedNames[2];
        expect(name.last).to.equal('DoeThree');
        expect(name.first).to.equal('JaneThree');
        expect(name.middle).to.not.exist;
        done();
    });

    it('freetext first middle last', function (done) {
        var name = parsedNames[3];
        expect(name.last).to.equal('DoeFour');
        expect(name.first).to.equal('JaneFour');
        expect(name.middle).to.exist;
        expect(name.middle).to.have.length(1);
        expect(name.middle[0]).to.equal('B');
        done();
    });

    it('freetext last', function (done) {
        var name = parsedNames[4];
        expect(name.last).to.equal('DoeFive');
        expect(name.first).to.not.exist;
        expect(name.middle).to.not.exist;
        done();
    });
});
