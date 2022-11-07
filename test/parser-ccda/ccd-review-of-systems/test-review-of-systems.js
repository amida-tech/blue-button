var fs = require('fs');
var bb = require('../../../index.js');

describe('review of systems', function () {
  it('without', function () {
    var xmlfile = fs.readFileSync(__dirname + '/without.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);

    expect(result.data.review_of_systems).not.toBeDefined();
  });

  it('with', function () {
    var xmlfile = fs.readFileSync(__dirname + '/with.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);

    expect(result.data.review_of_systems).toBeDefined();
  });
});
