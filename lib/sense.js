//sense.js - Determining file content type e.g. CCDA or C32 or BB.json/JSON or text/other formats.

"use strict";

var xml = require("./xml.js");
var _ = require("underscore");

var DEFAULT_NS = {
    "h": "urn:hl7-org:v3",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance"
};

//Sense document type based on XML object
var senseXml = function (doc) {
    //data must be an object
    if (!doc || typeof (doc) !== "object") {
        //TODO: throw a proper error here
        return null;
    }

    var root = doc.root();

    var children = root.find("h:templateId", DEFAULT_NS);

    //Extension for CDA R2 headers.
    var code_children = root.find("h:code", DEFAULT_NS);

    var c32Result = _.find(children, function (child) {
        if (child.attr("root").value() === "2.16.840.1.113883.3.88.11.83.1") {
            return true;
        } else {
            return false;
        }
    });

    if (c32Result !== undefined) {
        return {
            type: "c32"
        };
    }

    var CDAResult = _.find(children, function (child) {
        if (child.attr("root").value() === "2.16.840.1.113883.10.20.1") {
            return true;
        } else {
            return false;
        }
    });

    var CDATemplateResult = _.find(code_children, function (child) {
        if (child.attr("code").value() === "34133-9") {
            if (child.attr("codeSystem").value() === "2.16.840.1.113883.6.1") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    });

    if (CDAResult !== undefined && CDATemplateResult !== undefined) {
        return {
            type: "cda"
        };
    }

    var CCDResult = _.find(children, function (child) {
        if (child.attr("root").value() === "2.16.840.1.113883.10.20.22.1.2") {
            return true;
        } else {
            return false;
        }
    });

    if (CCDResult !== undefined) {
        return {
            type: "ccda"
        };
    }

    return {
        type: "xml"
    };
};

//Sense document type based on String
var senseString = function (data) {
    //data must be a string

    if (!data || typeof (data) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    //console.log(data);
    var doc;
    var result;
    var version = "";
    var reg_exp_v;

    //TODO: better xml detection needed
    if (data.indexOf("<?xml") !== -1 || data.indexOf("<ClinicalDocument") !== -1) {
        //parse xml object...
        try {
            doc = xml.parse(data);
        } catch (ex) {
            return {
                type: "unknown",
                error: ex
            };
        }

        result = senseXml(doc);
        result.xml = doc;

        return result;

    } else if (data.trim().indexOf("<") === 0) {
        //sensing xml with no xml declaration
        //TODO: there should be a better way (like comparing first and last tags and see if they match)

        doc;
        try {
            doc = xml.parse(data);
        } catch (ex) {
            return {
                type: "unknown",
                error: ex
            };
        }

        result = senseXml(doc);
        result.xml = doc;

        return result;
    } else {
        //parse json or determine if text object...
        try {
            var json = JSON.parse(data); // {}

            if (json.data && json.meta) {
                return {
                    type: "blue-button.js",
                    json: json
                };

            } else {

                return {
                    type: "json",
                    json: json
                };
            }
        } catch (e) {
            //console.error("Parsing error:", e);

            if (data.indexOf("MYMEDICARE.GOV PERSONAL HEALTH INFORMATION") > 0 &&
                data.indexOf("Produced by the Blue Button") > 0) {
                version = "";

                reg_exp_v = /Produced by the Blue Button \(v(\d+\.\d+)\)/g;
                version = reg_exp_v.exec(data)[1];

                return {
                    type: "cms",
                    version: version
                };
            } else if (data.indexOf("MY HEALTHEVET PERSONAL INFORMATION REPORT") > 0) {
                version = "";

                reg_exp_v = /utton \(v(\d+.\d+|\d+)\)/g;
                version = reg_exp_v.exec(data)[1];

                return {
                    type: "va",
                    version: version
                };
            } else if (data.indexOf("%PDF") === 0) {
                return {
                    type: "pdf"
                };
            } else if (data.indexOf("+\n  Disclaimer:") > 0) {
                return {
                    type: "format-x"
                };
            }

            return {
                type: "unknown"
            };
        }
    }

    return {
        type: "unknown"
    };
};

module.exports = {
    senseXml: senseXml,
    senseString: senseString
};
