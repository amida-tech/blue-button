var fs = require('fs');
var bb = require('../../../index.js');

describe('reaction observation', function () {
  it('no reaction', function () {
    var xmlfile = fs.readFileSync(__dirname + '/no-reaction.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);

    expect(result.data.immunizations[0].reaction).not.toBeDefined();
  });

  it('one reaction', function () {
    var xmlfile = fs.readFileSync(__dirname + '/one-reaction.xml', 'utf-8').toString();
    var result = bb.parse(xmlfile);

    expect(result.data.immunizations[0].reaction).toBeDefined();

    var reaction = result.data.immunizations[0].reaction;
    expect(reaction.identifiers[0]).toEqual({"identifier": "4adc1020-7b14-11db-9fe1-0800200c9a64"});
    expect(reaction.date_time).toEqual({
      "low": {"date": "2008-02-26T16:05:00.000Z", "precision": "minute"},
      "high": {"date": "2008-02-28T20:05:00.000Z", "precision": "minute"}
    });
    expect(reaction.reaction).toEqual({
      "code": "422587007",
      "code_system_name": "SNOMED CT",
      "name": "Nausea"
    });
    expect(reaction.free_text_reaction).toBeUndefined();
    expect(reaction.severity).toEqual({
      "code": {
        "code": "371924009",
        "code_system_name": "SNOMED CT",
        "name": "Moderate to severe"
      }
    });
  });
});
