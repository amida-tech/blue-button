//sense.js - Determining file content type e.g. CCDA or C32 or BB.json/JSON or text/other formats.

"use strict";

var xml = require("./xml.js");

var DEFAULT_NS = {
  "h": "urn:hl7-org:v3",
  "xsi": "http://www.w3.org/2001/XMLSchema-instance"
};

var senseXml = function(doc){
    //data must be an object
    if (!doc || typeof(doc) !== "object") {
        //TODO: throw a proper error here
        return null;
    }

    var root =doc.root();

    var children = root.find("h:templateId", DEFAULT_NS);

    for(var i=0; i<children.length; i++){
        var child = children[i];
        var id = child.attr("root").value();
        if (id==="2.16.840.1.113883.10.20.22.1.2") { return "ccda"; }
        if (id==="2.16.840.1.113883.3.88.11.32.1") { return "c32"; }
    }
    return "xml";
};

var senseData = function(data){
    //data must be a string
    if (!data || typeof(data) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    if (data.indexOf("<?xml") !== -1) {
        //parse xml object...
        var doc = xml.parse(data);
        var root =doc.root();

        var children = root.find("h:templateId", DEFAULT_NS);


        for(var i=0; i<children.length; i++){
            var child = children[i];
            var id = child.attr("root").value();
            if (id==="2.16.840.1.113883.10.20.22.1.2") { return "ccda"; }
            if (id==="2.16.840.1.113883.3.88.11.32.1") { return "c32"; }
        }
        return "xml";
    }
    else {
       //parse json or determine if text object...
        try {
            JSON.parse(data); // {}
            return "json";
        } catch (e) {
            //console.error("Parsing error:", e);
            return "unknown";
        }
    }

    return "unknown";
};

module.exports = {senseXml:senseXml, senseData:senseData};