var fs = require('fs');

var bb = require('../../../index.js');

describe('plan of treatment', function () {
  it('does not exist', function () {
    var xmlfile = fs.readFileSync(__dirname + '/no-plan-of-treatment.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);

    expect(result.data.plan_of_treatment).not.toBeDefined();
  });
});
