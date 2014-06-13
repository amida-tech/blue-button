var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");
var gen = require('../lib/generator/ccda/generator.js');
var DOMParser = require('xmldom').DOMParser;


var isIdentical = function (generated, expected) {
    if (!sameAttributes(generated, expected)) {
        console.log("Error: Attributes are not equal (line # " + (generated.lineNumber - 1) + ")");
        return false;
    } 
    // if (isLeaf(generated) && isLeaf(expected)) {
    //     return sameAttributes(generated, expected);
    // }

    if (!numChildNodesSame(generated, expected)) {
        console.log("Error: Generated number of child nodes different from expected (generated: " + generated.childNodes.length + ", expected: " + expected.childNodes.length);
        return false;
    }

    var i = 0,
        j = 0;
    var generated_text = "",
        expected_text = "";
    while ((generated.childNodes != null || expected.childNodes != null) && i < generated.childNodes.length && j < expected.childNodes.length) {


        // Skip comments.
        // if (generated.childNodes[i].nodeName == "#comment") {
        //     i++;
        //     continue;
        // }
        // if (expected.childNodes[j].nodeName == "#comment") {
        //     console.log("HELLO!");
        //     j++;
        //     continue;
        // }

        console.log(generated.childNodes[i].nodeName + " vs. " + expected.childNodes[j].nodeName);
        console.log(generated.childNodes[i].data + " vs. " + expected.childNodes[j].data);

        // Collect the text.
        // if (generated.childNodes[i].nodeName == "#text") {
        //     generated_text += generated.childNodes[i].nodeValue;
        //     console.log("In generated: "  + generated_text);
        //     i++;
        //     continue;
        // }
        // if (expected.childNodes[j].nodeName == "#text") {
        //     expected_text += expected.childNodes[j].nodeValue;
        //     console.log("In expected: " + expected_text);
        //     j++;
        //     continue;
        // }

        // if (generated.childNodes[i].data == undefined && expected.childNodes[i].data == undefined)
        if (!isIdentical(generated.childNodes[i], expected.childNodes[j])) {
            console.log("Error. Different children: Generated: " + generated.childNodes[i].nodeName + ". Expected " + expected.childNodes[j].nodeName);
            return false;
        }
       
        i++;
        j++;
    }

    // return generated_text.trim() == expected_text.trim();
    return true;
}

var sameAttributes = function (generated, expected) {
    var genAttributes = generated.attributes;
    var expAttributes = expected.attributes;

    if (genAttributes == undefined && expAttributes == undefined) {
        return true;  // No attributes.
    }
    if ((genAttributes == undefined && expAttributes != undefined) || 
        (genAttributes != undefined && expAttributes == undefined)) {
        // console.log(genAttributes);
        // console.log(expAttributes);
        console.log("Attributes mismatch.");
        return false;  // One has attributes but the other one doesn't.
    }

    // console.log(expAttributes);
    // console.log(expected);
    // console.log(genAttributes);

    for (var i = 0; i < genAttributes.length; i++) {
        if (!(genAttributes[i].name == expAttributes[i].name && genAttributes[i].value == expAttributes[i].value)) {
            console.log("Error: Different attributes (line # " + (generated.lineNumber - 1) + ")");
            console.log(genAttributes[i].name + " / " + genAttributes[i].value + " vs. " + expAttributes[i].name + " / " + expAttributes[i].value);
            return false;
        }
    }
    return true;
}

// helper function: count number of nodes
var numChildNodesSame = function(generated, expected) {
    var genLength = 0;
        for (var i = 0; i < generated.childNodes.length; i++) {
            if (generated.childNodes[i].tagName != undefined) {
                genLength++;
            }  
        } 

        var expLength = 0;
        for (var i = 0; i < expected.childNodes.length; i++) {
            if (expected.childNodes[i].tagName != undefined) {
                expLength++;
            }  
        } 


        if (genLength != expLength) {
            console.log("Error: Number of child nodes not equal to expected number" +
                " of child nodes (generated: " + genLength + ", expected: " + expLength + " at line # " + (generated.childNodes['0'].lineNumber - 1) + ", tag: " + expected.tagName + ")");

            return false;
        } else {
            return true;
        }
}

var isLeaf = function(root) {
    if (root.childNodes == null) {
        return true;
    } else {
        return false;
    }
}

var generateXMLDOM = function(file) {
    var modelJSON = fs.readFileSync('lib/generator/ccda/testSamples/' + file + '.js', 'utf-8');
    var actual = gen(JSON.parse(modelJSON));
    var expected = fs.readFileSync('lib/generator/ccda/testSamples/' + file + '.xml');

    // write generated file just to visually compare
    fs.writeFileSync('lib/generator/ccda/testSamples/produced/' + file + '.xml', actual, 'utf-8');

    var generatedXML = new DOMParser().parseFromString(actual.toString());
    var expectedXML = new DOMParser().parseFromString(expected.toString());
    return [generatedXML, expectedXML];
}

var generateStubs = function(name1, name2) {
    var actual = fs.readFileSync('lib/generator/ccda/testSamples/' + name1 + '.xml');
    var expected = fs.readFileSync('lib/generator/ccda/testSamples/' + name2 + '.xml');

    var generatedXML = new DOMParser().parseFromString(actual.toString());
    var expectedXML = new DOMParser().parseFromString(expected.toString());
    return [generatedXML, expectedXML];
}





module.exports.isIdentical = isIdentical;
module.exports.generateXMLDOM = generateXMLDOM;
module.exports.generateStubs = generateStubs;