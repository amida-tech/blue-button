var expect = require('chai').expect;
var assert = require('chai').assert;
var lib = require('./test-lib.js');

var test = new lib.testXML();

// allergies section
describe('generating CCDA for allergies section', function() {
    it ('should match allergies section', function() {
        var XMLDOMs = test.generateXMLDOM('allergies');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);
    });
});

// medications section
describe('generating CCDA for medications section', function() {
    it ('should match medications section', function() {
        var XMLDOMs = test.generateXMLDOM('medications');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);
    });
});

// problems section
describe('generating CCDA for problems section', function() {
    it ('should match problems section', function() {
       var XMLDOMs = test.generateXMLDOM('problems');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);

    });
});

// results section
describe('generating CCDA for results section', function() {
    it ('should match results section', function() {
        var XMLDOMs = test.generateXMLDOM('results');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);

    });
});

// demographics section
describe('generating CCDA for demographics section', function() {
    it ('should match demographics section', function() {
        var XMLDOMs = test.generateXMLDOM('demographics');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);

    });
});

// procedures section
describe('generating CCDA for procedures section', function() {
    it ('should match procedures section', function() {
        var XMLDOMs = test.generateXMLDOM('procedures');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);

    });
});

// encounters section
describe('generating CCDA for encounters section', function() {
    it ('should match encounters section', function() {
        var XMLDOMs = test.generateXMLDOM('encounters');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);

    });
});

// // stub/reduced test for testing purposes
// describe('generating a reduced test for simplicity', function() {
//     it ('should match reduced test stub', function() {
//         var XMLDOMs = test.generateStubs('stub_test1' , 'stub_test1_exp');
        
//         assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//         console.log("TOTAL ERRORS: " + test.numErrors);

//     });
// });

// immunizations section
describe('generating CCDA for immunizations section', function() {
    it ('should match immunizations section', function() {
        var XMLDOMs = test.generateXMLDOM('immunizations');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);

    });
});

// vitals section
describe('generating CCDA for vitals section', function() {
    it ('should match vitals section', function() {
        var XMLDOMs = test.generateXMLDOM('vitals');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);

    });
});

// social history section
describe('generating CCDA for social history section', function() {
    it ('should match social history section', function() {
        var XMLDOMs = test.generateXMLDOM('socialHistory');

        assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
        console.log("TOTAL ERRORS: " + test.numErrors);

    });
});


