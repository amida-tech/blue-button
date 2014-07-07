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
        var valid = validator.validateDocumentModel(obj);
        var errors = validator.getLastError();
        done();
    });

});




