"use strict";

var parseCMS = require("blue-button-cms");

var componentRouter = require("./parser/router").componentRouter;
var xmlParser = require("blue-button-xml").xmlUtil;
var util = require("util");
var sense = require("./sense.js");

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

    return sections(parseCMS.parseText(txt));
}

function parseXml(doc, options, sensed) {
    //data must be an object
    if (!doc || typeof (doc) !== "object") {
        //TODO: throw a proper error here
        return null;
    }

    if (arguments.length === 1) {
        options = {};
    }

    if (!sensed) {
        sensed = sense.senseXml(doc);
    }

    var componentParser = componentRouter(options.component, sensed);

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

var parse = function (data, options) {
    //data must be a string
    if (!data || typeof (data) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    if (arguments.length === 1) {
        options = {};
    }

    var sensed = sense.senseString(data);

    if (sensed) {
        if (sensed.xml) {
            return parseXml(sensed.xml, options, sensed);
        } else if (sensed.json) {
            return sensed.json;
        } else {
            return parseText(data);
        }
    } else {
        return null;
    }
};

module.exports = {
    parse: parse,
    parseXml: parseXml,
    parseString: parseString,
    parseText: parseText
};
