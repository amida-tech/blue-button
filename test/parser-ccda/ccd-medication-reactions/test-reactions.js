var fs = require('fs');
var bb = require('../../../index.js');

describe('Medication Reactions', function () {
  it('without', function () {
    var xmlfile = fs.readFileSync(__dirname + '/without.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);
    expect(result.data.medications[0].reactions).not.toBeDefined();
  });

  it('with', function () {
    var xmlfile = fs.readFileSync(__dirname + '/with.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);
    
    expect(result.data.medications[0].reactions).toBeDefined();
  });

  it('many', function () {
    var xmlfile = fs.readFileSync(__dirname + '/many.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);
    expect(result.data.medications[0].reactions.length).toBe(2);
  });
});
