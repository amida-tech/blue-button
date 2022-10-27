var fs = require('fs');

var bb = require('../../../index.js');

describe('plan of treatment', function () {
  describe('indications', function () {
    it('no indications', function () {
      var xmlfile = fs.readFileSync(__dirname + '/no-indications.xml', 'utf-8').toString();
      var result = bb.parse(xmlfile);

      expect(result.data.plan_of_treatment).not.toBeDefined();
    });

    it('one indication', function () {
      var xmlfile = fs.readFileSync(__dirname + '/one-indication.xml', 'utf-8').toString();
      var result = bb.parse(xmlfile);

      expect(result.data.plan_of_treatment.indications.length).toBe(1);

      var indication = result.data.plan_of_treatment.indications[0];
      expect(indication.identifiers[0]).toEqual({"identifier": "db734647-fc99-424c-a864-7e3cda82e703"});
      expect(indication.code).toEqual({"code": "ASSERTION", "code_system_name": "ActCode"});
      expect(indication.date_time).toEqual({"low": {"date": "2010-05-01T00:00:00.000Z", "precision": "day"}});
      expect(indication.value).toEqual({"code": "32398004", "code_system_name": "SNOMED CT", "name": "Bronchitis"});
    });

    it('multiple indications', function () {
      var xmlfile = fs.readFileSync(__dirname + '/multiple-indications.xml', 'utf-8').toString();
      var result = bb.parse(xmlfile);

      expect(result.data.plan_of_treatment.indications.length).toBe(2);
    });
  });
});
