"use strict";

var parseCMS = require("blue-button-cms");
var parseNCPDP;
var _ = require('lodash');

try {
    parseNCPDP = require("blue-button-ncpdp").parseXml;
} catch (ex) {
    parseNCPDP = null;
}

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

    if (data.data.meta) {
        _.extend(data.meta, data.data.meta);
        delete data.data.meta;
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

    console.time('load');
    var componentParser = componentRouter(options.component, sensed);
    console.timeEnd('load');

    if (!componentParser) {
        var msg = util.format("Component %s is not supported.", options.component);
        //callback(new Error(msg)); //TODO:revise this use of callbacks
        return {
            "errors": new Error(msg)
        };
    }

    var ret = componentParser(doc, options);
    console.time('return');
    return sections({
        "data": ret.data,
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
    console.time('sensing');
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
            if (sensed.type === 'ncpdp' && parseNCPDP) {
                return parseNCPDP(sensed.xml);
            }
            console.timeEnd('sensing');
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
