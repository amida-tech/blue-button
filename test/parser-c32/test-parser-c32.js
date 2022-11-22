var fs = require('fs');
var bb = require('../../index.js');

describe('Parser C32 Support Testing', function () {
  var xmlfile = null;

  beforeAll(function (done) {
    xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-c32/VA_CCD_Sample_File_Version_12_5_1.xml', 'utf-8').toString();
    done();
  });

  it('C32 Demo File Check Sense', function (done) {

    var senseResult = bb.senseString(xmlfile);
    expect(senseResult.type).toBe('c32');

    var senseXml = bb.senseXml(senseResult.xml);
    expect(senseXml.type).toBe('c32');

    done();

  });

  it('C32 Demo File Check Sections', function (done) {

    var result = bb.parseString(xmlfile);

    //console.log(result.data.procedures);

    expect(result.data.demographics).toBeDefined();
    expect(result.data.allergies.length).toBe(10);
    expect(result.data.encounters.length).toBe(6);
    expect(result.data.immunizations.length).toBe(6);
    expect(result.data.vitals.length).toBe(2);
    expect(result.data.results.length).toBe(2);
    expect(result.data.problems.length).toBe(10);
    expect(result.data.procedures.length).toBe(4);

    done();

  });

  it('C32 parser/model validation', function (done) {
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
