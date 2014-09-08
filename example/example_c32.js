"use strict";

var bb = require("../index.js");
var fs = require("fs");

var data = fs.readFileSync("C32.xml").toString();

//parse xml into JS object 
var doc = bb.xml(data);

//here are result of parsing
//console.log(doc.errors);
//console.log(doc.toString());

//get document type (e.g. CCDA) of parsed document 
var type = bb.senseXml(doc);
console.log(type);

//get document type (e.g. CCDA) of document from string (and return parsed xml if it is xml based type) 
var sense = bb.senseString(data);
console.log(sense);

//convert Xml document into JSON 
//var result = bb.parseXml(doc);


var componentRouter = require("../lib/parser/router_c32").componentRouter;
var xmlParser = require("../lib/xml");
var Component = require("../lib/parser/c32/component").Component;
var Cleanup = require("../lib/parser/c32/cleanup");
var util = require("util");

var options = {};

var componentParser = componentRouter(options.component);
if (!componentParser) {
    var msg = util.format("Component %s is not supported.", options.component);
    //callback(new Error(msg)); //TODO:revise this use of callbacks
    return {
        "errors": new Error(msg)
    };
}
var ret = componentParser.instance();

ret.run(doc, options.sourceKey);
ret.cleanupTree(options.sourceKey); // first build the data objects up 

var result = {
    "data": ret.toJSON(),
    "meta": {
        "version": "version"
    },
    "errors": ret.errors
};

console.log(JSON.stringify(result.data.allergies, null, 4));
//console.log(result);












//convert string into JSON 
//result = bb.parseString(data);
//console.log(JSON.stringify(result, null, 4));

// result = // {“data”:“JSON model compliant data here…”, “meta”:{“version”:“1.0.0”,“type”:“CCDA”, … some other metadata}}
