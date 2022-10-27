var fs = require('fs');
var bb = require('../../../index.js');

describe('results', function () {
  it('without', function () {
    var xmlfile = fs.readFileSync(__dirname + '/without.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);
    

    expect(result.data.results[0].author).not.toBeDefined();
  });

  it('with', function () {
    var xmlfile = fs.readFileSync(__dirname + '/with.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);
    expect(result.data.results[0].author).toBeDefined();
  });

  it('exsisting', function () {
    var xmlfile = fs.readFileSync(__dirname + '/exsisting.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);

    expect(result.data.results[0].author).toBeDefined();
  });
});
