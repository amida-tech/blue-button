"use strict";

var chai = require('chai');

var component = require('../lib/parser/ccda/component');

var expect = chai.expect;

describe('component', function () {
    describe('permutation infrastrucure', function () {
        var component1 = null;
        var component2 = null;

        var namedCleanupStep = function (name) {
            return function () {
                return name;
            };
        };

        var checkParsersFromPath = function (ps, expected) {
            var actual = ps.map(function (p) {
                return p.jsPath;
            });
            expect(actual).to.deep.equal(expected);
        };

        var checkParsersFromComponent = function (ps, expected) {
            var actual = ps.map(function (p) {
                return p.component.componentName;
            });
            expect(actual).to.deep.equal(expected);
        };

        var checkCleanups = function (cus, expected) {
            var actual = cus.slice(1).map(function (cu) { // Component has a defaul cleanup step
                return cu.value();
            });
            expect(actual).to.deep.equal(expected);
        };

        it('simple component', function (done) {
            var prop10 = component.define('prop10');
            var prop11 = component.define('prop11');
            var prop12 = component.define('prop12');
            var prop13 = component.define('prop13');

            component1 = component.define('component1');
            component1.fields([
                ["p10", "1..1", "h:prop0", prop10],
                ["p11", "1..1", "h:prop0", prop11],
                ["p12", "1..1", "h:prop0", prop12],
                ["p13", "1..1", "h:prop0", prop13],
            ]);
            component1.cleanupStep(namedCleanupStep('cu10'));
            component1.cleanupStep(namedCleanupStep('cu11'));

            var ps = component1.overallParsers();
            checkParsersFromPath(ps, ['p10', 'p11', 'p12', 'p13']);
            checkParsersFromComponent(ps, ['prop10', 'prop11', 'prop12', 'prop13']);
            var cus = component1.overallCleanupSteps();
            checkCleanups(cus, ['cu10', 'cu11']);
            done();
        });

        it('derived component', function (done) {
            var prop20 = component.define('prop20');
            var prop21 = component.define('prop21');
            var prop22 = component.define('prop22');

            component2 = component1.define('component2');
            component2.fields([
                ["p20", "1..1", "h:prop0", prop20],
                ["p21", "1..1", "h:prop0", prop21],
                ["p22", "1..1", "h:prop0", prop22],
            ]);
            component2.cleanupStep(namedCleanupStep('cu20'));
            component2.cleanupStep(namedCleanupStep('cu21'));
            component2.cleanupStep(namedCleanupStep('cu22'));
            var ps = component2.overallParsers();
            checkParsersFromPath(ps, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22']);
            checkParsersFromComponent(ps, ['prop10', 'prop11', 'prop12', 'prop13', 'prop20', 'prop21', 'prop22']);
            var cus = component2.overallCleanupSteps();
            checkCleanups(cus, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22']);
            done();
        });

        it('derived component level 2 (1)', function (done) {
            var prop3 = component.define('prop3');

            var component3 = component2.define('component3');
            component3.fields([
                ["p3", "1..1", "h:prop0", prop3],
            ]);
            var ps = component3.overallParsers();
            checkParsersFromPath(ps, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22', 'p3']);
            checkParsersFromComponent(ps, ['prop10', 'prop11', 'prop12', 'prop13', 'prop20', 'prop21', 'prop22', 'prop3']);
            var cus = component3.overallCleanupSteps();
            checkCleanups(cus, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22']);
            done();
        });

        it('derived component level 2 (2)', function (done) {
            var prop3 = component.define('prop3');

            var component3 = component2.define('component3');
            component3.cleanupStep(namedCleanupStep('c3'));
            var ps = component3.overallParsers();
            checkParsersFromPath(ps, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22']);
            checkParsersFromComponent(ps, ['prop10', 'prop11', 'prop12', 'prop13', 'prop20', 'prop21', 'prop22']);
            var cus = component3.overallCleanupSteps();
            checkCleanups(cus, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22', 'c3']);
            done();
        });

        it('derived component level 2 (3)', function (done) {
            var prop3 = component.define('prop3');

            var component3 = component2.define('component3');
            component3.fields([
                ["p3", "1..1", "h:prop0", prop3],
            ]);
            component3.cleanupStep(namedCleanupStep('c3'));
            var ps = component3.overallParsers();
            checkParsersFromPath(ps, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22', 'p3']);
            checkParsersFromComponent(ps, ['prop10', 'prop11', 'prop12', 'prop13', 'prop20', 'prop21', 'prop22', 'prop3']);
            var cus = component3.overallCleanupSteps();
            checkCleanups(cus, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22', 'c3']);
            done();
        });

        it('parser sourceKey override (1)', function (done) {
            var prop30 = component.define('prop30');
            var prop31 = component.define('prop31');

            var component3 = component2.define('component3');
            component3.fields([
                ["p10", "1..1", "h:prop0", prop30, 'sc'],
                ["p21", "1..1", "h:prop0", prop31, 'sc']
            ]);
            component3.cleanupStep(namedCleanupStep('c3'));

            var ps0 = component3.overallParsers();
            checkParsersFromPath(ps0, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22']);
            checkParsersFromComponent(ps0, ['prop10', 'prop11', 'prop12', 'prop13', 'prop20', 'prop21', 'prop22']);
            var cus0 = component3.overallCleanupSteps();
            checkCleanups(cus0, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22', 'c3']);

            var ps1 = component3.overallParsers('sc');
            checkParsersFromPath(ps1, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22']);
            checkParsersFromComponent(ps1, ['prop30', 'prop11', 'prop12', 'prop13', 'prop20', 'prop31', 'prop22']);
            var cus1 = component3.overallCleanupSteps('sc');
            checkCleanups(cus1, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22', 'c3']);
            done();
        });

        it('parser sourceKey override (2)', function (done) {
            var prop20 = component.define('prop20');
            var prop20sc0 = component.define('prop20sc0');
            var prop21 = component.define('prop21');
            var prop21sc1 = component.define('prop21sc1');
            var prop22 = component.define('prop22');

            var component2 = component1.define('component2');
            component2.fields([
                ["p20", "1..1", "h:prop0", prop20sc0, 'sc0'],
                ["p20", "1..1", "h:prop0", prop20],
                ["p21", "1..1", "h:prop0", prop21],

                ["p21", "1..1", "h:prop0", prop21sc1, 'sc1'],
                ["p22", "1..1", "h:prop0", prop22],
            ]);
            component2.cleanupStep(namedCleanupStep('cu20'));
            component2.cleanupStep(namedCleanupStep('cu21'));
            component2.cleanupStep(namedCleanupStep('cu22'));

            var ps0 = component2.overallParsers();
            checkParsersFromPath(ps0, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22']);
            checkParsersFromComponent(ps0, ['prop10', 'prop11', 'prop12', 'prop13', 'prop20', 'prop21', 'prop22']);
            var cus0 = component2.overallCleanupSteps();
            checkCleanups(cus0, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22']);

            var ps1 = component2.overallParsers('sc0');
            checkParsersFromPath(ps1, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22']);
            checkParsersFromComponent(ps1, ['prop10', 'prop11', 'prop12', 'prop13', 'prop20sc0', 'prop21', 'prop22']);
            var cus1 = component2.overallCleanupSteps('sc1');
            checkCleanups(cus1, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22']);

            var ps2 = component2.overallParsers('sc1');
            checkParsersFromPath(ps2, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22']);
            checkParsersFromComponent(ps2, ['prop10', 'prop11', 'prop12', 'prop13', 'prop20', 'prop21sc1', 'prop22']);
            var cus2 = component2.overallCleanupSteps('sc2');
            checkCleanups(cus2, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22']);

            done();
        });

        it('cleanup sourceKey override', function (done) {
            var prop20 = component.define('prop20');
            var prop21 = component.define('prop21');
            var prop22 = component.define('prop22');

            component2 = component1.define('component2');
            component2.fields([
                ["p20", "1..1", "h:prop0", prop20],
                ["p21", "1..1", "h:prop0", prop21],
                ["p22", "1..1", "h:prop0", prop22],
            ]);
            component2.cleanupStep(namedCleanupStep('cu20sc1only'), ['sc1']);
            component2.cleanupStep(namedCleanupStep('cu20'));
            component2.cleanupStep(namedCleanupStep('cu21'));
            component2.cleanupStep(namedCleanupStep('cu21both'), ['sc0', 'sc1']);
            component2.cleanupStep(namedCleanupStep('cu22'));
            component2.cleanupStep(namedCleanupStep('cu22sc0only'), ['sc0']);
            component2.cleanupStep(namedCleanupStep('cu23exsc0'), [], ['sc0']);
            component2.cleanupStep(namedCleanupStep('cu23exsc1'), [], ['sc1']);
            component2.cleanupStep(namedCleanupStep('cu23exboth'), [], ['sc0', 'sc1']);

            var ps = component2.overallParsers();
            checkParsersFromPath(ps, ['p10', 'p11', 'p12', 'p13', 'p20', 'p21', 'p22']);
            checkParsersFromComponent(ps, ['prop10', 'prop11', 'prop12', 'prop13', 'prop20', 'prop21', 'prop22']);

            var cus0 = component2.overallCleanupSteps();
            checkCleanups(cus0, ['cu10', 'cu11', 'cu20', 'cu21', 'cu22', 'cu23exsc0', 'cu23exsc1', 'cu23exboth']);

            var cus1 = component2.overallCleanupSteps('sc0');
            checkCleanups(cus1, ['cu10', 'cu11', 'cu20', 'cu21', 'cu21both', 'cu22', 'cu22sc0only', 'cu23exsc1']);

            var cus2 = component2.overallCleanupSteps('sc1');
            checkCleanups(cus2, ['cu10', 'cu11', 'cu20sc1only', 'cu20', 'cu21', 'cu21both', 'cu22', 'cu23exsc0']);

            done();
        });
    });
});
