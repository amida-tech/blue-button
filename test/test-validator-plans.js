/*jshint expr: true*/
var fs = require('fs');
var expect = require('chai').expect;
var path = require('path');

var validator = require('../lib/validator/validator.js');
describe('Test Plan Of Care', function () {
    before(function (done) {
        testPlan_Of_Care = require(__dirname + '/fixtures/validator/samples/testPlan_Of_Care.js');
        done();
    });
    it('regular plan of care from CCD_1', function (done) {
        var regPlanOfCare = testPlan_Of_Care.test_plan_of_care_list.regular1;
        var valid = validator.validateSectionObj(regPlanOfCare, 'plan_of_care');
        expect(valid).to.true;
        done();
    });
});