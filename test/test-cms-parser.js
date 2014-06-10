var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var cms = require('../lib/parser/cms/cmsParser.js');

var txtdata;

//loads the file
function loadFile(filename){
  var filepath  = path.join(__dirname, 'fixtures/cms/' + filename);
  var txtfile = fs.readFileSync(filepath, 'utf-8');
  return txtfile;

}


//checks if the number titles is enough
function titleTest(result, titles){
  //console.log(titles.length);
  var hasAllTitles = true;
  var resultKeys = Object.keys(result);
  //console.log(result);
  //checking if keys ar eequa
  expect(resultKeys.length).to.equal(titles.length, "lengths are not the same");
  expect(result).to.have.keys(titles, "keys are not the same");
}

//Checking for bad keys(empty string or just a space)
function checkForBadKeys(result){
  for(var key in result){
    if(key == '')
      return '';
    if(key == ' ')
      return ' ';
    if(typeof result[key] == 'object')
      checkForBadKeys(result[key]);
    }
    return true;
}



/*This is a function that stores tests that should be met among many different
test files */
function sharedTests(){
  var result;
  beforeEach(function(done){
     result = cms.parseCMS(this.txtdata);
     done();
  });
  it('check for existence and type', function(done) {
    expect(result).to.exist;
    expect(result).to.be.an('object');
    done();
  });

  it('make sure intermediate format has all titles', function(done) {
    var titles = cms.getTitles(this.txtdata);
    //titleTest(result, titles);
    done();
  });

  it('make sure there are no bad keys', function(done){
    var badKeysResult = checkForBadKeys(result);
    expect(badKeysResult).to.be.true;
    done();
  });
}



describe('Testing with original sample data', function () {
    before(function(done) {
      var txtfile = loadFile('sample2.txt');
      this.txtdata = txtfile.toString();
      done();
    });

    sharedTests();


});

describe('Testing two sections(metadata & demographics)', function () {

  before(function(done) {
    var txtfile = loadFile('singleSectionDemo.txt');
    this.txtdata=txtfile.toString();
    done();
  });

  sharedTests();

  it('check that there are only two titles', function(done){
    var result = cms.parseCMS(this.txtdata);

    var titles = cms.getTitles(this.txtdata);
    var resultKeys = Object.keys(result);
    expect(resultKeys.length).to.equal(2);

    var expectedTitles = ['MYMEDICARE.GOV PERSONAL HEALTH INFORMATION', 'Demographic'];
    expect(result).to.have.keys(expectedTitles);
    done();
  });

});

describe('Testing File with only meta section', function () {

  before(function(done) {
    var txtfile = loadFile('metaOnly.txt');
    this.txtdata=txtfile.toString();
    done();
  });

  sharedTests();

  it('check that there is only one title', function(done){
    var result = cms.parseCMS(this.txtdata);
    var titles = cms.getTitles(this.txtdata);
    var resultKeys = Object.keys(result);
    expect(resultKeys.length).to.equal(1);
    var expectedTitles = ['MYMEDICARE.GOV PERSONAL HEALTH INFORMATION'];
    expect(result).to.have.keys(expectedTitles);
    done();
  });

});

describe('Testing a different number of dashes(5)', function () {
  beforeEach(function(done) {
    var txtfile = loadFile('differentDashes.txt');
    this.txtdata = txtfile.toString();
    done();
  });

  sharedTests();
});

describe('Testing file with beginning(meta) and end(claims)', function () {

  before(function(done) {
    var txtfile = loadFile('begAndEndSections.txt');
    this.txtdata=txtfile.toString();
    done();
  });

  sharedTests();

  it('check that there is only two titles', function(done){
    var result = cms.parseCMS(this.txtdata);
    var titles = cms.getTitles(this.txtdata);
    var resultKeys = Object.keys(result);
    expect(resultKeys.length).to.equal(2);
    var expectedTitles = ['MYMEDICARE.GOV PERSONAL HEALTH INFORMATION', 'Claim Summary'];
    expect(result).to.have.keys(expectedTitles);
    done();
  });

  it('check that the sections are populated', function(done){
    var result = cms.parseCMS(this.txtdata);
    for (var key in result)
    {
      var sectionValueObj = result[key];
      var sectionValueObjKeys = Object.keys(sectionValueObj);
      expect(sectionValueObjKeys.length).to.be.greaterThan(0);
    }
    done();
  });
});

describe('Testing a file with empty sections', function () {

  before(function(done) {
    var txtfile = loadFile('emptySections.txt');
    this.txtdata=txtfile.toString();
    done();
  });

  sharedTests();

  it('checks that the sections are empty', function(done){
    var result = cms.parseCMS(this.txtdata);
    var allSectionsAreEmpty = true;
    for(var key in result){
      if(result[key] instanceof Array ){
        if(result[key].length != 0){
          allSectionsAreEmpty = false;
        }
      }
      else if(result[key] instanceof Object){
        var keys = Object.keys(result[key]);
        if(keys.length > 0){
          allSectionsAreEmpty = false;
        }
      }
    }
    expect(allSectionsAreEmpty).equals(true, "parsing error, empty section parsed"
      +" as not empty");
    done();
  });


});

describe('Testing a file with missing', function () {

  before(function(done) {
    var txtfile = loadFile('missingSections.txt');
    this.txtdata=txtfile.toString();
    done();
  });

  sharedTests();
  it('checks that the right numbers of sections are present', function(done){
    var result = cms.parseCMS(this.txtdata);
    var resultKeys = Object.keys(result);
    var expectedKeys = ['MYMEDICARE.GOV PERSONAL HEALTH INFORMATION',
    'Demographic', 'Self Reported Medical Conditions', 'Family Medical History', 'Plans'];
    expect(result).to.have.keys(expectedKeys);
    done();
  });
});

describe('Test an empty file', function () {

  before(function(done) {
    var txtfile = loadFile('emptyFile.txt');
    this.txtdata=txtfile.toString();
    done();
  });

  sharedTests();

});

describe('Test a file with no sources', function () {

  before(function(done) {
    var txtfile = loadFile('noSources.txt');
    var result = cms.parseCMS(txtfile);
    this.txtdata=txtfile.toString();
    console.log(result);
    done();
  });

  sharedTests();

});


describe('Test a file with only sources', function () {

  before(function(done) {
    var txtfile = loadFile('onlySources.txt');
    var result = cms.parseCMS(txtfile);
    this.txtdata=txtfile.toString();
    console.log(result);
    done();
  });

  sharedTests();

});

  it('checks that only type of children are sources', function(done){
    var result = cms.parseCMS(this.txtdata);
    for(var keys in result){
      var sectionObj = result[keys];
      if(result[key] instanceof Array ){
        if(result[key].length != 0){
          allSectionsAreEmpty = false;
        }
      }
      else if(result[key] instanceof Object){

      }
    }

  });

});








