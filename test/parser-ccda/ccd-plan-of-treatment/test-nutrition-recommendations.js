var fs = require('fs');

var bb = require('../../../index.js');

describe('plan of treatment', function () {
  describe('nutrition recommendations', function () {
    it('no recommendations', function () {
      var xmlfile = fs.readFileSync(__dirname + '/no-nutrition-recommendations.xml', 'utf-8').toString();
      var result = bb.parse(xmlfile);

      expect(result.data.plan_of_treatment).not.toBeDefined();
    });

    it('one recommendation', function () {
      var xmlfile = fs.readFileSync(__dirname + '/one-nutrition-recommendation.xml', 'utf-8').toString();
      var result = bb.parse(xmlfile);

      expect(result.data.plan_of_treatment.nutrition_recommendations.length).toBe(1);

      var recommendation = result.data.plan_of_treatment.nutrition_recommendations[0];
      expect(recommendation.identifiers[0]).toEqual({"identifier": "9a6d1bac-17d3-4195-89a4-1121bc809a5c"});
      expect(recommendation.code).toEqual({
        "code": "61310001",
        "code_system_name": "SNOMED CT",
        "name": "nutrition education"
      });
      expect(recommendation.date_time).toEqual({
        "point": {
          "date": "2013-05-12T00:00:00.000Z", "precision": "day"
        }
      });
    });

    it('multiple recommendations', function () {
      var xmlfile = fs.readFileSync(__dirname + '/multiple-nutrition-recommendations.xml', 'utf-8').toString();
      var result = bb.parse(xmlfile);

      expect(result.data.plan_of_treatment.nutrition_recommendations.length).toBe(2);
    });
  });
});
