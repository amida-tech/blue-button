var fs = require('fs');
var bb = require('../../index.js');

describe('Parser CDA R2 CCD Support Testing', function () {
  var xmlfile = null;

  beforeAll(function (done) {
    xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ccd/SampleCCDDocument.xml', 'utf-8').toString();
    done();
  });

  it('CDA R2 CCD Demo File 1 Check Sense', function (done) {

    var senseResult = bb.senseString(xmlfile);
    expect(senseResult.type).toBe('cda');

    var senseXml = bb.senseXml(senseResult.xml);
    expect(senseXml.type).toBe('cda');

    done();
  });

  it('CDA R2 CCD Demo File 1 Check Sections', function (done) {

    var result = bb.parseString(xmlfile);

    //console.log(JSON.stringify(result.data.providers, null, 10));

    expect(result.data.demographics).toBeDefined();
    expect(result.data.problems.length).toBe(4);
    expect(result.data.encounters.length).toBe(1);

    //Medication Activity Template Currently Unsupported, support 2.16.840.1.113883.10.20.1.34.
    //expect(result.data.medications.length).to.equal(69);
    expect(result.data.procedures.length).toBe(1);
    expect(result.data.results.length).toBe(2);
    expect(result.data.payers.length).toBe(1);
    expect(result.data.providers.length).toBe(1);
    done();

  });

  it('CCD 1 parser/model validation', function (done) {
    expect(xmlfile).toBeDefined();

    var result = bb.parse(xmlfile);
    //convert string into JSON 

    expect(result).toBeDefined();

    var valid = bb.validator.validateDocumentModel(result);

    //if validation failed print all validation errors
    if (!valid) {
      console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
    }

    expect(valid).toBe(true);

    done();
  });

});
