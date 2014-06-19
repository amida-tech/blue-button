/*
This is a library file to support the tests in the test-generator.js file. It's purpose is to help 
compare two XML documents by returning the results from comparing their nodes (tagNames), then their 
attribute/value pairs (if any) and then their text contents (if any). It then proceeds to
strip out any comment and whitespace objects present in either XML file (comments are not critical 
and may be different). Then it tests if they are leaf nodes, in which case if they are, then it checks the 
attribute/value pairs again. Finally, if they are not leaf nodes, then it 
checks the number of children, and if those numbers are the same, then it 
calls the isIdentical() function recursively to run the same tests on those
child nodes.

@export isIdentical()
haveSameAttributes()
skip()
sameNode()
sameText()
numChildNodesSame()
isLeaf()
extractNodes()
@export generateDOMParser()
@export generateStubs()

*/

// Requires
var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");
var gen = require('../lib/generator/ccda/generator.js');
var XmlDOM = require('xmldom').DOMParser;
var execSync = require('execSync');

// Flags
var PROMPT_TO_SKIP = false;
var DIFF = true;

// Error Codes
var DIFFERENT_TAGS = 1;
var CHILD_NODE_DISCREPANCY = 2;
var ATTR_MISMATCH = 3;
var ATTR_MISMATCH_CAP = 3.1;
var ATTR_MISMATCH_LEN = 3.2;
var TEXT_DISCREPANCY = 4;

// Defining the class as a function, and later adding methods to its prototype
var testXML = function() {
    this.error_settings = {
        "silence_cap": false,
        "silence_len": false
    }

    // possible errors
    this.errors = {
        "total": 0, 
        "differentTags": 0, 
        "childNodeDiscrepancy": 0, 
        "attributesMismatch": { 
            "total": 0, 
            "capitalization": 0, 
            "length": 0, 
        },
        "textDiscrepancy": 0, 
    }
};

// Utility function for determining the size/length of objects
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) { 
            size++;
        }
    }
    return size;
};

/*
    Returns true if the two XML documents are identical, otherwise returns false.
*/
testXML.prototype.isIdentical = function (generated, expected) {

    // Compare their tagNames
    if (!this.sameNode(generated, expected)) {
        var error = "Error: Encountered different tagNames: Encountered <" + 
            ((generated === undefined) ? generated : generated.tagName) + 
            "> but expected <" + ((expected === undefined) ? expected : expected.tagName) + 
            ">, lineNumber: " + ((generated === undefined) ? generated : generated.lineNumber) + 
            ", " + ((expected === undefined) ? expected : expected.lineNumber);
        return this.skip(error, DIFFERENT_TAGS);
    }

    // Compare their attributes
    if (!this.haveSameAttributes(generated, expected)) {
        return this.skip();
    } 

    // Compare their text contents, if any
    if (!this.sameText(generated, expected)) {
        return this.skip();
    }

    // Now strip out comment and text objects, leaving just the childNodes with tagNames and value/attribute pairs
    generated.childNodes = this.extractNodes(generated.childNodes);
    expected.childNodes = this.extractNodes(expected.childNodes);

    // Check if they are both leaf nodes, if so then check if their attributes are the same.
    if (this.isLeaf(generated) && this.isLeaf(expected)) {
        return this.haveSameAttributes(generated, expected);
    }

    // Since we've reached this point, they are not leaf nodes, so first check if they have the same number of children
    if (!this.numChildNodesSame(generated, expected)) {
        var error = "Error: Generated number of child nodes different from expected (generated: " + 
            generated.childNodes.length + ", expected: " + expected.childNodes.length;
        return this.skip(error, CHILD_NODE_DISCREPANCY);
    }

    // If they have the same number of children, then start comparing their childNodes by calling the function recursively
    for (var i = 0; i < Object.size(generated.childNodes); i++) {
        if (!this.isIdentical(generated.childNodes[i], expected.childNodes[i])) {
            return false;
        }
    }
    // If all the childNodes are the same, then return true, traverse back up the call stack and process the next sibling
    return true;
};

// Check if the attributes are the same for two nodes.
testXML.prototype.haveSameAttributes = function(generated, expected) {
    var genAttributes = generated.attributes;
    var expAttributes = expected.attributes;

    if (genAttributes === undefined && expAttributes === undefined) {
        return true;  // No attributes.
    }
    if ((genAttributes === undefined && expAttributes !== undefined) || 
        (genAttributes !== undefined && expAttributes === undefined)) {
        var error = "Attributes mismatch.";
        return this.skip(error, ATTR_MISMATCH, undefined);  // One has attributes but the other one doesn't.
    }

    if (genAttributes.length !== expAttributes.length) {
        var error = "Attributes mismatch. Different lengths: " + genAttributes.length + " attributes but expected " + 
            expAttributes.length + " attributes @ lineNumber: " + generated.lineNumber + ", " + expected.lineNumber;
        return this.skip(error, ATTR_MISMATCH, ATTR_MISMATCH_LEN);
    }

    for (var i = 0; i < genAttributes.length; i++) {
        if (!(genAttributes[i].name === expAttributes[i].name && genAttributes[i].value === expAttributes[i].value)) {
            var attributeGen = genAttributes[i].name + "=\"" + genAttributes[i].value + "\"";
            var attributeExp = expAttributes[i].name + "=\"" + expAttributes[i].value + "\"";
            var error = "\nError: Attributes mismatch: Encountered: " + attributeGen + 
                " but expected: " + attributeExp + " @ lineNumber: " + generated.lineNumber + 
                ", " + expected.lineNumber;
            return this.skip(error, ATTR_MISMATCH, this.isCapError(attributeGen, attributeExp));
        }
    }
    return true;
};

testXML.prototype.isCapError = function(attr1, attr2) {
    return attr1.toLowerCase() === attr2.toLowerCase() ? ATTR_MISMATCH_CAP : undefined;
}

 /* 
    A utility function that allows you to skip failed assertions and produce 
    a diff of the two XML documents.
 */
testXML.prototype.skip = function(error, errorCode, subCode) {
    this.logError(error, errorCode, subCode);
    if (PROMPT_TO_SKIP) {
        console.log("Skip? > y/n: ");
        var result = execSync.exec('test/support/a.out');
        var out = result.stdout;
        if (out.substr(12,13).trim() === "y") {
            return true;
        } else {
            return false;
        } 
    } else if (DIFF) {
        return true;
    } else {
        return false;
    }
};

testXML.prototype.logError = function(errorMsg, eC, sC) {
        if (eC === 0) { 
            this.errors["total"]++;
            console.log(errorMsg);
        } else if (eC === 1) { 
            this.errors["differentTags"]++;
            this.errors["total"]++;
            console.log(errorMsg);
        } else if (eC === 2) { 
            this.errors["childNodeDiscrepancy"]++;
            this.errors["total"]++;
            console.log(errorMsg);
        } else if (eC === 3) {
            this.errors["attributesMismatch"]["total"]++;
            this.errors["total"]++;
            if (sC === undefined) {
                console.log(errorMsg);
            }
            if (sC === 3.1) { 
                this.errors["attributesMismatch"]["capitalization"]++;
                if (!this.error_settings["silence_cap"]) {
                    console.log(errorMsg);
                }
            } 
            if (sC === 3.2) { 
                this.errors["attributesMismatch"]["length"]++;
                if (!this.error_settings["silence_len"]) {
                    console.log(errorMsg);
                }
            } 
        } else if (eC === 5) { 
            this.errors["textDiscrepancy"]++;
            this.errors["total"]++;
        }
}

// Returns false if the tagNames for the nodes are different, otherwise true
testXML.prototype.sameNode = function(node1, node2) {
    // console.log(node1);
    // console.log(node2);
    return (node1 !== undefined && node2 !== undefined) && (node1.tagName === node2.tagName);
};

// Return false if the text is different (ignoring whitespace), otherwise returns true if it is the same
testXML.prototype.sameText = function(generated, expected) {
    var genText = "",
        expText = "";  
    if (generated.childNodes !== undefined) {
        for (var i = 0; i < Object.size(generated.childNodes); i++) {
            if (generated.childNodes[i] !== undefined && generated.childNodes[i].nodeName === "#text") { // then it is a text node
                genText = [generated.childNodes[i].nodeValue.trim(), generated.lineNumber];
            }
        }

        for (var j = 0; j < Object.size(expected.childNodes); j++) {
            if (expected.childNodes[j] !== undefined && expected.childNodes[j].nodeName === "#text" && 
            expected.childNodes[j].nodeValue.trim() !== "\n") { // then it is a text node
                expText = [expected.childNodes[j].nodeValue.trim(), expected.lineNumer];

                if (genText === expText) {
                    return true;
                }
            }
        }
    }
    
    if (genText !== expText && generated.chilNodes !== undefined) {
        console.log("Error: Different text: encountered: \"" + genText[0] + "\" but expected: \"" + 
            expText[0] + "\" , lineNumber: " + genText[1] + ", " + expText[1]);
        return this.skip(DIFFERENT_TAGS);
    } else {
        return true;
    }
};

// Returns false if the parent nodes (the ones passed in) have a different number of childNodes, otherwise returns true
testXML.prototype.numChildNodesSame = function(generated, expected) {
    var genLength = 0;
        for (var i = 0; i < generated.childNodes.length; i++) {
            if (generated.childNodes[i].tagName !== undefined) {
                genLength++;
            }  
        } 

        var expLength = 0;
        for (var j = 0; j < expected.childNodes.length; j++) {
            if (expected.childNodes[j].tagName !== undefined) {
                expLength++;
            }  
        } 

        if (genLength !== expLength) {
            console.log("Error: Number of child nodes not equal to expected number" +
                " of child nodes (generated: " + genLength + ", expected: " + expLength + 
                    " at line # " + (generated.childNodes['0'].lineNumber - 1) + ", tag: " + expected.tagName + ")");
            return this.skip();
        } else {
            return true;
        }
};

// Checks if the current node is a leaf node (i.e., no children). If so, returns true, otherwise returns false;
/// @root node to evaluate 
testXML.prototype.isLeaf = function(root) {
    if (root.childNodes === null) {
        return true;
    } else {
        return false;
    }
};

// strips out comments and whitespace from the childNodes object
testXML.prototype.extractNodes = function(childNodes) {
    var newChildNodes = {};
    var count = 0;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].tagName !== undefined) {
            newChildNodes[count] = childNodes[i];
            count++;
        }
    }
    return newChildNodes;
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// generates the DOM representations of both XML documents and returns them as a two-element array, 
// with the first being the generated XML and the second being the expected XML.
testXML.prototype.generateXMLDOM = function(file) {
    console.log("\nPROCESSING " + file.toUpperCase());
    var modelJSON = fs.readFileSync('test/fixtures/file-snippets/json/CCD_1_' + file.capitalize() + '.json', 'utf-8');
    var actual = gen(JSON.parse(modelJSON));
    var expected = fs.readFileSync('test/fixtures/file-snippets/CCD_1_' + file.capitalize() + '.xml');

    // write generated file just to visually compare
    fs.writeFileSync('test/fixtures/file-snippets/generated/CCD_1_' + file.capitalize() + '.xml', actual, 'utf-8');

    var generatedXML = new XmlDOM().parseFromString(actual.toString());
    var expectedXML = new XmlDOM().parseFromString(expected.toString());
    return [generatedXML, expectedXML];
};

// A test/sandbox function for experimentation/testing 
testXML.prototype.generateStubs = function(name1, name2) {
    var actual = fs.readFileSync('test/fixtures/file-snippets/stubs/' + name1 + '.xml');
    var expected = fs.readFileSync('test/fixtures/file-snippets/stubs/' + name2 + '.xml');

    var generatedXML = new XmlDOM().parseFromString(actual.toString());
    var expectedXML = new XmlDOM().parseFromString(expected.toString());
    return [generatedXML, expectedXML];
};

testXML.prototype.generateXMLDOMForEntireCCD = function() {
    console.log("\nPROCESSING WHOLE CCD");
    var modelJSON = fs.readFileSync('test/fixtures/files/json/CCD_1.json', 'utf-8');
    var actual = gen.genWholeCCDA(JSON.parse(modelJSON));
    var expected = fs.readFileSync('test/fixtures/files/CCD_1.xml');

    // write generated file just to visually compare
    fs.writeFileSync('test/fixtures/files/generated/CCD_1_.xml', actual, 'utf-8');

    var generatedXML = new XmlDOM().parseFromString(actual.toString());
    var expectedXML = new XmlDOM().parseFromString(expected.toString());
    return [generatedXML, expectedXML];
};


module.exports.testXML = testXML;
