var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var cms = require('../lib/parser/cms/cmsParser.js');

var txtdata;


function loadFile(filename){
  var filepath  = path.join(__dirname, 'fixtures/cms/' + filename);
  var txtfile = fs.readFileSync(filepath, 'utf-8');
  return txtfile;

}

function titleTest(result, titles){
  //console.log(titles.length);
  var hasAllTitles = true;
  var resultKeys = Object.keys(result);
  //console.log(result);
  //checking if keys ar eequa
  expect(resultKeys.length).to.equal(titles.length, "lengths are not the same");
  expect(result).to.have.keys(titles, "keys are not the same");
}


describe('CMS parser.js', function() {
  data.forEach(function (dataItem) {
        test("data_provider test", testWithData(dataItem));
    });



  describe('Test #1, testing given original sample data', function () {
      before(function(done) {
        var txtfile = loadFile('sample2.txt');
        txtdata=txtfile.toString();
        done();
      });

      it('check  for existence and type', function(done) {
        var result = cms.parseCMS(txtdata);
        expect(result).to.exist;
        expect(result).to.be.an('object');
        done();
      });

      it('make sure intermediate format has all titles', function(done) {
        var result = cms.parseCMS(txtdata);
        var titles = cms.getTitles(txtdata);
        titleTest(result, titles);
        done();
      });

  });

  describe('Test #2, testing only one section', function () {
    before(function(done) {
      var txtfile = loadFile('singleSectionDemo.txt');
      txtdata=txtfile.toString();
      done();
    });

    it('check for data existence and type', function(done) {
      var result = cms.parseCMS(txtdata);
      expect(result).to.exist;
      expect(result).to.be.an('object');
      done();
    });

    it('make sure intermediate format has all titles', function(done) {
      var result = cms.parseCMS(txtdata);
      var titles = cms.getTitles(txtdata);
      titleTest(result, titles);
      done();
    });

  });

  describe('Test #3, testing a different number of dashes', function () {

    before(function(done) {
      var txtfile = loadFile('differentDashes.txt');
      txtdata = txtfile.toString();
      done();
    });

    it('check for data existence and type', function(done) {
      var result = cms.parseCMS(txtdata);
      expect(result).to.exist;
      expect(result).to.be.an('object');
      done();

    it('make sure intermediate format has all titles', function(done) {
      var result = cms.parseCMS(txtdata);
      var titles = cms.getTitles(txtdata);
      titleTest(result, titles);
      done();
    });

  });

  });





});
