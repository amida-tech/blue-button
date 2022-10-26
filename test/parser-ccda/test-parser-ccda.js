var fs = require('fs');

var bb = require('../../index.js');

describe('parser.js', function () {

  it('CCDA parser/model validation', function (done) {
    var xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ccda/CCD_1.xml', 'utf-8').toString();
    expect(xmlfile).toBeDefined();

    //convert string into JSON
    var result = bb.parse(xmlfile);
    console.log(result.data.review_of_systems);
    expect(result).toBeDefined();

    //console.log(JSON.stringify(result.data.header, null, 4));
    //console.log(result.data.header);

    var valid = bb.validator.validateDocumentModel(result);

    //if validation failed print all validation errors
    if (!valid) {
      //console.log(JSON.stringify(result.data.header, null, 4));
      //console.log(JSON.stringify(result.data.demographics, null, 4));
      console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
    }

    expect(valid).toBe(true);

    done();
  });

  it('Parses medication performer phones into an Arrays', function (done) {
    var xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ccda/CCD_medication_performer_phones.xml', 'utf-8').toString();
    expect(xmlfile).toBeDefined();

    //convert string into JSON
    var result = bb.parse(xmlfile);
    expect(result).toBeDefined();

    var valid = bb.validator.validateDocumentModel(result);

    //if validation failed print all validation errors
    if (!valid) {
      //console.log(JSON.stringify(result.data.header, null, 4));
      //console.log(JSON.stringify(result.data.demographics, null, 4));
      console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
    }

    expect(valid).toBe(true);

    // Verify medication.performer.phone array
    expect(result.data.medications[0].performer.phone[0].number).toBe('+1(555)001-0001');
    expect(result.data.medications[0].performer.phone[1].number).toBe('+1(555)001-0002');

    // Verify medication.dispense.performer.phone array
    expect(result.data.medications[0].dispense.performer.phone[0].number).toBe('+1(555)002-0001');
    expect(result.data.medications[0].dispense.performer.phone[1].number).toBe('+1(555)002-0002');

    done();
  });

  it('Parses social history PQ value', function (done) {
    var xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ccda/CCD_SocialHistory_PQ_value.xml', 'utf-8').toString();
    expect(xmlfile).toBeDefined();

    //convert string into JSON
    var result = bb.parse(xmlfile);
    expect(result).toBeDefined();

    // social_history value was parsed
    expect(result.data.social_history[0].value).toBe('12');

    done();
  });
});
