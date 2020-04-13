//sense.js - Determining file content type e.g. CCDA or C32 or BB.json/JSON or text/other formats.

"use strict";

var xml = require("blue-button-xml").xmlUtil;

//Sense document type based on XML object
var senseXml = function (doc) {
    //data must be an object
    if (!doc || typeof (doc) !== "object") {
        //TODO: throw a proper error here
        return null;
    }

    var ccdResult = xml.xpath(doc, 'h:templateId[@root=\"2.16.840.1.113883.10.20.22.1.1\"] | h:templateId[@root=\"2.16.840.1.113883.10.20.22.1.2\"]');
    if (ccdResult && ccdResult.length > 0) {
        return {
            type: "ccda"
        };
    }

    var c32Result = xml.xpath(doc, 'h:templateId[@root=\"2.16.840.1.113883.3.88.11.32.1\"]');
    if (c32Result && c32Result.length > 0) {
        return {
            type: "c32"
        };
    }

    var cdaResult = xml.xpath(doc, 'h:templateId[@root=\"2.16.840.1.113883.10.20.1\"]');
    var cdaTemplateResult = xml.xpath(doc, 'h:code[@code=\"34133-9\"][@codeSystem=\"2.16.840.1.113883.6.1\"]');
    if ((cdaResult && cdaResult.length > 0) && (cdaTemplateResult && cdaTemplateResult.length > 0)) {
        return {
            type: "cda"
        };
    }

    var ncpdpResult = xml.xpath(doc, '//Message/Body/*');
    if (ncpdpResult && ncpdpResult.length > 0) {
        try {
            require.resolve("blue-button-ncpdp"); // check if the module is present
            return {
                type: "ncpdp"
            };
        } catch (ex) {}
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
