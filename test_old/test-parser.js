var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var component = require('../lib/parser/ccda/component');
var xml = require('../lib/xml');

var testChildComponent = component.define('testChild');
testChildComponent.fields([
    ['single_required', '1..1', 'req'],
    ['single_optional', '0..1', 'opt'],
    ['multi_required', '0..*', 'multreq'],
    ['multi_optional', '1..*', 'multopt']
]);

var testComponent = component.define('test');
testComponent.fields([
    ['child_required', '1:1', '//document/reqchild', testChildComponent],
    ['single_required', '1..1', '//document/req'],
    ['single_optional', '0..1', '//document/opt']
]);

describe('parser.js', function () {
    var testInstance = null;

    before(function (done) {
        var filepath = path.join(__dirname, 'fixtures/parser/file_1.xml');
        var xmlfile = fs.readFileSync(filepath, 'utf-8');
        var doc = xml.parse(xmlfile);
        testInstance = testComponent.instance();
        testInstance.run(doc);
        done();
    });

    it('check valid data', function (done) {
        expect(testInstance).to.exist;
        var result = testInstance.toJSON();
        expect(result).to.exist;
        expect(result.single_required).to.equal('error but in');
        expect(result.single_optional).to.equal('allright');
        expect(result.child_required).to.exist;
        var child = result.child_required;
        expect(child.single_required).to.equal('allright');
        expect(child.single_optional).to.equal('error but in');
        [child.multi_required, child.multi_optional].forEach(function (obj) {
            expect(obj).to.exist;
            expect(obj).to.have.length(3);
            for (var i = 0; i < 3; ++i) {
                expect(obj[i]).to.equal('allright ' + i);
            }
        });
        done();
    });

    it('check errors', function (done) {
        expect(testInstance.errors).to.have.length(2);
        expect(testInstance.errors[0]).to.have.string('cardinality error:');
        expect(testInstance.errors[1]).to.have.string('cardinality error:');
        done();
    });
});
