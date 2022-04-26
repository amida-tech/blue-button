var fs = require('fs');
var path = require('path');

var bb = require('../../index.js');

describe('parser.js', function () {
  var xmlfile = null;

  beforeAll(function (done) {
    xmlfile = fs.readFileSync(__dirname + '/../fixtures/parser-ncpdp/newrx.xml', 'utf-8').toString();
    done();
  });

  try {
    require.resolve("blue-button-ncpdp");
    it('NCPDP parser/model validation', function (done) {
      expect(xmlfile).toBeDefined();

      //convert string into JSON
      var result = bb.parse(xmlfile);
      expect(result).toBeDefined();

      //console.log(JSON.stringify(result.data.providers, null, 10));

      var valid = bb.validator.validateDocumentModel(result);

      //if validation failed print all validation errors and summary by category of error
      if (!valid) {
        console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
      }

      expect(valid).toBe(true);

      done();
    });
  } catch (ex) {}
});
