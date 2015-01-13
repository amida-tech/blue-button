"use strict";

var fs = require('fs');
var chai = require('chai');

var bbxml = require("blue-button-xml");
var shared = require('../../lib/parser/common/shared');

var expect = chai.expect;

describe('telecom unit tests', function () {
    var jsonCases = null;

    it('prepare', function () {
        var component = bbxml.component;

        var testCase = component.define("testCase");
        testCase.fields([
            ["phone", "0..*", shared.phone.xpath(), shared.phone],
            ["email", "0..*", shared.email.xpath(), shared.email]
        ]);

        var testCases = component.define("testCases");
        testCases.fields([
            ["multiple_tel_email", "1..1", "//h:case[@title='multiple_tel_email']", testCase],
            ["nullFlavor_noTel", "1..1", "//h:case[@title='nullFlavor_noTel']", testCase],
            ["emptyValue", "1..1", "//h:case[@title='emptyValue']", testCase]
        ]);

        var xmlfile = fs.readFileSync(__dirname + '/../fixtures/unit/telecom.xml', 'utf-8').toString();
        expect(xmlfile).to.exist;
        var result = testCases.run(xmlfile);
        expect(result).to.exist;
        jsonCases = result.toJSON();
        expect(jsonCases).to.exist;
    });

    it('multiple_tel_email', function () {
        expect(jsonCases.multiple_tel_email).to.deep.equal({
            phone: [{
                number: "(555)555-0001",
                type: "primary home"
            }, {
                number: "555-555-0002",
                type: "work place"
            }],
            email: [{
                address: "p0@amida-tech.com"
            }, {
                address: "p1@amida-tech.com"
            }]
        });
    });

    it('nullFlavor_noTel', function () {
        expect(jsonCases.nullFlavor_noTel).to.deep.equal({
            phone: [{
                number: "5555550003",
                type: "primary home"
            }]
        });
    });

    it('emptyValue', function () {
        expect(jsonCases).to.not.have.property("emptyValue");
    });
});
