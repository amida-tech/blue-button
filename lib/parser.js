"use strict";

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
            if (sensed.type === 'ncpdp' && parseNCPDP) {
                return parseNCPDP(sensed.xml);
            }
            return parseXml(sensed.xml, options, sensed);
        } else if (sensed.json) {
            return sensed.json;
        } else {
          return null;
        }
    } else {
        return null;
    }
};

module.exports = {
    parse: parse,
    parseXml: parseXml,
    parseString: parseString
};
