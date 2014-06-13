var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");
var gen = require('../lib/generator/ccda/generator.js');
var DOMParser = require('xmldom').DOMParser;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};



var isIdentical = function (generated, expected) {

    if (!sameNode(generated, expected)) {
        console.log("Error: Encountered different tagNames: Encountered <" + generated.tagName + "> but expected <" + expected.tagName + ">, lineNumber: " + generated.lineNumber + ", " + expected.lineNumber);
        return false;
    }

    if (!sameAttributes(generated, expected)) {
        return false;
    } 

    // Compare the text
    if (!sameText(generated, expected)) {
        console.log("Error: Different text: Encountered " + generated.nodeValue + " but expected " + expected.nodeValue);
        return false;
    }

    generated.childNodes = extractNodes(generated.childNodes);
    expected.childNodes = extractNodes(expected.childNodes);


    if (isLeaf(generated) && isLeaf(expected)) {
        return sameAttributes(generated, expected);
    }

    if (!numChildNodesSame(generated, expected)) {
        console.log("Error: Generated number of child nodes different from expected (generated: " + generated.childNodes.length + ", expected: " + expected.childNodes.length);
        return false;
    }

    for (var i = 0; i < Object.size(generated.childNodes); i++) {

        if (!isIdentical(generated.childNodes[i], expected.childNodes[i])) {
            return false;
        }
       
    }

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

    for (var i = 0; i < genAttributes.length; i++) {
        if (!(genAttributes[i].name == expAttributes[i].name && genAttributes[i].value == expAttributes[i].value)) {
            console.log("\nError: Attributes mismatch: Encountered: " + genAttributes[i].name + "=\"" + genAttributes[i].value + "\" but expected: " + expAttributes[i].name + "=\"" + expAttributes[i].value + "\" @ lineNumber: " + generated.lineNumber + ", " + expected.lineNumber);
            return false;
        }
    }
    return true;
}

var sameNode = function(node1, node2) {
    return node1.tagName == node2.tagName;
}

var sameText = function(generated, expected) {
    console.log(generated.tagName);
    return generated.nodeValue == expected.nodeValue;
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

var extractNodes = function(childNodes) {
    var newChildNodes = {};
    var count = 0;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].tagName != undefined) {
            newChildNodes[count] = childNodes[i];
            count++;
        }
    }
    return newChildNodes;
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
    var actual = fs.readFileSync('lib/generator/ccda/testSamples/stubs/' + name1 + '.xml');
    var expected = fs.readFileSync('lib/generator/ccda/testSamples/stubs/' + name2 + '.xml');

    var generatedXML = new DOMParser().parseFromString(actual.toString());
    var expectedXML = new DOMParser().parseFromString(expected.toString());
    return [generatedXML, expectedXML];
}





module.exports.isIdentical = isIdentical;
module.exports.generateXMLDOM = generateXMLDOM;
module.exports.generateStubs = generateStubs;