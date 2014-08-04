var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

//var txtToIntObj = require('../lib/parser/txtToIntObj/parser.js');
var txtToIntObj = require('../lib/parser/cms/cmsTxtToIntObj.js');
var objConverter = require('../lib/parser/cms/cmsObjConverter.js');
var txtdata;

//-----START: intermediate object testing --------------------------

//loads the file

function loadFile(filename) {
    var filepath = path.join(__dirname, 'fixtures/cms/' + filename);
    var txtfile = fs.readFileSync(filepath, 'utf-8');
    return txtfile;

}
//checks if the number titles is enough

function titleTest(result, titles) {
    var hasAllTitles = true;
    var resultKeys = Object.keys(result);
    //checking if keys ar eequa
    expect(resultKeys.length).to.equal(titles.length, "lengths are not the same");
    expect(result).to.have.keys(titles, "keys are not the same");
}

//Checking for bad keys(empty string or just a space)

function checkForBadKeys(result) {
    for (var key in result) {
        if (key === '') {
            return '';
        }
        if (key === ' ') {
            return ' ';
        }
        if (typeof result[key] === 'object') {
            checkForBadKeys(result[key]);
        }
    }
    return true;
}

/*This is a function that stores tests that should be met among many different
test files */

function sharedTests() {
    var result;
    beforeEach(function (done) {
        result = txtToIntObj.getIntObj(this.txtdata);
        done();
    });
    it('check for existence and type', function (done) {
        expect(result).to.exist;
        expect(result).to.be.an('object');
        done();
    });

    it('make sure intermediate format has all titles', function (done) {
        var titles = txtToIntObj.getTitles(this.txtdata);
        done();
    });

    it('make sure there are no bad keys', function (done) {
        var badKeysResult = checkForBadKeys(result);
        expect(badKeysResult).to.be.true;
        done();
    });
}

describe('Testing with original sample data', function () {
    before(function (done) {
        var txtfile = loadFile('sample2.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();

});

describe('Testing two sections(metadata & demographics)', function () {

    before(function (done) {
        var txtfile = loadFile('singleSectionDemo.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();

    it('check that there are only two titles', function (done) {
        var result = txtToIntObj.getIntObj(this.txtdata);

        var titles = txtToIntObj.getTitles(this.txtdata);
        var resultKeys = Object.keys(result);
        expect(resultKeys.length).to.equal(2);

        var expectedTitles = ['meta', 'demographic'];
        expect(result).to.have.keys(expectedTitles);
        done();
    });

});

describe('Testing File with only meta section', function () {

    before(function (done) {
        var txtfile = loadFile('metaOnly.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();

    it('check that there is only one title', function (done) {
        var result = txtToIntObj.getIntObj(this.txtdata);
        var titles = txtToIntObj.getTitles(this.txtdata);
        var resultKeys = Object.keys(result);
        expect(resultKeys.length).to.equal(1);
        var expectedTitles = ['meta'];
        expect(result).to.have.keys(expectedTitles);
        done();
    });

});

describe('Testing a different number of dashes(5)', function () {
    beforeEach(function (done) {
        var txtfile = loadFile('differentDashes.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();
});

describe('Testing file with beginning(meta) and end(claims)', function () {

    before(function (done) {
        var txtfile = loadFile('begAndEndSections.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();

    it('check that there is only two titles', function (done) {
        var result = txtToIntObj.getIntObj(this.txtdata);
        var titles = txtToIntObj.getTitles(this.txtdata);
        var resultKeys = Object.keys(result);
        expect(resultKeys.length).to.equal(2);
        var expectedTitles = ['meta', 'claim summary'];
        expect(result).to.have.keys(expectedTitles);
        done();
    });

    it('check that the sections are populated', function (done) {
        var result = txtToIntObj.getIntObj(this.txtdata);
        for (var key in result) {
            var sectionValueObj = result[key];
            var sectionValueObjKeys = Object.keys(sectionValueObj);
            expect(sectionValueObjKeys.length).to.be.greaterThan(0);
        }
        done();
    });
});

describe('Testing a file with empty sections', function () {

    before(function (done) {
        var txtfile = loadFile('emptySections.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();

    it('checks that the sections are empty', function (done) {
        var result = txtToIntObj.getIntObj(this.txtdata);
        var allSectionsAreEmpty = true;
        for (var key in result) {
            var obj = result[key];
            for (var sourceOrData in obj) {
                if (obj[sourceOrData] instanceof Array) {
                    if (obj[sourceOrData].length !== 0) {
                        allSectionAreEmpty = false;
                    }
                } else if (obj[sourceOrData] instanceof Object) {
                    var keys = Object.keys(obj[sourceOrData]);
                    if (keys.length > 0) {
                        allSectionsAreEmpty = false;
                    }
                }
            }
        }
        expect(allSectionsAreEmpty).equals(true,
            "parsing error, empty section parsed as not empty");
        done();
    });

});

describe('Testing a file with missing', function () {

    before(function (done) {
        var txtfile = loadFile('missingSections.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();
    it('checks that the right numbers of sections are present', function (done) {
        var result = txtToIntObj.getIntObj(this.txtdata);
        var resultKeys = Object.keys(result);
        var expectedKeys = ['meta',
            'demographic', 'self reported medical conditions', 'family medical history', 'plans'
        ];
        expect(result).to.have.keys(expectedKeys);
        done();
    });
});

describe('Test an empty file', function () {

    before(function (done) {
        var txtfile = loadFile('emptyFile.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();

});

describe('Test a file with no sources', function () {

    before(function (done) {
        var txtfile = loadFile('noSources.txt');
        var result = txtToIntObj.getIntObj(txtfile);
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();

});

describe('Test a file with only sources', function () {

    before(function (done) {
        var txtfile = loadFile('onlySources.txt');
        var result = txtToIntObj.getIntObj(txtfile);
        this.txtdata = txtfile.toString();
        done();
    });

    sharedTests();

    it('checks that only type of children are sources', function (done) {
        var result = txtToIntObj.getIntObj(this.txtdata);
        for (var key in result) {
            var sectionObj = result[key];
            if (result[key] instanceof Array) {
                var childKeys = Object.keys(result[key]);
                expect(childKeys).to.have.length(1);
            }
        }
        done();
    });

});

//-------- END: Intermediate file testing -----

describe('Test file parsing beginning to end', function () {

    before(function (done) {
        var txtfile = loadFile('sample2.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    it('checks if the file is converted', function (done) {
        var outputFilename = __dirname + '/fixtures/cms/bbModel.json';
        var intObj = txtToIntObj.getIntObj(this.txtdata);

        var bbModel = objConverter.convertToBBModel(intObj);
        //console.log(JSON.stringify(bbModel.data.demographics, null, 4));
        fs.writeFile(outputFilename, JSON.stringify(bbModel, null, 4), function (err) {
            if (err) {
                console.log(err);
                done();
            } else {
                // console.log("JSON saved to " + outputFilename);
                done();
            }
        });
    });

});

describe('Test insurance for given sample file', function () {

    before(function (done) {
        var txtfile = loadFile('sample2.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    it('checks for the correct number of objects converted', function (done) {
        var intObj = txtToIntObj.getIntObj(this.txtdata);
        var bbModel = objConverter.convertToBBModel(intObj);
        var totalPlans = bbModel.data.insurance.length;
        expect(totalPlans).to.equal(6);
        done();

    });

});

describe('Test claims for given sample file', function () {

    before(function (done) {
        var txtfile = loadFile('sample2.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    it('checks for the correct number of objects converted', function (done) {
        var intObj = txtToIntObj.getIntObj(this.txtdata);
        var bbModel = objConverter.convertToBBModel(intObj);
        var totalPlans = bbModel.data.claims.length;
        expect(totalPlans).to.equal(5);
        done();

    });

});

describe('Test vitals for given sample file', function () {

    before(function (done) {
        var txtfile = loadFile('sample2.txt');
        this.txtdata = txtfile.toString();
        done();
    });

    it('checks date types of vitals', function (done) {
        var intObj = txtToIntObj.getIntObj(this.txtdata);
        var bbModel = objConverter.convertToBBModel(intObj);
        var vitals = bbModel.data.vitals;
        for (var key in vitals) {
            var vital = vitals[key];
            for (var z in vital.date) {
                expect(vital.date[z].date).to.be.a('string');
            }
        }
        done();

    });

});
