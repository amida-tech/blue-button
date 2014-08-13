var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var component = require('../lib/parser/ccda/component');
var xml = require('../lib/xml');

describe('componentInstance.js', function () {
    it('setJS path with .', function (done) {
        var c = component.define('test');
        c.fields([
            ['a', "1..1", "//document/a"],
            ['x.b', "1..1", "//document/p/b"],
            ['x.c', "1..1", "//document/p/b"]
        ]);
        var r = c.instance();
        var filepath = path.join(__dirname, 'fixtures/componentInstance/file_1.xml');
        var xmlfile = fs.readFileSync(filepath, 'utf-8');
        var doc = xml.parse(xmlfile);
        r.run(doc);
        var f = r.toJSON();
        expect(f).to.exist;
        expect(f.a).to.equal('valuea');
        expect(f.x).to.exist;
        expect(f.x.b).to.equal('valueb');
        expect(f.x.c).to.equal('valueb');
        done();
    });
});
