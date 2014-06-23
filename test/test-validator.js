var fs = require('fs');
var expect = require('chai').expect;
var path = require('path');
var ZSchema = require("z-schema");

describe('Test Addresses', function () {
  before(function(done) {
    shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    addressSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_address' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    compiledSchema = validator.compileSchema(addressSchema);
    testAddressList = fs.readFileSync(__dirname + '/fixtures/validator/samples/testAddress.json', 'utf8');
    testAddressList = JSON.parse(testAddressList);
    done();
  });
  it('regular address from CCD_1', function(done) {
    var regAddr = testAddressList.regular;
    valid = validator.validate(regAddr, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('no address lines', function(done) {
    var missingAddr = testAddressList.missingAddr;
    valid = validator.validate(missingAddr, compiledSchema);
    expect(valid).to.false;
    done();
  });


  it('no city', function(done) {
    var noCity = testAddressList.noCity;
    valid = validator.validate(noCity, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it('empty', function(done) {
    var empty = testAddressList.empty;
    valid = validator.validate(empty, compiledSchema);
    expect(valid).to.false;
    done();
  });

   it('only city and address', function(done) {
    var onlyCityAddr = testAddressList.onlyCityAddr;
    valid = validator.validate(onlyCityAddr, compiledSchema);
    expect(valid).to.true;
    done();
  });
});



describe('Test dates', function () {
  before(function(done) {
    shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    dateSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_date' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    compiledSchema = validator.compileSchema(dateSchema);
    done();
  });

  it('date without precision', function(done) {
    dateObj = {'date': '1975-05-01T00:00:00.000Z'};
    var valid = validator.validate(dateObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('empty date obj', function(done) {
      dateObj = {};
      var valid = validator.validate(dateObj, compiledSchema);
      expect(valid).to.false;
      done();
    });

   it('bad timedate format obj', function(done) {
      dateObj = {'date': '03/23/1992'};
      var valid = validator.validate(dateObj, compiledSchema);
      expect(valid).to.false;
      done();
    });
    it('Precision no time date', function(done) {
      dateObj = {'precision': 'day'};
      var valid = validator.validate(dateObj, compiledSchema);
      expect(valid).to.false;
      done();
    });
});

describe('Test phone:', function () {
  before(function(done) {
    shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    phoneSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_phone' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    compiledSchema = validator.compileSchema(phoneSchema);
    done();
  });

  it('phone without type', function(done) {
    phoneObj = {"number":"703-354-6290"};
    var valid = validator.validate(phoneObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

   it('phone with only type', function(done) {
    phoneObj = {"type":"primary home"};
    var valid = validator.validate(phoneObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

   it('empty phone obj', function(done) {
    phoneObj = {};
    var valid = validator.validate(phoneObj, compiledSchema);
    expect(valid).to.false;
    done();
  });
});

describe('Test phone:', function () {
  before(function(done) {
    shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    phoneSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_phone' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    compiledSchema = validator.compileSchema(phoneSchema);
    done();
  });

  it('phone without type', function(done) {
    phoneObj = {"number":"703-354-6290"};
    var valid = validator.validate(phoneObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

   it('phone with only type', function(done) {
    phoneObj = {"type":"primary home"};
    var valid = validator.validate(phoneObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

   it('empty phone obj', function(done) {
    phoneObj = {};
    var valid = validator.validate(phoneObj, compiledSchema);
    expect(valid).to.false;
    done();
  });
});

describe('Test email:', function () {
  before(function(done) {
    shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    emailSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_email' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    compiledSchema = validator.compileSchema(emailSchema);
    done();
  });

  it('email without type', function(done) {
    emailObj = {"email":"amida@mountain.com"};
    var valid = validator.validate(emailObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

   it('email with only type', function(done) {
    emailObj = {"type":"primary home"};
    var valid = validator.validate(emailObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

   it('empty email obj', function(done) {
    emailObj = {};
    var valid = validator.validate(emailObj, compiledSchema);
    expect(valid).to.false;
    done();
  });
});

describe('Test identifier:', function () {
  before(function(done) {
    shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    idenSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_id' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    compiledSchema = validator.compileSchema(idenSchema);
    done();
  });

  it('identifier all fields', function(done) {
    identifierObj =  {"identifier": "2.16.840.1.113883.19.5.9999.456",
      "identifier_type": "2981824"};

    var valid = validator.validate(identifierObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('identifier without type', function(done) {
    identifierObj = {"identifier": "2.16.840.1.113883.19.5.9999.456"};
          var valid = validator.validate(identifierObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

   it('email with only type', function(done) {
    identifierObj = {"identifier_type": "2981824"};
    var valid = validator.validate(identifierObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

   it('empty email obj', function(done) {
    identifierObj = {};
    var valid = validator.validate(identifierObj, compiledSchema);
    expect(valid).to.false;
    done();
  });
});

describe('Test name:', function () {
    before(function(done) {
    shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    nameSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_name' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    compiledSchema = validator.compileSchema(nameSchema);
    done();
  });

  it('regular name', function(done) {
    var nameObj = {
            "middle": [
                "Isa"
            ],
            "last": "Jones",
            "first": "Isabella"
            };
    var valid = validator.validate(nameObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('no middle name', function(done) {
    var nameObj = {
            "middle": [
            ],
            "last": "Jones",
            "first": "Isabella"
            };
          var valid = validator.validate(nameObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

   it('multiple middle names', function(done) {
    var nameObj = {
            "middle": [
                "Isa",
                "Izzzy",
                "Iggy"
            ],
            "last": "Jones",
            "first": "Isabella"
            };
    var valid = validator.validate(nameObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

   it('empty name obj', function(done) {
    var nameObj = {};
    var valid = validator.validate(nameObj, compiledSchema);
    expect(valid).to.false;
    done();
  });
});

describe('Test coded entries:', function () {
    before(function(done) {
    shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    codedEntrySchema = { '$ref': 'http://local.com/commonModels#/properties/cda_coded_entry' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    compiledSchema = validator.compileSchema(codedEntrySchema);
    done();
  });

  it('empty coded entry', function(done) {
    codedEntryObj = {};
    var valid = validator.validate(codedEntryObj, compiledSchema);
    expect(valid).to.false;
    done();
  });


  it('coded entry with undefined property', function(done) {
    codedEntryObj = {"kode":"1198000"};
    var valid = validator.validate(codedEntryObj, compiledSchema);
    expect(valid).to.false;
    done();
  });


  it('regular coded entry', function(done) {
    codedEntryObj = { "name": "Wheezing", "code": "56018004",
      "code_system_name": "SNOMED CT"};
    var valid = validator.validate(codedEntryObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('coded entry with only the code ', function(done) {
    codedEntryObj = {"code": "56018004",
      "code_system_name": "SNOMED CT"};
    var valid = validator.validate(codedEntryObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

    it('coded entry with a translation ', function(done) {
    codedEntryObj = { "name": "Influenza virus vaccine", "code": "88", "code_system_name": "CVX",
      "translations": [{"name": "Influenza, seasonal, injectable", "code": "141",
       "code_system_name": "CVX"}]};
    var valid = validator.validate(codedEntryObj, compiledSchema);
    expect(valid).to.true;
    done();
  });
    it('translation is empty ', function(done) {
    codedEntryObj = { "name": "Influenza virus vaccine", "code": "88", "code_system_name": "CVX",
      "translations": []};
    var valid = validator.validate(codedEntryObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

    it('translation has only one entry ', function(done) {
    codedEntryObj = { "name": "Influenza virus vaccine", "code": "88", "code_system_name": "CVX",
      "translations": [{"name": "Influenza, seasonal"}]};
    var valid = validator.validate(codedEntryObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

});

describe('Test physical quantities:', function () {
    before(function(done) {
      shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
      ZSchema.setRemoteReference('http://local.com/commonModels', shared);
      physQuanSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_physical_quantity' };
      validator = new ZSchema({ sync: true, noExtraKeywords:true});
      compiledSchema = validator.compileSchema(physQuanSchema);
      done();
  });

  it('empty physical quanity', function(done) {
    physObj= {};
    var valid = validator.validate(physObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it('physical quanity value is string', function(done) {
    physObj= {'unit': 'mmHg', 'value':'l337'};
    var valid = validator.validate(physObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

    it('correct physical quanitty', function(done) {
       physObj= {'unit': 'mmHg', 'value': 1337 };
    var valid = validator.validate(physObj, compiledSchema);
    expect(valid).to.true;
    done();
    });
});

describe('Test location:', function () {
    before(function(done) {
      shared= fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
      ZSchema.setRemoteReference('http://local.com/commonModels', shared);
      locationSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_location' };
      testLocList = fs.readFileSync(__dirname + '/fixtures/validator/samples/testLocations.json', 'utf8');
      testLocList = JSON.parse(testLocList);
      validator = new ZSchema({ sync: true, noExtraKeywords:true});
      compiledSchema = validator.compileSchema(locationSchema);
      done();
  });

  it('empty location', function(done) {
    locationObj= {};
    var valid = validator.validate(locationObj, compiledSchema);
    expect(valid).to.false;
    done();
  });


  it('regular location # 1 ', function(done) {
    locationObj= testLocList.regular1;
    var valid = validator.validate(locationObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('regular location # 2 ', function(done) {
    locationObj= testLocList.regular2;
    var valid = validator.validate(locationObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('location type empty', function(done) {
    locationObj= testLocList.emptyLocType;
    var valid = validator.validate(locationObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

   it('location type undefined', function(done) {
    locationObj= testLocList.locTypeUndefined;
    var valid = validator.validate(locationObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('empty addresses', function(done) {
    locationObj= testLocList.emptyAddresses;
    var valid = validator.validate(locationObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

 it('no name', function(done) {
    locationObj= testLocList.noName;
    var valid = validator.validate(locationObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

it('bad number', function(done) {
    locationObj= testLocList.badNumber;
    var valid = validator.validate(locationObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

});






describe('Test demographics:', function () {
  before(function(done) {
    shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    demographics = fs.readFileSync(__dirname + '/fixtures/validator/schemas/demographics.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/demographics', demographics);
    demographicsSchema = { '$ref': 'http://local.com/demographics' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    testDemoList = fs.readFileSync(__dirname + '/fixtures/validator/samples/testDemo.json', 'utf8');
    testDemoList = JSON.parse(testDemoList);
    compiledSchema = validator.compileSchema(demographicsSchema);
    done();
  });

  it('empty demographics obj', function(done) {
    var demoObj = {};
    var valid = validator.validate(demoObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it('test regular case, Isabella Jones', function(done) {
    var demoObj = testDemoList['regular'];
    var valid = validator.validate(demoObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('bad phone number', function(done) {
    var demoObj = testDemoList['badNum'];
    var valid = validator.validate(demoObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it("multiple bad children fields", function(done) {
    var demoObj = testDemoList['badAddr'];
    var valid = validator.validate(demoObj, compiledSchema);
    expect(valid).to.false;
    var error = validator.getLastError();
    expect(Object.keys(error)).length.least(3);
    done();
  });
});

describe('Test medications:', function () {
  before(function(done) {
    shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    medications = fs.readFileSync(__dirname + '/fixtures/validator/schemas/medications.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/medications', medications);
    medicationsSchema = { '$ref': 'http://local.com/medications' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    testMedicList = fs.readFileSync(__dirname + '/fixtures/validator/samples/testMedic.json', 'utf8');
    testMedicList = JSON.parse(testMedicList);
    compiledSchema = validator.compileSchema(medicationsSchema);
    done();
  });

  it('empty medications obj', function(done) {
    var medicObj = {};
    var valid = validator.validate(medicObj, compiledSchema);
    expect(valid).to.false;
    done();
  });
 it('test normal medications obj', function(done) {
    var medicObj = testMedicList.regular;
    var valid = validator.validate(medicObj, compiledSchema);
    expect(valid).to.true;
    var error = validator.getLastError();
    done();
  });

 it('test bad format doses and numbers', function(done) {
    var medicObj = testMedicList.badDoses;
    var valid = validator.validate(medicObj, compiledSchema);
    expect(valid).to.false;
    var error = validator.getLastError();
    expect(Object.keys(error)).length.least(2);
    done();
  });

 it('test missing product', function(done) {
    var medicObj = testMedicList.missProd;
    var valid = validator.validate(medicObj, compiledSchema);
    expect(valid).to.false;
    var error = validator.getLastError();
    done();
  });

});

describe('Test problems', function () {
  before(function(done) {
    shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    problems = fs.readFileSync(__dirname + '/fixtures/validator/schemas/problems.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/problems', problems);
    problemsSchema = { '$ref': 'http://local.com/problems' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    testProbList = fs.readFileSync(__dirname + '/fixtures/validator/samples/testProb.json', 'utf8');
    testProbList = JSON.parse(testProbList);
    compiledSchema = validator.compileSchema(problemsSchema);
    done();
  });

  it('empty problems obj', function(done) {
    var probObj = {};
    var valid = validator.validate(probObj, compiledSchema);
    expect(valid).to.false;
    done();
  });
 it('normal problems object #1', function(done) {
    var probObj = testProbList.regular1;
    var valid = validator.validate(probObj, compiledSchema);
    expect(valid).to.true;
    var error = validator.getLastError();
    done();
  });

  it('normal problems object #2', function(done) {
    var probObj = testProbList.regular2;
    var valid = validator.validate(probObj, compiledSchema);
    expect(valid).to.true;
    var error = validator.getLastError();
    done();
  });

  it('test bad date', function(done) {
    var probObj = testProbList.badDate;
    var valid = validator.validate(probObj, compiledSchema);
    expect(valid).to.falsex;
    var error = validator.getLastError();
    done();
  });

  it('empty problem', function(done) {
    var probObj = testProbList.emptyProblem;
    var valid = validator.validate(probObj, compiledSchema);
    expect(valid).to.falsex;
    var error = validator.getLastError();
    done();
  });


  it('problem not defined', function(done) {
    var probObj = testProbList.undefinedProblem;
    var valid = validator.validate(probObj, compiledSchema);
    expect(valid).to.falsex;
    var error = validator.getLastError();
    done();
  });
});


describe('Test results', function () {
  before(function(done) {
    shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    results = fs.readFileSync(__dirname + '/fixtures/validator/schemas/result.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/results', results);
    resultsSchema = { '$ref': 'http://local.com/results' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    testResultsList = fs.readFileSync(__dirname + '/fixtures/validator/samples/testResult.json', 'utf8');
    testResultsList = JSON.parse(testResultsList);
    compiledSchema = validator.compileSchema(resultsSchema);
    done();
  });

  it('empty results obj', function(done) {
    var  resultObj = {};
    var valid = validator.validate(resultObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it(' obj from sample', function(done) {
    var  resultObj = testResultsList.regular;
    var valid = validator.validate(resultObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

 it('empty id', function(done) {
    var  resultObj = testResultsList.emptyId;
    var valid = validator.validate(resultObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it('empty results set ', function(done) {
    var  resultObj = testResultsList.emptyResultsSet;
    var valid = validator.validate(resultObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

   it('no results', function(done) {
    var  resultObj = testResultsList.noResults;
    var valid = validator.validate(resultObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

    it('one bad short result', function(done) {
    var  resultObj = testResultsList.oneBadShortResult;
    var valid = validator.validate(resultObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it('value is a string', function(done) {
    var  resultObj = testResultsList.valueIsString;
    var valid = validator.validate(resultObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

});


describe('Test allergies', function () {
  before(function(done) {
    shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    allergies = fs.readFileSync(__dirname + '/fixtures/validator/schemas/allergy.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/allergy', allergies);
    allergySchema = { '$ref': 'http://local.com/allergy' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    testAllergyList = fs.readFileSync(__dirname + '/fixtures/validator/samples/testAllergy.json', 'utf8');
    testAllergyList = JSON.parse(testAllergyList);
    compiledSchema = validator.compileSchema(allergySchema);
    done();
  });

  it('empty allergy obj', function(done) {
    var  allergyObj = {};
    var valid = validator.validate(allergyObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it('correct allergy obj from sample #1', function(done) {
    var  allergyObj = testAllergyList.regular1;
    var valid = validator.validate(allergyObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('correct allergy obj from sample #2', function(done) {
    var  allergyObj = testAllergyList.regular2;
    var valid = validator.validate(allergyObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('correct allergy obj from sample #3', function(done) {
    var  allergyObj = testAllergyList.regular2;
    var valid = validator.validate(allergyObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('no id in allergy object', function(done) {
    var  allergyObj = testAllergyList.noId;
    var valid = validator.validate(allergyObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

   it('allergen is undefined', function(done) {
    var  allergyObj = testAllergyList.noAllergen;
    var valid = validator.validate(allergyObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it('no dates in allergy object', function(done) {
    var  allergyObj = testAllergyList.noDates;
    var valid = validator.validate(allergyObj, compiledSchema);
    expect(valid).to.true;
    done();
  });

  it('empty reaction field', function(done) {
    var  allergyObj = testAllergyList.emptyReaction;
    var valid = validator.validate(allergyObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

    it('bad reaction field(code entries wrong)', function(done) {
    var  allergyObj = testAllergyList.badReaction;
    var valid = validator.validate(allergyObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

});


describe('Test encounter', function () {
  before(function(done) {
    shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    encounter = fs.readFileSync(__dirname + '/fixtures/validator/schemas/encounter.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/encounter', encounter);
    encounterSchema = { '$ref': 'http://local.com/encounter' };
    validator = new ZSchema({ sync: true, noExtraKeywords:true});
    testEncounterList = fs.readFileSync(__dirname + '/fixtures/validator/samples/testEncounter.json', 'utf8');
    testEncounterList = JSON.parse(testEncounterList);
    compiledSchema = validator.compileSchema(encounterSchema);
    done();
  });

  it('empty encounter obj', function(done) {
    var  encounterObj = {};
    var valid = validator.validate(encounterObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

  it('regular encounter obj', function(done) {
    var  encounterObj = testEncounterList.regular;
    var valid = validator.validate(encounterObj, compiledSchema);
    var error = validator.getLastError();
    expect(valid).to.true;
    done();
  });

  it('encounter field missing', function(done) {
    var  encounterObj = testEncounterList.missingEncounter;
    var valid = validator.validate(encounterObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

    it('date and id missing', function(done) {
    var  encounterObj = testEncounterList.dateIdMissing;
    var valid = validator.validate(encounterObj, compiledSchema);
    expect(valid).to.true;
    done();
  });
s
  it('address has a bad field', function(done) {
    var  encounterObj = testEncounterList.addressBadField;
    var valid = validator.validate(encounterObj, compiledSchema);
    expect(valid).to.false;
    done();
  });

   it('findings missing', function(done) {
    var  encounterObj = testEncounterList.findingsMissing;
    var valid = validator.validate(encounterObj, compiledSchema);
    expect(valid).to.true;
    done();
  });
});


















