/*jshint expr: true*/
var fs = require('fs');
var expect = require('chai').expect;
var path = require('path');
var bb = require('../index.js');
var validator = require("../index.js").validator;

describe('Test CCDA from sample file', function () {
    before(function (done) {
        sampleFile = fs.readFileSync(__dirname + '/fixtures/files/CCD_1.xml').toString();
        done();
    });
    //commenting out this out for now, because apparently some interval work seems to be in progress
    xit('find bad entries', function (done) {
        var obj = bb.parseString(sampleFile);
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

describe('Test CMS Parsing, from sample file', function () {
    before(function (done) {
        sampleFile = fs.readFileSync(__dirname + '/fixtures/cms/sample2.txt').toString();
        done();
    });
    it('find bad entries', function (done) {
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

describe('Test CMS Parsing, isabella jones cms version', function () {
    before(function (done) {
        sampleFile = fs.readFileSync(__dirname + '/fixtures/cms/jones.cms.txt').toString();
        done();
    });
    it('Find bad entries', function (done) {
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
