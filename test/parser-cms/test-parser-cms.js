var fs = require('fs');
var path = require('path');

var bb = require('../../index.js');

describe('parser.js', function () {
  var txtfile = null;

  beforeAll(function (done) {
    txtfile = fs.readFileSync(__dirname + '/../fixtures/parser-cms/sample.txt', 'utf-8').toString();
    done();
  });

  it('CMS parser/model validation', function (done) {
    expect(txtfile).toBeDefined();

    //convert string into JSON 
    var result = bb.parse(txtfile);
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

});
