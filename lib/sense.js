//sense.js - Determining file content type e.g. CCDA or C32 or BB.json/JSON or text/other formats.

"use strict";

var xml = require("./xml.js");

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

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var id = child.attr("root").value();
        if (id === "2.16.840.1.113883.10.20.22.1.2") {
            return {
                type: "ccda"
            };
        }
        if (id === "2.16.840.1.113883.10.20.1") {
            return {
                type: "ccda-r1"
            };
        }
        if (id === "2.16.840.1.113883.3.88.11.32.1") {
            return {
                type: "c32"
            };
        }
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

    //TODO: better xml detection needed
    if (data.indexOf("<?xml") !== -1) {
        //parse xml object...
        var doc;
        try {
            doc = xml.parse(data);
        } catch (ex) {
            return {
                type: "unknown",
                error: ex
            };
        }
        var root = doc.root();

        var children = root.find("h:templateId", DEFAULT_NS);

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var id = child.attr("root").value();
            if (id === "2.16.840.1.113883.10.20.22.1.2") {
                return {
                    type: "ccda",
                    xml: doc
                };
            }
            if (id === "2.16.840.1.113883.3.88.11.32.1") {
                return {
                    type: "c32",
                    xml: doc
                };
            }
        }
        return {
            type: "xml",
            xml: doc
        };
    } else {
        //parse json or determine if text object...
        try {
            var json = JSON.parse(data); // {}
            return {
                type: "json",
                json: json
            };
        } catch (e) {
            //console.error("Parsing error:", e);

            if (data.indexOf("MYMEDICARE.GOV PERSONAL HEALTH INFORMATION") > 0 &&
                data.indexOf("Produced by the Blue Button") > 0) {
                var version = "";

                var reg_exp_v = /Produced by the Blue Button \(v(\d+\.\d+)\)/g;
                version = reg_exp_v.exec(data)[1];

                return {
                    type: "cms",
                    version: version
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
