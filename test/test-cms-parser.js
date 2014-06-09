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



describe('CMS parser.js', function() {

    describe('Test #1, testing given original sample data', function () {
        before(function(done) {
            var txtfile = loadFile('sample2.txt');

            txtdata=txtfile.toString();
            done();
        });

        it('check valid data parsing', function(done) {
            var result = cms(txtdata);

            //console.log(result);
            expect(result).to.exist;
            done();
        });



        if('check to make sure it has all sections', function(done)) {




        });
    });


     describe('Test #2, testing only one section', function () {
        before(function(done) {
            var txtfile = loadFile('singleSectionDemo.txt');

            txtdata=txtfile.toString();
            done();
        });

        it('check valid data parsing', function(done) {
            var result = cms(txtdata);

            console.log(result);
            expect(result).to.exist;
            done();
        });
    });



});
