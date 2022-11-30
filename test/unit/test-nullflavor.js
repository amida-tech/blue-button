var fs = require('fs');

var bb = require('../../index.js');

describe('nullFlavor testing', function () {
  var xmlfile = null;

  beforeAll(function (done) {
    xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ccda/CCD_1_withNF.xml', 'utf-8').toString();
    done();
  });

  it('race and ethnicity', function (done) {
    expect(xmlfile).toBeDefined();

    //convert string into JSON 
    var result = bb.parse(xmlfile);
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

    //console.log("Demographics: \n", JSON.stringify(result.data.demographics, null, 4));

    expect(valid).toBe(true);

    done();
  });

});
