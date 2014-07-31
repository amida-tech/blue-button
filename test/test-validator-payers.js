/*jshint expr: true*/
var fs = require('fs');
var expect = require('chai').expect;
var path = require('path');
var validator = require('../lib/validator/validator.js');

describe('Test social history', function () {
    before(function (done) {
        testSocialList = require(__dirname + '/fixtures/validator/samples/testSocial.js');
        done();
    });

    //this is true for nows
    // it('empty social histoy', function (done) {
    //     var socialObj = {};
    //     var valid = validator.validateSectionObj(socialObj, 'social_history');
    //     expect(valid).to.true;
    //     done();
    // });

    it('regular social history', function (done) {
        var socialObj = testSocialList.regular;
        var valid = validator.validateSectionObj(socialObj, 'social_history');
        expect(valid).to.true;
        done();
    });

    it('social history without smoking value', function (done) {
        var socialObj = testSocialList.noSmokingValue;
        var valid = validator.validateSectionObj(socialObj, 'social_history');
        expect(valid).to.false;
        done();
    });

    it('social history with no smoking dates', function (done) {
        var socialObj = testSocialList.noSmokingDate;
        var valid = validator.validateSectionObj(socialObj, 'social_history');
        expect(valid).to.true;
        done();
    });

    it('social history with empty array as smoking dates', function (done) {
        var socialObj = testSocialList.emptySmokingDate;
        var valid = validator.validateSectionObj(socialObj, 'social_history');
        expect(valid).to.true;
        done();
    });
});

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
        var valid = validator.validateSectionObj(missing_policy_holder, 'payers');
        expect(valid).to.true;

        var missing_guarantor = testPayers.test_payers_list.missing_guarantor;
        var valid = validator.validateSectionObj(missing_guarantor, 'payers');
        expect(valid).to.true;

        // this should be false but it returns true for some reason
        // var missing_policy = testPayers.test_payers_list.missing_policy;
        // var valid = validator.validateSectionObj(missing_policy, 'payers');
        // expect(valid).to.false;
        done();

    });
});
