var chai = require('chai');
var fs = require('fs');
var path = require('path');

var xmlParser = require('../lib/xml');
var component = require('../lib/parser/ccda/component');
var shared = require('../lib/parser/ccda/shared');

var expect = chai.expect;
var assert = chai.assert;

var bb = require('../index');

describe('verification oids', function () {
    var parsedValues = null;

    it('parse example xml file', function (done) {
        var filepath = path.join(__dirname, 'fixtures/file-snippets/oidTestCases.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        var doc = xmlParser.parse(xml);

        var allergenUNII = component.define('allergenUNII')
            .fields([
                ["code", "1..1", "h:code", shared.ConceptDescriptor]
            ]);

        var roleCode = component.define('roleCode')
            .fields([
                ["code", "1..1", "h:code", shared.ConceptDescriptor]
            ]);

        var top = component.define('top')
            .templateRoot(['0.0.99'])
            .fields([
                ["allergenUNII", "1..1", "h:allergenUNII", allergenUNII],
                ["roleCode", "1..1", "h:roleCode", roleCode]
            ]);

        var parser = component.define('parser')
            .fields([
                ['top', '1..1', top.xpath(), top]
            ]);

        var p = parser.instance();
        p.run(doc);
        p.cleanupTree();
        var result = p.toJSON();

        expect(result).to.exist;
        expect(result.top).to.exist;
        parsedValues = result.top;

        done();
    });

    it('allergen UNII code', function (done) {
        expect(parsedValues.allergenUNII).to.exist;
        expect(parsedValues.allergenUNII.code.name).to.equal('Eggs');
        expect(parsedValues.allergenUNII.code.code).to.equal("291P45F896");
        expect(parsedValues.allergenUNII.code.code_system_name).to.equal("UNII");
        done();
    });

    it('payor HL7 RoleCode', function (done) {
        expect(parsedValues.roleCode).to.exist;
        expect(parsedValues.roleCode.code.code).to.equal("PAYOR");
        expect(parsedValues.roleCode.code.code_system_name).to.equal("HL7 RoleCode");
        done();
    });

});
