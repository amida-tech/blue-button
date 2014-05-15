var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var component = require('../lib/parser/ccda/component');
var xml = require('../lib/xml');

var testChildComponent = component.define('testChild');
testChildComponent.fields([
    ['single_required', '1..1', 'req'],
    ['single_optional', '0..1', 'opt'],
    ['multi_required', '1..*', 'multreq'],
    ['multi_optional', '0..*', 'multopt']
]);

var testComponent = component.define('test');
testComponent.fields([
    ['child_required', '1:1', '//document/reqchild', testChildComponent],
    ['single_required', '1..1', '//document/req'],
    ['single_optional', '0..1', '//document/opt']
]);

describe('component.generateSchema', function() {
    it('straight forward', function(done) {
        var schema = testComponent.generateSchema();
        var expectedTestChild = {
            single_required: {type: 'string', required: true},
            single_optional: {type: 'string', required: false},
            multi_required: [{type: 'string', 'required': true}],
            multi_optional: [{type: 'string', 'required': false}]
        };
        var expectedTest = {
            single_required: {type: 'string', required: true},
            single_optional: {type: 'string', required: false},
            child_required: expectedTestChild
        };
        expect(schema).to.deep.equal(expectedTest);
        done();
    });
});

