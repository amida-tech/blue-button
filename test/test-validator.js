/*jshint expr: true*/
var fs = require('fs');
var expect = require('chai').expect;
var path = require('path');
var ZSchema = require("z-schema");

describe('Test Addresses', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        addressSchema = {
            '$ref': 'http://local.com/commonModels#/properties/cda_address'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        compiledSchema = validator.compileSchema(addressSchema);
        testAddressList = require(__dirname + '/fixtures/validator/samples/testAddress.js');
        done();
    });
    it('regular address from CCD_1', function (done) {
        var regAddr = testAddressList.regular;
        valid = validator.validate(regAddr, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('no address lines', function (done) {
        var missingAddr = testAddressList.missingAddr;
        valid = validator.validate(missingAddr, compiledSchema);
        expect(valid).to.false;
        done();
    });


    it('no city', function (done) {
        var noCity = testAddressList.noCity;
        valid = validator.validate(noCity, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('empty', function (done) {
        var empty = testAddressList.empty;
        valid = validator.validate(empty, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('only city and address', function (done) {
        var onlyCityAddr = testAddressList.onlyCityAddr;
        valid = validator.validate(onlyCityAddr, compiledSchema);
        expect(valid).to.true;
        done();
    });
});



describe('Test dates', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        dateSchema = {
            '$ref': 'http://local.com/commonModels#/properties/cda_date'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        compiledSchema = validator.compileSchema(dateSchema);
        done();
    });

    it('date without precision', function (done) {
        dateObj = {
            'date': '1975-05-01T00:00:00.000Z'
        };
        var valid = validator.validate(dateObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('empty date obj', function (done) {
        dateObj = {};
        var valid = validator.validate(dateObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('bad timedate format obj', function (done) {
        dateObj = {
            'date': '03/23/1992'
        };
        var valid = validator.validate(dateObj, compiledSchema);
        expect(valid).to.false;
        done();
    });
    it('Precision no time date', function (done) {
        dateObj = {
            'precision': 'day'
        };
        var valid = validator.validate(dateObj, compiledSchema);
        expect(valid).to.false;
        done();
    });
});

describe('Test phone:', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        phoneSchema = {
            '$ref': 'http://local.com/commonModels#/properties/cda_phone'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        compiledSchema = validator.compileSchema(phoneSchema);
        done();
    });

    it('phone without type', function (done) {
        phoneObj = {
            "number": "703-354-6290"
        };
        var valid = validator.validate(phoneObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('phone with only type', function (done) {
        phoneObj = {
            "type": "primary home"
        };
        var valid = validator.validate(phoneObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('empty phone obj', function (done) {
        phoneObj = {};
        var valid = validator.validate(phoneObj, compiledSchema);
        expect(valid).to.false;
        done();
    });
});

describe('Test email:', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        emailSchema = {
            '$ref': 'http://local.com/commonModels#/properties/cda_email'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        compiledSchema = validator.compileSchema(emailSchema);
        done();
    });

    it('email without type', function (done) {
        emailObj = {
            "email": "amida@mountain.com"
        };
        var valid = validator.validate(emailObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('email with only type', function (done) {
        emailObj = {
            "type": "primary home"
        };
        var valid = validator.validate(emailObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('empty email obj', function (done) {
        emailObj = {};
        var valid = validator.validate(emailObj, compiledSchema);
        expect(valid).to.false;
        done();
    });
});

describe('Test identifier:', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        idenSchema = {
            '$ref': 'http://local.com/commonModels#/properties/cda_id'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        compiledSchema = validator.compileSchema(idenSchema);
        done();
    });

    it('identifier all fields', function (done) {
        identifierObj = {
            "identifier": "2.16.840.1.113883.19.5.9999.456",
            "identifier_type": "2981824"
        };

        var valid = validator.validate(identifierObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('identifier without type', function (done) {
        identifierObj = {
            "identifier": "2.16.840.1.113883.19.5.9999.456"
        };
        var valid = validator.validate(identifierObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('email with only type', function (done) {
        identifierObj = {
            "identifier_type": "2981824"
        };
        var valid = validator.validate(identifierObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('empty email obj', function (done) {
        identifierObj = {};
        var valid = validator.validate(identifierObj, compiledSchema);
        expect(valid).to.false;
        done();
    });
});

describe('Test name:', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        nameSchema = {
            '$ref': 'http://local.com/commonModels#/properties/cda_name'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        compiledSchema = validator.compileSchema(nameSchema);
        done();
    });

    it('regular name', function (done) {
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

    it('no middle name', function (done) {
        var nameObj = {
            "middle": [],
            "last": "Jones",
            "first": "Isabella"
        };
        var valid = validator.validate(nameObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('multiple middle names', function (done) {
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

    it('empty name obj', function (done) {
        var nameObj = {};
        var valid = validator.validate(nameObj, compiledSchema);
        expect(valid).to.false;
        done();
    });
});

describe('Test coded entries:', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        codedEntrySchema = {
            '$ref': 'http://local.com/commonModels#/properties/cda_coded_entry'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        compiledSchema = validator.compileSchema(codedEntrySchema);
        done();
    });

    it('empty coded entry', function (done) {
        codedEntryObj = {};
        var valid = validator.validate(codedEntryObj, compiledSchema);
        expect(valid).to.false;
        done();
    });


    it('coded entry with undefined property', function (done) {
        codedEntryObj = {
            "kode": "1198000"
        };
        var valid = validator.validate(codedEntryObj, compiledSchema);
        expect(valid).to.false;
        done();
    });


    it('regular coded entry', function (done) {
        codedEntryObj = {
            "name": "Wheezing",
            "code": "56018004",
            "code_system_name": "SNOMED CT"
        };
        var valid = validator.validate(codedEntryObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('coded entry with only the code ', function (done) {
        codedEntryObj = {
            "code": "56018004",
            "code_system_name": "SNOMED CT"
        };
        var valid = validator.validate(codedEntryObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('coded entry with a translation ', function (done) {
        codedEntryObj = {
            "name": "Influenza virus vaccine",
            "code": "88",
            "code_system_name": "CVX",
            "translations": [{
                "name": "Influenza, seasonal, injectable",
                "code": "141",
                "code_system_name": "CVX"
            }]
        };
        var valid = validator.validate(codedEntryObj, compiledSchema);
        expect(valid).to.true;
        done();
    });
    it('translation is empty ', function (done) {
        codedEntryObj = {
            "name": "Influenza virus vaccine",
            "code": "88",
            "code_system_name": "CVX",
            "translations": []
        };
        var valid = validator.validate(codedEntryObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('translation has only one entry ', function (done) {
        codedEntryObj = {
            "name": "Influenza virus vaccine",
            "code": "88",
            "code_system_name": "CVX",
            "translations": [{
                "name": "Influenza, seasonal"
            }]
        };
        var valid = validator.validate(codedEntryObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

});

describe('Test physical quantities:', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        physQuanSchema = {
            '$ref': 'http://local.com/commonModels#/properties/cda_physical_quantity'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        compiledSchema = validator.compileSchema(physQuanSchema);
        done();
    });

    it('empty physical quanity', function (done) {
        physObj = {};
        var valid = validator.validate(physObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('physical quanity value is string', function (done) {
        physObj = {
            'unit': 'mmHg',
            'value': 'l337'
        };
        var valid = validator.validate(physObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('correct physical quanitty', function (done) {
        physObj = {
            'unit': 'mmHg',
            'value': 1337
        };
        var valid = validator.validate(physObj, compiledSchema);
        expect(valid).to.true;
        done();
    });
});

describe('Test location:', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        locationSchema = {
            '$ref': 'http://local.com/commonModels#/properties/cda_location'
        };
        testLocList = require(__dirname + '/fixtures/validator/samples/testLocations.js');
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        compiledSchema = validator.compileSchema(locationSchema);
        done();
    });

    it('empty location', function (done) {
        locationObj = {};
        var valid = validator.validate(locationObj, compiledSchema);
        expect(valid).to.false;
        done();
    });


    it('regular location # 1 ', function (done) {
        locationObj = testLocList.regular1;
        var valid = validator.validate(locationObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('regular location # 2 ', function (done) {
        locationObj = testLocList.regular2;
        var valid = validator.validate(locationObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('location type empty', function (done) {
        locationObj = testLocList.emptyLocType;
        var valid = validator.validate(locationObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('location type undefined', function (done) {
        locationObj = testLocList.locTypeUndefined;
        var valid = validator.validate(locationObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('empty addresses', function (done) {
        locationObj = testLocList.emptyAddresses;
        var valid = validator.validate(locationObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('no name', function (done) {
        locationObj = testLocList.noName;
        var valid = validator.validate(locationObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('bad number', function (done) {
        locationObj = testLocList.badNumber;
        var valid = validator.validate(locationObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

});

describe('Test demographics:', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        demographics = fs.readFileSync(__dirname + '/fixtures/validator/schemas/demographics.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/demographics', demographics);
        demographicsSchema = {
            '$ref': 'http://local.com/demographics'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testDemoList = require(__dirname + '/fixtures/validator/samples/testDemo.js');
        compiledSchema = validator.compileSchema(demographicsSchema);
        done();
    });

    it('empty demographics obj', function (done) {
        var demoObj = {};
        var valid = validator.validate(demoObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('test regular case, Isabella Jones', function (done) {
        var demoObj = testDemoList.regular;
        var valid = validator.validate(demoObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('bad phone number', function (done) {
        var demoObj = testDemoList.badNum;
        var valid = validator.validate(demoObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it("multiple bad children fields", function (done) {
        var demoObj = testDemoList.badAddr;
        var valid = validator.validate(demoObj, compiledSchema);
        expect(valid).to.false;
        var error = validator.getLastError();
        expect(Object.keys(error)).length.least(3);
        done();
    });
});

describe('Test medications:', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        medications = fs.readFileSync(__dirname + '/fixtures/validator/schemas/medications.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/medications', medications);
        medicationsSchema = {
            '$ref': 'http://local.com/medications'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testMedicList = require(__dirname + '/fixtures/validator/samples/testMedic.js');
        compiledSchema = validator.compileSchema(medicationsSchema);
        done();
    });

    it('empty medications obj', function (done) {
        var medicObj = {};
        var valid = validator.validate(medicObj, compiledSchema);
        expect(valid).to.false;
        done();
    });
    it('test normal medications obj', function (done) {
        var medicObj = testMedicList.regular;
        var valid = validator.validate(medicObj, compiledSchema);
        expect(valid).to.true;
        var error = validator.getLastError();
        done();
    });

    it('test bad format doses and numbers', function (done) {
        var medicObj = testMedicList.badDoses;
        var valid = validator.validate(medicObj, compiledSchema);
        expect(valid).to.false;
        var error = validator.getLastError();
        expect(Object.keys(error)).length.least(2);
        done();
    });

    it('test missing product', function (done) {
        var medicObj = testMedicList.missProd;
        var valid = validator.validate(medicObj, compiledSchema);
        expect(valid).to.false;
        var error = validator.getLastError();
        done();
    });

});

describe('Test problems', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        problems = fs.readFileSync(__dirname + '/fixtures/validator/schemas/problems.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/problems', problems);
        problemsSchema = {
            '$ref': 'http://local.com/problems'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testProbList = require(__dirname + '/fixtures/validator/samples/testProb.js');
        compiledSchema = validator.compileSchema(problemsSchema);
        done();
    });

    it('empty problems obj', function (done) {
        var probObj = {};
        var valid = validator.validate(probObj, compiledSchema);
        expect(valid).to.false;
        done();
    });
    it('normal problems object #1', function (done) {
        var probObj = testProbList.regular1;
        var valid = validator.validate(probObj, compiledSchema);
        expect(valid).to.true;
        var error = validator.getLastError();
        done();
    });

    it('normal problems object #2', function (done) {
        var probObj = testProbList.regular2;
        var valid = validator.validate(probObj, compiledSchema);
        expect(valid).to.true;
        var error = validator.getLastError();
        done();
    });

    it('test bad date', function (done) {
        var probObj = testProbList.badDate;
        var valid = validator.validate(probObj, compiledSchema);
        expect(valid).to.falsex;
        var error = validator.getLastError();
        done();
    });

    it('empty problem', function (done) {
        var probObj = testProbList.emptyProblem;
        var valid = validator.validate(probObj, compiledSchema);
        expect(valid).to.falsex;
        var error = validator.getLastError();
        done();
    });


    it('problem not defined', function (done) {
        var probObj = testProbList.undefinedProblem;
        var valid = validator.validate(probObj, compiledSchema);
        expect(valid).to.falsex;
        var error = validator.getLastError();
        done();
    });
});


describe('Test results', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        results = fs.readFileSync(__dirname + '/fixtures/validator/schemas/result.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/results', results);
        resultsSchema = {
            '$ref': 'http://local.com/results'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testResultsList = require(__dirname + '/fixtures/validator/samples/testResult.js');
        compiledSchema = validator.compileSchema(resultsSchema);
        done();
    });

    it('empty results obj', function (done) {
        var resultObj = {};
        var valid = validator.validate(resultObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it(' obj from sample', function (done) {
        var resultObj = testResultsList.regular;
        var valid = validator.validate(resultObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('empty id', function (done) {
        var resultObj = testResultsList.emptyId;
        var valid = validator.validate(resultObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('empty results set ', function (done) {
        var resultObj = testResultsList.emptyResultsSet;
        var valid = validator.validate(resultObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('no results', function (done) {
        var resultObj = testResultsList.noResults;
        var valid = validator.validate(resultObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('one bad short result', function (done) {
        var resultObj = testResultsList.oneBadShortResult;
        var valid = validator.validate(resultObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('value is a string', function (done) {
        var resultObj = testResultsList.valueIsString;
        var valid = validator.validate(resultObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

});

describe('Test allergies', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        allergies = fs.readFileSync(__dirname + '/fixtures/validator/schemas/allergy.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/allergy', allergies);
        allergySchema = {
            '$ref': 'http://local.com/allergy'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testAllergyList = require(__dirname + '/fixtures/validator/samples/testAllergy.js');
        compiledSchema = validator.compileSchema(allergySchema);
        done();
    });

    it('empty allergy obj', function (done) {
        var allergyObj = {};
        var valid = validator.validate(allergyObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('correct allergy obj from sample #1', function (done) {
        var allergyObj = testAllergyList.regular1;
        var valid = validator.validate(allergyObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('correct allergy obj from sample #2', function (done) {
        var allergyObj = testAllergyList.regular2;
        var valid = validator.validate(allergyObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('correct allergy obj from sample #3', function (done) {
        var allergyObj = testAllergyList.regular2;
        var valid = validator.validate(allergyObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('no id in allergy object', function (done) {
        var allergyObj = testAllergyList.noId;
        var valid = validator.validate(allergyObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('allergen is undefined', function (done) {
        var allergyObj = testAllergyList.noAllergen;
        var valid = validator.validate(allergyObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('no dates in allergy object', function (done) {
        var allergyObj = testAllergyList.noDates;
        var valid = validator.validate(allergyObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('empty reaction field', function (done) {
        var allergyObj = testAllergyList.emptyReaction;
        var valid = validator.validate(allergyObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('bad reaction field(code entries wrong)', function (done) {
        var allergyObj = testAllergyList.badReaction;
        var valid = validator.validate(allergyObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

});


describe('Test encounter', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        encounter = fs.readFileSync(__dirname + '/fixtures/validator/schemas/encounter.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/encounter', encounter);
        encounterSchema = {
            '$ref': 'http://local.com/encounter'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testEncounterList = require(__dirname + '/fixtures/validator/samples/testEncounter.js');
        compiledSchema = validator.compileSchema(encounterSchema);
        done();
    });

    it('empty encounter obj', function (done) {
        var encounterObj = {};
        var valid = validator.validate(encounterObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('regular encounter obj', function (done) {
        var encounterObj = testEncounterList.regular;
        var valid = validator.validate(encounterObj, compiledSchema);
        var error = validator.getLastError();
        expect(valid).to.true;
        done();
    });

    it('encounter field missing', function (done) {
        var encounterObj = testEncounterList.missingEncounter;
        var valid = validator.validate(encounterObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('date and id missing', function (done) {
        var encounterObj = testEncounterList.dateIdMissing;
        var valid = validator.validate(encounterObj, compiledSchema);
        expect(valid).to.true;
        done();
    });
    it('address has a bad field', function (done) {
        var encounterObj = testEncounterList.addressBadField;
        var valid = validator.validate(encounterObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('findings missing', function (done) {
        var encounterObj = testEncounterList.findingsMissing;
        var valid = validator.validate(encounterObj, compiledSchema);
        expect(valid).to.true;
        done();
    });
});

describe('Test vitals', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        vital = fs.readFileSync(__dirname + '/fixtures/validator/schemas/vitals.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/vital', vital);
        vitalSchema = {
            '$ref': 'http://local.com/vital'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testVitalList = require(__dirname + '/fixtures/validator/samples/testVital.js');
        compiledSchema = validator.compileSchema(vitalSchema);
        done();
    });

    it('empty vital', function (done) {
        var vitalObj = {};
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('vital sample #1', function (done) {
        var vitalObj = testVitalList.regular1;
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('vital sample #2', function (done) {
        var vitalObj = testVitalList.regular2;
        var valid = validator.validate(vitalObj, compiledSchema);
        var error = validator.getLastError();
        expect(valid).to.true;
        done();
    });

    it('vital sample #3', function (done) {
        var vitalObj = testVitalList.regular3;
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('vital sample #4', function (done) {
        var vitalObj = testVitalList.regular4;
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('vital sample #5', function (done) {
        var vitalObj = testVitalList.regular5;
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('vital sample #6', function (done) {
        var vitalObj = testVitalList.regular6;
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('vital has string for value(bad value)', function (done) {
        var vitalObj = testVitalList.badValue;
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('empty object vital field', function (done) {
        var vitalObj = testVitalList.emptyVitals;
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('empty date object', function (done) {
        var vitalObj = testVitalList.emptyDate;
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('file with only vital field', function (done) {
        var vitalObj = testVitalList.onlyVitals;
        var valid = validator.validate(vitalObj, compiledSchema);
        expect(valid).to.true;
        done();
    });
});

describe('Test social history', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        socialHist = fs.readFileSync(__dirname + '/fixtures/validator/schemas/socialhistory.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/socialHistory', socialHist);
        socialSchema = {
            '$ref': 'http://local.com/socialHistory'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testSocialList = require(__dirname + '/fixtures/validator/samples/testSocial.js');
        compiledSchema = validator.compileSchema(socialSchema);
        done();
    });

    //this is true for nows
    it('empty social histoy', function (done) {
        var socialObj = {};
        var valid = validator.validate(socialObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('regular social history', function (done) {
        var socialObj = testSocialList.regular;
        var valid = validator.validate(socialObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('social history without smoking value', function (done) {
        var socialObj = testSocialList.noSmokingValue;
        var valid = validator.validate(socialObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('social history with no smoking dates', function (done) {
        var socialObj = testSocialList.noSmokingDate;
        var valid = validator.validate(socialObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('social history with empty array as smoking dates', function (done) {
        var socialObj = testSocialList.emptySmokingDate;
        var valid = validator.validate(socialObj, compiledSchema);
        expect(valid).to.true;
        done();
    });
});

describe('Test procedures', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        procedure = fs.readFileSync(__dirname + '/fixtures/validator/schemas/procedure.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/procedureSchema', procedure);
        procedureSchema = {
            '$ref': 'http://local.com/procedureSchema'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testProcedList = require(__dirname + '/fixtures/validator/samples/testProcedures.js');
        compiledSchema = validator.compileSchema(procedureSchema);
        done();
    });

    it('test empty procedures object', function (done) {
        var procedObj = {};
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

     it('test sample procedures object #1', function (done) {
        var procedObj = testProcedList.regular1;
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('test sample procedures object #2', function (done) {
        var procedObj = testProcedList.regular2;
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('test sample procedures object #3', function (done) {
        var procedObj = testProcedList.regular3;
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('missing status', function (done) {
        var procedObj = testProcedList.missingStatus;
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it( 'missing procedure field', function (done) {
        var procedObj = testProcedList.missingProcedureField;
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('procedure field has coded entry with only name field', function (done) {
        var procedObj = testProcedList.procedureFieldNameOnly;
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('no organization field', function (done) {
        var procedObj = testProcedList.noOrganizationField;
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('no organization name, only identifier', function (done) {
        var procedObj = testProcedList.organizationNoName;
        var valid = validator.validate(procedObj, compiledSchema);
        console.log(validator.getLastError());
        expect(valid).to.true;
        done();
    });

    it('bad address, street line', function (done) {
        var procedObj = testProcedList.addressBadStreetLine;
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('missing providers', function (done) {
        var procedObj = testProcedList.missingProviders;
        var valid = validator.validate(procedObj, compiledSchema);
        expect(valid).to.true;
        done();
    });
});


describe('Test Immunizations', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);
        immunization = fs.readFileSync(__dirname + '/fixtures/validator/schemas/immunization.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/immunizationSchema', immunization);
        immunizationSchema = {
            '$ref': 'http://local.com/immunizationSchema'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testImmunList = require(__dirname + '/fixtures/validator/samples/testImmunization.js');
        compiledSchema = validator.compileSchema(immunizationSchema);
        done();
    });

    it('empty immunization object', function (done) {
        var immunObj = {};
        var valid = validator.validate(immunObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('sample number 1', function (done) {
        var immunObj = testImmunList.regular1;
        var valid = validator.validate(immunObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('sample number 2', function (done) {
        var immunObj = testImmunList.regular2;
        var valid = validator.validate(immunObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('sample number 3', function (done) {
        var immunObj = testImmunList.regular3;
        var valid = validator.validate(immunObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('missing product field', function (done) {
        var immunObj = testImmunList.missingProductField;
        var valid = validator.validate(immunObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('empty object product field', function (done) {
        var immunObj = testImmunList.emptyProduct;
        var valid = validator.validate(immunObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('missing status field', function (done) {
        var immunObj = testImmunList.missingStatusField;
        var valid = validator.validate(immunObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('unncecessary extra field in product', function (done) {
        var immunObj = testImmunList.extraFieldInProduct;
        var valid = validator.validate(immunObj, compiledSchema);
        expect(valid).to.false;
        done();
    });
});


describe('Test Document Model', function () {
    before(function (done) {
        shared = fs.readFileSync(__dirname + '/fixtures/validator/schemas/shared.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/commonModels', shared);

        demographics = fs.readFileSync(__dirname + '/fixtures/validator/schemas/demographics.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/demographics', demographics);

        allergy = fs.readFileSync(__dirname + '/fixtures/validator/schemas/allergy.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/allergy', allergy);

        encounter = fs.readFileSync(__dirname + '/fixtures/validator/schemas/encounter.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/encounter', encounter);

        immunization = fs.readFileSync(__dirname + '/fixtures/validator/schemas/immunization.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/immunization', immunization);

        medication = fs.readFileSync(__dirname + '/fixtures/validator/schemas/medication.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/medication', medication);

        problem = fs.readFileSync(__dirname + '/fixtures/validator/schemas/problem.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/problem', problem);

        procedure = fs.readFileSync(__dirname + '/fixtures/validator/schemas/procedure.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/procedure', procedure);

        result = fs.readFileSync(__dirname + '/fixtures/validator/schemas/result.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/result', result);

        socialHistory= fs.readFileSync(__dirname + '/fixtures/validator/schemas/socialhistory.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/socialhistory', socialHistory);

        vital = fs.readFileSync(__dirname + '/fixtures/validator/schemas/vital.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/vital', vital);

        documentSchema = fs.readFileSync(__dirname + '/fixtures/validator/schemas/documentModel.json', 'utf8');
        ZSchema.setRemoteReference('http://local.com/documentSchema', documentSchema);
        documentSchema = {
            '$ref': 'http://local.com/documentSchema'
        };
        validator = new ZSchema({
            sync: true,
            noExtraKeywords: true
        });
        testDocumentList = require(__dirname + '/fixtures/validator/samples/testDocument.js');
        compiledSchema = validator.compileSchema(documentSchema);
        done();
    });

    it('empty document model', function (done) {
        var docObj = {};
        var valid = validator.validate(docObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

    it('sample document', function (done) {
        var docObj = testDocumentList.regular;
        var valid = validator.validate(docObj, compiledSchema);
        expect(valid).to.true;
        done();
    });

     it('one bad date', function (done) {
        var docObj = testDocumentList.badDate;
        var valid = validator.validate(docObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('emptySections', function (done) {
        var docObj = testDocumentList.emptySections;
        var valid = validator.validate(docObj, compiledSchema);
        expect(valid).to.false;
        done();
    });

    it('find bad entries', function (done) {
        var docObj = testDocumentList.findBadEntries;
        var valid = validator.validate(docObj, compiledSchema);
        var error = validator.getLastError();
        expect(Object.keys(error.errors).length).to.be.at.least(4);
        expect(valid).to.false;
        done();
    });









});


