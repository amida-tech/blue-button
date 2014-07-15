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
        //console.log(JSON.stringify(obj, null, 4));
        var valid = validator.validateDocumentModel(obj);
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

});
