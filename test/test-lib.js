var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");
var gen = require('../lib/generator/ccda/generator.js');
var DOMParser = require('xmldom').DOMParser;
var repl = require("repl");
var execSync = require('execSync');

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};



var isIdentical = function (generated, expected) {

    // Compare their tagNames
    if (!sameNode(generated, expected)) {
        console.log("Error: Encountered different tagNames: Encountered <" + generated.tagName + "> but expected <" + expected.tagName + ">, lineNumber: " + generated.lineNumber + ", " + expected.lineNumber);
        return false;
    }

    // Compare their attributes
    if (!haveSameAttributes(generated, expected)) {
        return false;
    } 

    // Compare their text contents, if any
    if (!sameText(generated, expected)) {
        return false;
    }

    // Now strip out comment and text objects, leaving just the childNodes with tagnames and attributes
    generated.childNodes = extractNodes(generated.childNodes);
    expected.childNodes = extractNodes(expected.childNodes);

    // Check if they are both leaf nodes, if so then check if their attributes are the same.
    if (isLeaf(generated) && isLeaf(expected)) {
        return haveSameAttributes(generated, expected);
    }

    // Since they are not leaf nodes, first check if they have the same number of children
    if (!numChildNodesSame(generated, expected)) {
        console.log("Error: Generated number of child nodes different from expected (generated: " + generated.childNodes.length + ", expected: " + expected.childNodes.length);
        return false;
    }

    // If they have the same number of children, then start comparing their childNodes by calling the function recursively
    for (var i = 0; i < Object.size(generated.childNodes); i++) {
        if (!isIdentical(generated.childNodes[i], expected.childNodes[i])) {
            return false;
        }
    }
    // If all the childNodes are the same, then return true, traverse back up the call stack and process the next sibling
    return true;
}

// Check if the attributes are the same for two nodes.
var haveSameAttributes = function(generated, expected) {
    var genAttributes = generated.attributes;
    var expAttributes = expected.attributes;

    if (genAttributes == undefined && expAttributes == undefined) {
        return true;  // No attributes.
    }
    if ((genAttributes == undefined && expAttributes != undefined) || 
        (genAttributes != undefined && expAttributes == undefined)) {
        console.log("Attributes mismatch.");
        return false;  // One has attributes but the other one doesn't.
    }

    for (var i = 0; i < genAttributes.length; i++) {
        if (!(genAttributes[i].name == expAttributes[i].name && genAttributes[i].value == expAttributes[i].value)) {
            console.log("\nError: Attributes mismatch: Encountered: " + genAttributes[i].name + "=\"" + genAttributes[i].value + "\" but expected: " + expAttributes[i].name + "=\"" + expAttributes[i].value + "\" @ lineNumber: " + generated.lineNumber + ", " + expected.lineNumber);
            return skip();
        }
    }
    return true;
}

var skip = function() {
    console.log("Skip? > y/n: ");
    var result = execSync.exec('test/support/a.out');
    var out = result.stdout;
    if (out.substr(12,13).trim() == "y") {
        return true;
    } else {
        return false;
    }
}

function done() {
    console.log('Now that process.stdin is paused, there is nothing more to do.');
    process.exit();
  }

// Returns false if the tagNames for the nodes are different, otherwise true
var sameNode = function(node1, node2) {
    return node1.tagName == node2.tagName;
}

// Return false if the text is different (ignoring whitespace), otherwise returns true if it is the same
var sameText = function(generated, expected) {
    // if (generated.childNodes['0'] != undefined && generated.childNodes['0'].nodeName == "#text") {
    //     return generated.childNodes[0].nodeValue.trim() == expected.childNodes[0].nodeValue.trim();
    // }
    // return true; 
    var genText = "",
        expText = "";  
    if (generated.childNodes != undefined) {
        for (var i = 0; i < Object.size(generated.childNodes); i++) {
            if (generated.childNodes[i] != undefined && generated.childNodes[i].nodeName == "#text") { // then it is a text node
                genText = generated.childNodes[i].nodeValue.trim();
            }
        }

        for (var j = 0; j < Object.size(expected.childNodes); j++) {
            if (expected.childNodes[j] != undefined && expected.childNodes[j].nodeName == "#text" && expected.childNodes[j].nodeValue.trim() != "\n") { // then it is a text node
                expText = expected.childNodes[j].nodeValue.trim();

                if (genText == expText) {
                    return true;
                }
            }
        }

    }
    
    if (genText != expText) {
        console.log("Error: Different text: encountered: \"" + generated.childNodes[i].nodeValue + "\" but expected: \"" + expected.childNodes[j].nodeValue + "\" , lineNumber: " + generated.childNodes[i].lineNumber + ", " + expected.childNodes[j].lineNumber);
        return false;
    } else {
        return true;
    }
}

// Returns false if the parent nodes (the ones passed in) have a different number of childNodes, otherwise returns true
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

// Checks if the current node is a leaf node (i.e., no children). If so, returns true, otherwise returns false;
/// @root node to evaluate 
var isLeaf = function(root) {
    if (root.childNodes == null) {
        return true;
    } else {
        return false;
    }
}

// 
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