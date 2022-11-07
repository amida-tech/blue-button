var fs = require('fs');

var bb = require('../../../index.js');

describe('nutrition', function () {
  it('one observation', function () {
    var xmlfile = fs.readFileSync(__dirname + '/one-nutrition-observation.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);

    expect(result.data.nutrition_observations.length).toBe(1);

    var observation = result.data.nutrition_observations[0];
    expect(observation.date_time).toEqual({"point": {"date": "2013-05-12T00:00:00.000Z", "precision": "day"}});
    expect(observation.value).toEqual("well nourished");
  });

  it('multiple observations', function () {
    var xmlfile = fs.readFileSync(__dirname + '/multiple-nutrition-observations.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);

    expect(result.data.nutrition_observations.length).toBe(2);
  });
});
