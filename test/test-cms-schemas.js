//tests if cms specific schemas have the right format
var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');

var bb = require('../index');
var validator = bb.validator;
var cmsSchema = require('../lib/parser/cms/cmsSpecificSchema');

describe('Test cms specific schema', function () {

    it('verify insurance schema', function (done) {
        var schema = cmsSchema;
        var valid = validator.validateSectionObj(schema['insurance'], 'insurance');
        var error = validator.getLastError();
        expect(error.errors.length).to.equal(2);

        done();
    });

    it('verify claims schema', function (done) {
        var schema = cmsSchema;
        var valid = validator.validateSectionObj(schema['claims'], 'claims');
        var error = validator.getLastError();
        done();
    });

});
