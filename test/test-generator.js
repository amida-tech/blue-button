var expect = require('chai').expect;
var assert = require('chai').assert;

var lib = require('./test-lib.js');



// // allergies section
// describe('generating CCDA for allergies section', function() {
//     it ('should match allergies section', function() {
//         var XMLDOMs = lib.generateXMLDOM('allergies');

//         // console.log(XMLDOMs[0].documentElement.attributes);
//         // console.log(XMLDOMs[1].documentElement.attributes);
//         // var genAttributes = XMLDOMs[0].documentElement.attributes;
//         // var expAttributes = XMLDOMs[1].documentElement.attributes;
//         // console.log(JSON.stringify(genAttributes) === JSON.stringify(expAttributes));

//         // console.log(XMLDOMs[1].documentElement.childNodes['2'].ownerDocument.documentElement);

//         debugger;
//         assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//     });

// });

// // medications section
// describe('generating CCDA for medications section', function() {
//     it ('should match medications section', function() {
//         var XMLDOMs = lib.generateXMLDOM('medications');

//         assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//     });
// });

// // problems section
// describe('generating CCDA for problems section', function() {
//     it ('should match problems section', function() {
//        var XMLDOMs = lib.generateXMLDOM('problems');

//         assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//     });
// });

// // results section
// describe('generating CCDA for results section', function() {
//     it ('should match results section', function() {
//         var XMLDOMs = lib.generateXMLDOM('results');

//         assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//     });
// });

// // demographics section
// describe('generating CCDA for demographics section', function() {
//     it ('should match demographics section', function() {
//         var XMLDOMs = lib.generateXMLDOM('demographics');

//         assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//     });
// });

// // procedures section
// describe('generating CCDA for procedures section', function() {
//     it ('should match procedures section', function() {
//         var XMLDOMs = lib.generateXMLDOM('procedures');

//         assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//     });
// });

// encounters section
// describe('generating CCDA for encounters section', function() {
//     it ('should match encounters section', function() {
//         var XMLDOMs = lib.generateXMLDOM('encounters');

//         //console.log(XMLDOMs[1].documentElement.childNodes[1].childNodes[6].nodeName); return;

//         assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//     });
// });

describe('generating a reduced test for simplicity', function() {
    it ('should match reduced test stub', function() {
        var XMLDOMs = lib.generateStubs('stub_test1' , 'stub_test1_exp');
        
        assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
    });
});

// // immunizations section
// describe('generating CCDA for immunizations section', function() {
//     it ('should match immunizations section', function() {
//         var XMLDOMs = lib.generateXMLDOM('immunizations');

//         assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//     });
// });

// // vitals section
// describe('generating CCDA for vitals section', function() {
//     it ('should match vitals section', function() {
//         var XMLDOMs = lib.generateXMLDOM('vitals');

//         assert.ok(lib.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
//     });
// });