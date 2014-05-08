var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../index');
var jsutil = require('../lib/jsutil');

var demographics;

var loadRecord = function(done) {
    var filepath = path.join(__dirname, 'fixtures/file-snippets/CCD_1_Demographics.xml');
    var xml = fs.readFileSync(filepath, 'utf-8');
    bb.parse(xml, {
        component: 'ccda_demographics'
    }, function(err, result) {
        demographics = result.toJSON();
        done();
    });
};

describe('Demographics- Snippet Comparison', function() {
    
    before(function(done) {
        if (demographics === undefined) {
            loadRecord(function() {
                done();
            });
        } else {
            done();
        }
    });
    
    it('Deep Equality Check', function(done) {
        expect(demographics).to.exist;
        var filepath  = path.join(__dirname, 'fixtures/file-snippets/json/CCD_1_Demographics.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedDemographics = jsutil.jsonParseWithDate(json2Read);
        expect(demographics).to.deep.equal(expectedDemographics);
        done();
    });
    
    it ('Shallow Equality Check', function(done) {
        expect(demographics.name).to.exists;
        expect(demographics.name.last).to.equal('Jones');
        expect(demographics.name.first).to.equal('Isabella');
        expect(demographics.name.middle).to.have.members(['Isa']);        
        expect(JSON.stringify(demographics.dob[0].date)).to.equal('"1975-05-01T00:00:00.000Z"');
        expect(demographics.phone).to.exists;
        expect(demographics.phone).to.have.length(1);
        expect(demographics.phone[0].number).to.equal('(816)276-6909');
        expect(demographics.phone[0].type).to.equal('primary home');
        done();
    });
});