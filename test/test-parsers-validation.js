/*jshint expr: true*/
var fs = require('fs');
var expect = require('chai').expect;
var path = require('path');
var bb = require('../index.js');
var validator = require("../index.js").validator;

describe('Test CMS Parsing, from sample file', function () {
    before(function (done) {
        sampleFile = fs.readFileSync(__dirname + '/fixtures/cms/sample2.txt').toString();
        done();
    });
    it('find bad entries', function (done) {
        var obj = bb.parseText(sampleFile);
        //console.log(JSON.stringify(obj.data.results, null, 4));
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
