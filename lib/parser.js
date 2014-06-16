"use strict";

var componentRouter = require("./parser/router").componentRouter;
var xmlParser = require("./xml");
var Component = require("./parser/ccda/component").Component;
var Cleanup = require("./parser/ccda/cleanup");
var util = require("util");

//add model/package version to metadata
var version = require("../package.json").version;


function parseXml(doc, options) {
    //data must be an object
    if (!doc || typeof(doc) !== "object") {
        //TODO: throw a proper error here
        return null;
    }

    if (arguments.length === 1) {
        options = {};
    }

    var componentParser = componentRouter(options.component);
    if (!componentParser) {
        var msg = util.format("Component %s is not supported.", options.component);
        //callback(new Error(msg)); //TODO:revise this use of callbacks
        return {
            "errors": new Error(msg)
        };
    }
    var ret = componentParser.instance();
    
    ret.run(doc, options.sourceType);
    ret.cleanupTree(); // first build the data objects up 

    return {
        "data": ret.toJSON(),
        "meta": {
            "version": version
        },
        "errors": ret.errors
    };

}

function parseString(data, options) {
    //data must be a string
    if (!data || typeof(data) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    if (arguments.length === 1) {
        options = {};
    }

    var doc = xmlParser.parse(data);
    return parseXml(doc, options);
}


function parse(doc, options, callback) {
    if (arguments.length === 2) {
        callback = options;
        options = {};
    }

    var xml = xmlParser.parse(doc);

    var componentParser = componentRouter(options.component);
    if (!componentParser) {
        var msg = util.format("Component %s is not supported.", options.component);
        callback(new Error(msg));
        return;
    }
    var ret = componentParser.instance();
    ret.run(xml, options.sourceType);
    ret.cleanupTree(); // first build the data objects up 

    callback(null, ret);
    return ret;
}

module.exports = {
    parse: parse,
    parseXml: parseXml,
    parseString: parseString
};
