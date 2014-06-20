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
    idenSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_identifier' };
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

  it('regular name', function(done) {
    nameObj = {
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
    nameObj = {
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
    nameObj = {
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
    identifierObj = {};
    var valid = validator.validate(nameObj, compiledSchema);
    expect(valid).to.true;
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





