"use strict";

var fs = require('fs');

var bbxml = require("@amida-tech/blue-button-xml");
var shared = require('../../lib/parser/common/shared');

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
    expect(xmlfile).toBeDefined();
    var result = testCases.run(xmlfile);
    expect(result).toBeDefined();
    jsonCases = result.toJSON();
    expect(jsonCases).toBeDefined();
  });

  it('multiple_tel_email', function () {
    expect(jsonCases.multiple_tel_email).toEqual({
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
    expect(jsonCases.nullFlavor_noTel).toEqual({
      phone: [{
        number: "5555550003",
        type: "primary home"
      }]
    });
  });

  it('emptyValue', function () {
    expect(jsonCases).not.toHaveProperty("emptyValue");
  });
});
