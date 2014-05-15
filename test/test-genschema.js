var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');

var component = require('../lib/parser/ccda/component');
var processor = require('../lib/parser/ccda/processor');
var cleanup = require('../lib/parser/ccda/cleanup');
var bb = require('../index');

// required is not checked currently
var checkSchemaConformity = function checkSchemaConformity(obj, schema, path) {
    var msg = path + ' is not schema conformant';
    if (Array.isArray(obj)) {
        assert.isArray(schema, msg);
        var n = obj.length;
        var elemSchema = schema[0];
        for (var i=0; i<n; ++i) {
            checkSchemaConformity(obj[i], elemSchema, path + '[' + i + ']');
        }
    } else if (obj instanceof Date) {
        assert.equal("datetime", schema, msg);
    } else if (typeof obj === 'object') {
        assert.isObject(schema, msg);
        Object.keys(obj).forEach(function(key) {
            var e = obj[key];
            var s = schema[key];
            assert.isDefined(s, msg + " (" + key+ ")");
            if (e) {
                checkSchemaConformity(e, s, path + '.' + key);
            }
        });
    } else {
        assert.equal(typeof obj, schema, msg);
    }
};

describe('component.generateSchema on test component', function() {
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
            single_required: 'string',
            single_optional: 'string',
            multi_required: ['string'],
            multi_optional: ['number']
        };
        
        expectedTBExtracted = {
            single_required: 'string',
            addl_a: 'string',
            addl_b: ['string']
        };
        
        expectedChild = {
            single_required: 'boolean',
            single_optional: 'string',
            multi_required: ['number'],
            multi_optional: ['string'],
            child_multiple: [expectedGChild],
            extract: expectedTBExtracted
        };
        
        expected = {
            single_required: 'string',
            single_optional: 'datetime',
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
    
    it('replaceWithField', function(done) {
        test.cleanupStep(cleanup.replaceWithField('child_required'));
        expected = expectedChild;
        
        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });
    
    it('replaceWithField (array)', function(done) {
        testChild.cleanupStep(cleanup.replaceWithField('multi_optional'));
        expected = expected.multi_optional;
        
        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });
});

describe('component.generateSchema on CCD_1', function() {
    var ccd = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, 'fixtures/files/CCD_1.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, function(err, result) {
            ccd = result.toJSON();
            done();
        });
    });

    it('ccd exists', function(done) {
        expect(ccd).to.exist;
        done();
    });
    
    it('erreneous component', function(done) {
        bb.generateSchema({component: 'no component'}, function(err, result) {
            expect(err).to.exist;
            done();
        });
    });

    it('social history', function(done) {
        bb.generateSchema({component: "ccda_socialHistory"}, function(err, schema) {
            expect(schema).to.exist;
            checkSchemaConformity(ccd.socialHistory, schema, "socialHistory");
            done();
        });
    });
});

