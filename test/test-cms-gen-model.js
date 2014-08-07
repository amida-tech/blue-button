/*jshint expr: true*/

/*this is a robust test of all sections from teh sample file and from a artificially
/manufactured file from Isabella Jones */
var fs = require('fs');
var expect = require('chai').expect;
var path = require('path');
var bb = require('../index.js');
var validator = require("../index.js").validator;
var objConverter = require('../lib/parser/cms/cmsObjConverter.js');

describe('CMS: Original sample.txt version', function () {
    before(function (done) {
        sampleFile = fs.readFileSync(__dirname + '/fixtures/cms/sample2.txt').toString();
        bbObj = bb.parseText(sampleFile);
        done();
    });

    it('validate', function (done) {
        var valid = validator.validateDocumentModel(bbObj);
        if (!valid) {
            var errors = validator.getLastError();
            for (var x in errors.errors) {
                console.log(errors.errors[x]);
            }
        }
        expect(valid).to.be.true;
        done();
    });
    /*since validator doesn't actually count the number of objects parsed,
    the number of objects per section was tested without the validator. */

    it('Test meta description is present in data model', function (done) {
        expect(bbObj.meta).to.exist;
        expect(bbObj.meta.type).to.equal('cms');
        done();
    });

    it('Test number of demographics fields in object', function (done) {
        var keys = Object.keys(bbObj.data.demographics).length;
        expect(keys).to.equal(5);
        done();
    });

    it('Test number of objects in problems', function (done) {
        var keys = Object.keys(bbObj.data.problems).length;
        expect(keys).to.equal(2);
        done();
    });

    it('Test number of objects in allergies', function (done) {
        var keys = Object.keys(bbObj.data.allergies).length;
        expect(keys).to.equal(2);
        done();
    });

    it('Test number of objects in immunizations', function (done) {
        var keys = Object.keys(bbObj.data.immunizations).length;
        expect(keys).to.equal(3);
        done();
    });

    it('Test number of objects in vitals', function (done) {
        var keys = Object.keys(bbObj.data.vitals).length;
        expect(keys).to.equal(3);
        done();
    });

    it('Test number of objects in medications', function (done) {
        var keys = Object.keys(bbObj.data.medications).length;
        expect(keys).to.equal(2);
        done();
    });

    it('Test number of objects in insurance', function (done) {
        var keys = Object.keys(bbObj.data.insurance).length;
        expect(keys).to.equal(6);
        done();
    });

    it('Test number of objects in claims', function (done) {
        var keys = Object.keys(bbObj.data.claims).length;
        expect(keys).to.equal(5);
        done();
    });

    xit('Test number of objects in providers', function (done) {
        var keys = Object.keys(bbObj.data.providers).length;
        expect(keys).to.equal(3);
        var fieldArray = [3, 3, 4];
        /* this is to check if field size of each provider section object element
        if parsed correctly */

        for (var k in bbObj.data.providers) {
            var sectionSize = bbObj.data.poviders(k).length;
            var index = fieldArray.indexOf(sectionSize);
            expect(index).to.not.equal(-1);
            fieldArray.splice(index, 1);
        }
        expect(fieldArray.length).to.equal(0);
        done();
    });

});

//This is a temporary test for development, should definitely be removed later
/*
describe('123', function () {
    before(function (done) {
        sampleFile = fs.readFileSync(__dirname + '/fixtures/cms/sample2.txt').toString();
        bbObj = bb.parseText(sampleFile);
        console.log('sample2.txt');
        console.log(JSON.stringify(bbObj, null, 4));
        done();
    });

    it('validate', function (done) {
        var obj = bb.parseText(sampleFile);
        var valid = validator.validateDocumentModel(obj);
        if (!valid) {
            var errors = validator.getLastError();
            for (var x in errors.errors) {
                console.log(errors.errors[x]);
            }
        }
        expect(valid).to.be.true;
        done();
    });

});
*/

describe('CMS: jones.cms.txt file', function () {
    before(function (done) {
        sampleFile = fs.readFileSync(__dirname + '/fixtures/cms/jones.cms.txt').toString();
        bbObj = bb.parseText(sampleFile);
        //console.log('jones.cms.txt');
        //console.log(JSON.stringify(bbObj, null, 4));
        done();
    });
    it('validate', function (done) {
        var valid = validator.validateDocumentModel(bbObj);

        if (!valid) {
            var errors = validator.getLastError();
            console.log(errors);
            for (var x in errors.errors) {
                console.log(errors.errors[x]);
            }
        }
        expect(valid).to.be.true;
        done();
    });

    it('Test meta description is present in data model', function (done) {
        expect(bbObj.meta).to.exist;
        expect(bbObj.meta.type).to.equal('cms');
        done();
    });

    it('Test number of demographics fields in object', function (done) {
        var keys = Object.keys(bbObj.data.demographics).length;
        expect(keys).to.equal(5);
        done();
    });

    it('Test number of objects in problems', function (done) {
        var keys = Object.keys(bbObj.data.problems).length;
        expect(keys).to.equal(2);
        done();
    });

    it('Test number of objects in allergies', function (done) {
        var keys = Object.keys(bbObj.data.allergies).length;
        expect(keys).to.equal(3);
        done();
    });

    it('Test number of objects in immunizations', function (done) {
        var keys = Object.keys(bbObj.data.immunizations).length;
        expect(keys).to.equal(4);
        done();
    });

    it('Test number of objects in results', function (done) {
        var keys = Object.keys(bbObj.data.results).length;
        var subResultsKeys = bbObj.data.results[0].results.length;
        expect(keys).to.equal(1);
        expect(subResultsKeys).to.equal(3);
        done();
    });

    it('Test number of objects in vitals', function (done) {
        var keys = Object.keys(bbObj.data.vitals).length;
        expect(keys).to.equal(6);
        done();
    });

    it('Test number of objects in medications', function (done) {
        var keys = Object.keys(bbObj.data.medications).length;
        expect(keys).to.equal(2);
        done();
    });

    it('Test number of objects in insurance', function (done) {
        var keys = Object.keys(bbObj.data.insurance).length;
        expect(keys).to.equal(5);
        done();
    });

    xit('Test number of objects in providers', function (done) {
        var keys = Object.keys(bbObj.data.provider).length;
        expect(keys).to.equal(10);

        var fourFields = 0;
        var threeFields = 0;

        for (var k in bbObj.data.providers) {
            var sectionSize = bbObj.data.poviders(k).length;
            if (sectionSize === 3) {
                threeFields++;
            } else if (sectionSize === 4) {
                fourFields++;
            }
        }
        expect(fourFields).to.equal(8);
        expect(threeFields).to.equal(2);
        done();
    });

});

describe('Testing claims date extrapolation', function () {

    before(function (done) {
        testClaimObj = {
            "payer": [
                "medicare"
            ],
            "number": "12345678900000VAA",
            "lines": [{
                "line": "1",
                "date_time": {
                    "high": {
                        "date": "2012-09-22T00:00:00.000Z",
                        "precision": "day"
                    }
                },
                "revenue": {
                    "code": "0250",
                    "description": "General Classification PHARMACY"
                },
                "quantity": {
                    "value": 1,
                    "unit": "line"
                },
                "charges": {
                    "price_billed": "$14.30",
                    "insurance_paid": "$14.30",
                    "patient_responsibility": "$0.00"
                }
            }, {
                "line": "2",
                "date_time": {
                    "low": {
                        "date": "2012-09-25T00:00:00.000Z",
                        "precision": "day"
                    }
                },
                "revenue": {
                    "code": "0320",
                    "description": "General Classification DX X"
                },
                "procedure": {
                    "code": "74020",
                    "description": "Radiologic Examination, Abdomen; Complete, Including Decubitus And/Or Erect Views"
                },
                "quantity": {
                    "value": 1,
                    "unit": "line"
                },
                "charges": {
                    "price_billed": "$175.50",
                    "insurance_paid": "$175.50",
                    "patient_responsibility": "$0.00"
                }
            }, {
                "line": "3",
                "date_time": {
                    "low": {
                        "date": "2012-09-22T00:00:00.000Z",
                        "precision": "day"
                    }
                },
                "revenue": {
                    "code": "0450",
                    "description": "General Classification EMERG ROOM"
                },
                "procedure": {
                    "code": "99283",
                    "description": "Emergency Department Visit For The Evaluation And Management Of A Patient, Which Requires Th"
                },
                "quantity": {
                    "value": 1,
                    "unit": "line"
                },
                "modifier": [{
                    "code": "25",
                    "description": "Significant, Separately Identifiable Evaluation And Management Service By The Same Physician On"
                }],
                "charges": {
                    "price_billed": "$315.00",
                    "insurance_paid": "$315.00",
                    "patient_responsibility": "$0.00"
                }
            }, {
                "line": "4",
                "revenue": {
                    "code": "0001",
                    "description": "Total Charges"
                },
                "date_time": {
                    "point": {
                        "date": "2012-09-22T00:00:00.000Z",
                        "precision": "day"
                    }
                },
                "quantity": {
                    "value": 0,
                    "unit": "line"
                },
                "charges": {
                    "price_billed": "$504.80",
                    "insurance_paid": "$504.80",
                    "patient_responsibility": "$0.00"
                }
            }],
            "charges": {
                "price_billed": "$504.80",
                "insurance_paid": "$504.80",
                "provider_paid": "$126.31",
                "patient_responsibility": "$38.84"
            },
            "type": [
                "medicare Outpatient"
            ],
            "diagnosis": [{
                "code": "56400"
            }, {
                "code": "7245"
            }, {
                "code": "V1588"
            }]
        };
        done();
    });

    it('missing dates in main claim body, but dates are in claim line', function (done) {
        extrapolateDatesFromLines(testClaimObj.lines, testClaimObj);
        //console.log('extrapolated date times');
        //console.log(testClaimObj.date_time);
        done();
    });
    //just copy and pasted from original, didn't want to deal with exporting to test a single function.
    function extrapolateDatesFromLines(claimLines, returnChildObj) {
        var lowTime;
        var highTime;
        var pointTime;
        if (returnChildObj.date_time) {
            if (returnChildObj.date_time.low) {
                lowTime = returnChildObj.date_time.low;
            }
            if (returnChildObj.date_time.high) {
                highTime = returnChildObj.date_time.high;
            }
            if (returnChildObj.date_time.point) {
                pointTime = returnChildObj.date_time.point;
            }
        }
        for (var x in claimLines) {
            var claimLineObj = claimLines[x];
            if (claimLineObj.date_time) {
                /*if the main claim body has undefined dates, populate it with
            claim lines date */
                if (claimLineObj.date_time.low && lowTime === undefined) {
                    lowTime = claimLineObj.date_time.low;
                }
                if (claimLineObj.date_time.high && highTime === undefined) {
                    highTime = claimLineObj.date_time.high;
                }
                if (claimLineObj.date_time.point && pointTime === undefined) {
                    pointTime = claimLineObj.date_time.point;
                }
                //if the claim lines are defined, then update them with better/more accurate information
                if (lowTime !== undefined && claimLineObj.date_time.low) {
                    var lowDateTime = new Date(lowTime.date);
                    var lineLowDateTime = new Date(claimLineObj.date_time.low.date);
                    if (lineLowDateTime < lowDateTime) {
                        lowTime = claimLineObj.date_time.low;
                    }
                }
                if (highTime !== undefined && claimLineObj.date_time.high) {
                    var highDateTime = new Date(highTime.date);
                    var lineHighDateTime = new Date(claimLineObj.date_time.high.date);
                    if (lineHighDateTime > highDateTime) {
                        highTime = claimLineObj.date_time.high;
                    }
                }
                //on the assumption that the most recent service date is most relevant
                if (pointTime !== undefined && claimLineObj.date_time.point) {
                    var pointDateTime = new Date(pointTime.date);
                    var linePointDateTime = new Date(claimLineObj.date_time.point.date);
                    if (pointDateTime > pointDateTime) {
                        pointTime = claimLineObj.date_time.point;
                    }
                }
            }
        }
        //assign the newly discovered times to the main claims body object
        if (returnChildObj.date_time === undefined) {
            returnChildObj.date_time = {};
        }
        if (lowTime) {
            returnChildObj.date_time.low = lowTime;
        }
        if (highTime) {
            returnChildObj.date_time.high = highTime;
        }
        if (pointTime) {
            returnChildObj.date_time.point = pointTime;
        }

    }

});
