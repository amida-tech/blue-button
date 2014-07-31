/*jshint expr: true*/
var fs = require('fs');
var expect = require('chai').expect;
var path = require('path');
var validator = require('../lib/validator/validator.js');

describe('Test Payers', function () {
    before(function (done) {
        testPayers = require(__dirname + '/fixtures/validator/samples/testPayers.js');
        done();
    });

    it('regular payers from CCD_1', function (done) {
        var regPayers = testPayers.test_payers_list.regular1;
        var valid = validator.validateSectionObj(regPayers, 'payers');
        expect(valid).to.true;

        var missing_policy_holder = testPayers.test_payers_list.missing_policy_holder;
        valid = validator.validateSectionObj(missing_policy_holder, 'payers');
        expect(valid).to.true;

        var missing_guarantor = testPayers.test_payers_list.missing_guarantor;
        valid = validator.validateSectionObj(missing_guarantor, 'payers');
        expect(valid).to.true;

        var missing_policy = testPayers.test_payers_list.missing_policy;
        valid = validator.validateSectionObj(missing_policy, 'payers');
        expect(valid).to.false;
        done();

    });
});
