var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var cms = require('../lib/parser/cms/cmsParser.js');

var txtdata;
describe('CMS parser.js', function() {
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/cms/sample2.txt');

        //console.log(filepath);
        var txtfile = fs.readFileSync(filepath, 'utf-8');

        txtdata=txtfile.toString();
        done();
    });
    
    it('check valid data parsing', function(done) {
        var result = cms(txtdata);

        //console.log(result);
        expect(result).to.exist;
        done();
    });
    
});