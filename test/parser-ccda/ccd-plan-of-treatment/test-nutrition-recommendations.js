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

      console.log(result.data.plan_of_treatment);

      var recommendation = result.data.plan_of_treatment.nutrition_recommendations[0];
      expect(recommendation.identifiers[0]).toEqual({"identifier": "db734647-fc99-424c-a864-7e3cda82e703"});
      expect(recommendation.code).toEqual({"code": "ASSERTION", "code_system_name": "ActCode"});
      expect(recommendation.date_time).toEqual({"low": {"date": "2010-05-01T00:00:00.000Z", "precision": "day"}});
      expect(recommendation.value).toEqual({"code": "32398004", "code_system_name": "SNOMED CT", "name": "Bronchitis"});
    });

    it('multiple recommendations', function () {
      var xmlfile = fs.readFileSync(__dirname + '/multiple-nutrition-recommendations.xml', 'utf-8').toString();
      var result = bb.parse(xmlfile);

      expect(result.data.plan_of_treatment.nutrition_recommendations.length).toBe(2);
    });
  });
});
