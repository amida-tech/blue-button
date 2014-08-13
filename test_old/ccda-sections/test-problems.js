var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var assert = chai.assert;

var fs = require('fs');
var path = require('path');

var bb = require('../../index');

var problems;

var loadRecord = function (done) {
    var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Problems.xml');
    var xml = fs.readFileSync(filepath, 'utf-8');

    problems = bb.parseString(xml, {
        component: 'ccda_problems'
    }).data;
    done();
};

//TODO:  Implement full CCDA comparison when ready.

describe('Problems - Snippet Comparison', function () {

    before(function (done) {
        if (problems === undefined) {
            loadRecord(function () {
                done();
            });
        } else {
            done();
        }
    });

    xit('Deep Equality Check', function (done) {
        expect(problems).to.exist;
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Problems.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedProblems = JSON.parse(json2Read);
        expect(problems).to.deep.equal(expectedProblems);
        done();
    });

    it('Shallow Equality Check', function (done) {
        //console.log(JSON.stringify(problems, null, 4));
        expect(problems).to.exist;
        expect(problems).to.exist;
        expect(problems).to.have.length(2);
        done();
    });
});

describe('Problems - Schema Conformance', function () {

    before(function (done) {
        if (problems === undefined) {
            loadRecord(function () {
                done();
            });
        } else {
            done();
        }
    });

    it('Basic Object Structure', function (done) {
        //assert.isObject(problems, 'Main item should be object');
        assert.isArray(problems, 'Sub object should be array.');
        done();

    });

    it('Problem Structure - Date', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            assert.isDefined(currentProblem.date, 'Date should exist');
            assert.isArray(currentProblem.date, 'Date should be an array');
            assert.ok(currentProblem.date.length < 3, 'Date optional, max length of two');

            for (var ii in currentProblem.date) {
                var currentDate = currentProblem.date[ii];
                assert.ok(currentDate.date.getDate(), 'Date should be parseable');
                assert.isString(currentDate.precision, 'Precision should be a string');
                assert.ok(currentDate.precision.length > 0, 'Precision should have content');
                assert.includeMembers(['year', 'month', 'day', 'hour', 'minute', 'second', 'subsecond'], new Array(currentDate.precision), 'Precision should be valid');
            }
        }
        done();
    });

    it('Problem Structure - Identifiers', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            assert.isDefined(currentProblem.identifiers, 'Identifier should exist');
            assert.isArray(currentProblem.identifiers, 'Identifier should be an array');
            assert.ok(currentProblem.identifiers.length > 0, 'Identifier required.');

            for (var ii in currentProblem.identifiers) {
                var currentId = currentProblem.identifiers[ii];
                assert.isString(currentId.identifier, 'Identifier should be a string');
                assert.ok(currentId.identifier.length > 0, 'Identifier should have content');
            }
        }
        done();
    });

    it('Problem Structure - Identifiers', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            assert.isDefined(currentProblem.identifiers, 'Identifier should exist');
            assert.isArray(currentProblem.identifiers, 'Identifier should be an array');
            assert.ok(currentProblem.identifiers.length > 0, 'Identifier required.');

            for (var ii in currentProblem.identifiers) {
                var currentId = currentProblem.identifiers[ii];
                assert.isString(currentId.identifier, 'Identifier should be a string');
                assert.ok(currentId.identifier.length > 0, 'Identifier should have content');
                //TODO:  Add assertions if extension comes in, and snippets to test.
            }
        }
        done();
    });

    it('Problem Structure - Negation', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            assert.isDefined(currentProblem.negation_indicator, 'Indicator should exist');
            assert.isNotNull(currentProblem.negation_indicator, 'Indicator should not be null');
            assert.isBoolean(currentProblem.negation_indicator, 'Indicator should be boolean');
        }
        done();
    });

    it('Problem Structure - Name', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            assert.isDefined(currentProblem.name, 'Name should exist');
            assert.isString(currentProblem.name, 'Name should be a string');
            assert.ok(currentProblem.name.length > 0, 'Name required.');
        }
        done();
    });

    it('Problem Structure - Code', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            assert.isDefined(currentProblem.code, 'Code should exist');
            assert.isString(currentProblem.code, 'Code should be a string');
            assert.ok(currentProblem.code.length > 0, 'Code required.');
        }
        done();
    });

    it('Problem Structure - Code system', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            assert.isDefined(currentProblem.code_system_name, 'Code system should exist');
            assert.isString(currentProblem.code_system_name, 'Code system should be a string');
            assert.ok(currentProblem.code_system_name.length > 0, 'Code system required.');
            assert.includeMembers(['SNOMED CT'], new Array(currentProblem.code_system_name), 'System should be valid coding system');
        }
        done();
    });

    it('Problem Structure - Onset Age', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            if (currentProblem.onset_age) {
                assert.isString(currentProblem.onset_age, 'Age should be a string');
                assert.ok(Number(currentProblem.onset_age) !== "NaN", 'Age should be a number');
                assert.isDefined(currentProblem.onset_age_unit, 'Age should have units with it');
            }
        }
        done();
    });

    it('Problem Structure - Onset Age Unit', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            if (currentProblem.onset_age_unit) {
                assert.isDefined(currentProblem.onset_age_unit, 'Unit should have age with it');
                assert.isString(currentProblem.onset_age_unit, 'Age Units should be a string');
                assert.includeMembers(['Year', 'Month', 'Day', 'Week', 'Minute', 'Hour', 'Second', 'Subsecond'], new Array(currentProblem.onset_age_unit), 'Age unit should be known value');
            }
        }
        done();
    });

    it('Problem Structure - Status', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            if (currentProblem.status) {
                assert.isString(currentProblem.status, 'Status should be a string');
                assert.ok(currentProblem.status.length > 0, 'If present, status should have length');
                assert.includeMembers(['Resolved', 'Active', 'Inactive'], new Array(currentProblem.status), 'Status should be known value');
            }
        }
        done();
    });

    it('Problem Structure - Patient Status', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            if (currentProblem.patient_status) {
                assert.isString(currentProblem.patient_status, 'Patient Status should be a string');
                assert.ok(currentProblem.patient_status.length > 0, 'If present, Patient status should have length');
                assert.includeMembers(['Alive and well', 'In remission', 'Symptom free', 'Chronically ill', 'Severely ill', 'Disabled', 'Severely disabled'], new Array(currentProblem.patient_status), 'Status should be known value');
            }
        }
        done();
    });

    it('Problem Structure - Source List Identifiers', function (done) {
        for (var i in problems.problems) {
            var currentProblem = problems.problems[i];
            assert.isDefined(currentProblem.source_list_identifiers, 'SLIs should exist');
            assert.isArray(currentProblem.source_list_identifiers, 'SLIs should be an array');
            assert.ok(currentProblem.source_list_identifiers.length > 0, 'SLIs required.');

            for (var ii in currentProblem.source_list_identifiers) {
                var currentId = currentProblem.source_list_identifiers[ii];
                assert.isString(currentId.identifier, 'SLIs should be a string');
                assert.ok(currentId.identifier.length > 0, 'SLIs should have content');
                //TODO:  Add assertions if extension comes in, and snippets to test.
            }
        }
        done();
    });

});
