var expect = require('chai').expect;

var component = require('../lib/parser/ccda/component');
var processor = require('../lib/parser/ccda/processor');
var cleanup = require('../lib/parser/ccda/cleanup');

describe('component.generateSchema', function() {
    var testGChild = null;
    var testChild = null;
    var test = null;
    var expectedGChild = null;
    var expectedChild = null;
    var expected = null;
    var expectedTBExtracted = null;

    before(function(done) {
        testGChild = component.define('testGChild');
        testGChild.fields([
            ['single_required', '1..1', 'req'],
            ['single_optional', '0..1', 'opt', processor.asString],
            ['multi_required', '1..*', 'multreq'],
            ['multi_optional', '0..*', 'multopt', processor.asFloat]
        ]);

        var testTBExtracted = component.define('testTBExtracted');
        testTBExtracted.fields([
            ['single_required', '1..1', 'req'],
            ['addl_a', '0..1', 'addla', processor.asString],
            ['addl_b', '1..*', 'addlb']
        ]);
        
        testChild = component.define('testChild');
        testChild.fields([
            ['single_required', '1..1', 'req', processor.asBoolean],
            ['single_optional', '0..1', 'opt'],
            ['multi_required', '1..*', 'multreq', processor.asFloat],
            ['multi_optional', '0..*', 'multopt'],
            ['child_multiple', '0..*', 'multchild', testGChild],
            ['extract', '1..1', 'extract', testTBExtracted]
        ]);

        test = component.define('test');
        test.fields([
            ['child_required', '1:1', '//document/reqchild', testChild],
            ['single_required', '1..1', '//document/req'],
            ['single_optional', '0..1', '//document/opt', processor.asTimestamp]
        ]);
    
        expectedGChild = {
            single_required: {type: 'string', required: true},
            single_optional: {type: 'string', required: false},
            multi_required: [{type: 'string', 'required': true}],
            multi_optional: [{type: 'number', 'required': false}]
        };
        
        expectedTBExtracted = {
            single_required: {type: 'string', required: true},
            addl_a: {type: 'string', 'required': false},
            addl_b: [{type: 'string', 'required': true}]
        };
        
        expectedChild = {
            single_required: {type: 'boolean', required: true},
            single_optional: {type: 'string', required: false},
            multi_required: [{type: 'number', 'required': true}],
            multi_optional: [{type: 'string', 'required': false}],
            child_multiple: [expectedGChild],
            extract: expectedTBExtracted
        };
        
        expected = {
            single_required: {type: 'string', required: true},
            single_optional: {type: 'datetime', required: false},
            child_required: expectedChild
        };
        
        done();
    });
        
    it('basic', function(done) {
        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });
    
    it('removeField', function(done) {
        testGChild.cleanupStep(cleanup.removeField('single_required'));
        testChild.cleanupStep(cleanup.removeField('multi_required'));
        delete expectedGChild.single_required;
        delete expectedChild.multi_required;
        
        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });

    it('extractAllFields', function(done) {
        testChild.cleanupStep(cleanup.extractAllFields(['extract']));
        delete expectedChild.extract;
        expectedChild.addl_a = expectedTBExtracted.addl_a;
        expectedChild.addl_b = expectedTBExtracted.addl_b;
        
        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });
    
    
});

