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
        for (var i = 0; i < n; ++i) {
            checkSchemaConformity(obj[i], elemSchema, path + '[' + i + ']');
        }
    } else if (obj instanceof Date) {
        assert.equal("string", schema, msg);
    } else if (typeof obj === 'object') {
        assert.isObject(schema, msg);
        Object.keys(obj).forEach(function (key) {
            var e = obj[key];
            var s = schema[key];
            assert.isDefined(s, msg + " (" + key + ")");
            if (e) {
                checkSchemaConformity(e, s, path + '.' + key);
            }
        });
    } else {
        assert.equal(typeof obj, schema, msg);
    }
};

var checkSchemaNotNull = function (schema, path) {
    assert.ok(schema, path + ' is null/undefined');
    if (Array.isArray(schema)) {
        checkSchemaNotNull(schema[0], path + '[]');
    } else if (typeof schema === 'object') {
        Object.keys(schema).forEach(function (key) {
            checkSchemaNotNull(schema[key], path + '.' + key);
        });
    } else {
        assert.isTrue(['string', 'boolean', 'datetime', 'number'].indexOf(schema) >= 0, 'unknown type ' + schema + ' in ' + path);
    }
};

describe('component.generateSchema on test component', function () {
    var testGChild = null;
    var testChild = null;
    var test = null;
    var expectedGChild = null;
    var expectedChild = null;
    var expected = null;
    var expectedTBExtracted = null;

    before(function (done) {
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

    it('basic', function (done) {
        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });

    it('removeField', function (done) {
        testGChild.cleanupStep(cleanup.removeField('single_required'));
        testChild.cleanupStep(cleanup.removeField('multi_required'));
        delete expectedGChild.single_required;
        delete expectedChild.multi_required;

        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });

    it('extractAllFields', function (done) {
        testChild.cleanupStep(cleanup.extractAllFields(['extract']));
        delete expectedChild.extract;
        expectedChild.addl_a = expectedTBExtracted.addl_a;
        expectedChild.addl_b = expectedTBExtracted.addl_b;

        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });

    it('replaceWithField', function (done) {
        test.cleanupStep(cleanup.replaceWithField('child_required'));
        expected = expectedChild;

        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });

    it('replaceWithField (array)', function (done) {
        testChild.cleanupStep(cleanup.replaceWithField('multi_optional'));
        expected = expected.multi_optional;

        var schema = test.generateSchema();
        expect(schema).to.deep.equal(expected);
        done();
    });
});

xdescribe('component.generateSchema on CCD_1', function () {
    var ccd = null;

    before(function (done) {
        var filepath = path.join(__dirname, 'fixtures/files/CCD_1.xml');
        var xml = fs.readFileSync(filepath, 'utf-8').toString();
        ccd = bb.parseString(xml, {}).data;
        done();
    });

    it('ccd exists', function (done) {
        expect(ccd).to.exist;
        done();
    });

    it('erreneous component', function (done) {
        var r = bb.generateSchema('no component');
        expect(r).to.not.exist;
        done();
    });

    it('social history', function (done) {
        var schema = bb.generateSchema("ccda_social_history");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.social_history, schema, "social_history");
        checkSchemaNotNull(schema, "social_history");
        done();
    });

    it('demographics', function (done) {
        var schema = bb.generateSchema("ccda_demographics");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.demographics, schema, "demographics");
        checkSchemaNotNull(schema, "demographics");
        done();
    });

    it('procedures', function (done) {
        var schema = bb.generateSchema("ccda_procedures");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.procedures, schema, "procedures");
        checkSchemaNotNull(schema, "procedures");
        done();
    });

    it('encounters', function (done) {
        var schema = bb.generateSchema("ccda_encounters");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.encounters, schema, "encounters");
        checkSchemaNotNull(schema, "encounters");
        done();
    });

    it('allergies', function (done) {
        var schema = bb.generateSchema("ccda_allergies");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.allergies, schema, "allergies");
        checkSchemaNotNull(schema, "allergies");
        done();
    });

    it('medications', function (done) {
        var schema = bb.generateSchema("ccda_medications");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.medications, schema, "medications");
        checkSchemaNotNull(schema, "medications");
        done();
    });

    it('immunizations', function (done) {
        var schema = bb.generateSchema("ccda_immunizations");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.immunizations, schema, "immunizations");
        checkSchemaNotNull(schema, "immunizations");
        done();
    });

    it('problems', function (done) {
        var schema = bb.generateSchema("ccda_problems");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.problems, schema, "problems");
        checkSchemaNotNull(schema, "problems");
        done();
    });

    it('results', function (done) {
        var schema = bb.generateSchema("ccda_results");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.results, schema, "results");
        checkSchemaNotNull(schema, "results");
        done();
    });

    it('vitals', function (done) {
        var schema = bb.generateSchema("ccda_vitals");
        expect(schema).to.exist;
        checkSchemaConformity(ccd.vitals, schema, "vitals");
        checkSchemaNotNull(schema, "vitals");
        done();
    });
});
