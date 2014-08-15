var expect = require('chai').expect;
var assert = require('chai').assert;

var xml = require('../lib/xml.js');

describe('xml.js test', function () {

    it('check parsing', function () {
        //expect(true).to.equal(true);
        expect(xml.parse("<?xml version=\"1.0\"?><root>nothing to see here</root>")).to.be.ok;
    });
});
