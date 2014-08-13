"use strict";

var parseCMS = require("./parser/cms/parser.js");

var componentRouter = require("./parser/router").componentRouter;
var xmlParser = require("./xml");
var Component = require("./parser/ccda/component").Component;
var Cleanup = require("./parser/ccda/cleanup");
var util = require("util");
var bb = require("../index.js");

//add model/package version to metadata
var version = require("../package.json").version;

//insert sections list into metadata
function sections(data) {
    if (!data.meta) {
        data.meta = {};
    }

    if (data.data.doc_identifiers) {
        data.meta.identifiers = data.data.doc_identifiers;
        delete data.data.doc_identifiers;
    }
    data.meta.sections = Object.keys(data.data);
    return data;
}

function parseText(txt) {
    //txt must be a string
    if (!txt || typeof (txt) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    return sections(parseCMS.parseCMS(txt));

}

function parseText2(txt) {
    //txt must be a string
    if (!txt || typeof (txt) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    return sections(parseCMS.parseCMS_2(txt));

}

function parseXml(doc, options) {
    //data must be an object
    if (!doc || typeof (doc) !== "object") {
        //TODO: throw a proper error here
        return null;
    }

    if (arguments.length === 1) {
        options = {};
    }

    var componentParser = componentRouter(options.component, bb.senseXml(doc));
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
    return sections({
        "data": ret.toJSON(),
        "meta": {
            "version": version
        },
        "errors": ret.errors
    });

}

function parseString(data, options) {
    //data must be a string
    if (!data || typeof (data) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    if (arguments.length === 1) {
        options = {};
    }

    var doc = xmlParser.parse(data);
    return parseXml(doc, options);
}

/*
OLD PARSER FUNCTION, TO BE REMOVED

function parse_retired(doc, options, callback) {
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
    ret.run(xml, options.sourceKey);
    ret.cleanupTree(options.sourceKey); // first build the data objects up 

    callback(null, ret);
    return ret;
}
*/
module.exports = {
    //parse_retired: parse_retired,
    parseXml: parseXml,
    parseString: parseString,
    parseText: parseText,
    parseText2: parseText2
};
