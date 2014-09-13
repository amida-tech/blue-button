"use strict";

var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];
var OIDs = require("../../../parser/ccda/oids.js");

var updateInterpretationCodes = (function() {   // merge with templating_functions.reversetable and move to bbm at some point
    var table = OIDs["2.16.840.1.113883.5.83"].table;
    var rTable = Object.keys(table).reduce(function(r, key) {
        r[table[key]] = key;
        return r;
    }, {});

    return function(xmlDoc, interpretations) {
        if (interpretations) {
            interpretations.forEach(function(interpretation) {
                var code = rTable[interpretation];
                if (code) {
                    var codeObj = {
                        "displayName": interpretation, 
                        "code": code,
                        "code_system": "2.16.840.1.113883.5.83", 
                        "code_system_name": "HL7 Result Interpretation"
                    }
                    libCCDAGen.code(xmlDoc, codeObj, 'interpretationCode');
                }
            });
        }
    }
})();

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    // determining the number of entries
    //var entries = libCCDAGen.getNumEntries(data);

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.4", "2.16.840.1.113883.10.20.22.2.4.1", "8716-3",
        "2.16.840.1.113883.6.1", "LOINC", "VITAL SIGNS", "VITAL SIGNS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var e = xmlDoc.node('entry').attr({typeCode: "DRIV"});
        var org = e.node('organizer').attr({classCode: "CLUSTER", moodCode: "EVN"});
        org.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.26"});

        libCCDAGen.id(org, data[i]["identifiers"]);

        libCCDAGen.asIsCode(org, sec_entries_codes.VitalSignsOrganizer);

        if (data[i].status) {
            org.node('statusCode').attr({code: data[i].status});
        }

        var time = libCCDAGen.getTimes(data[i]["date_time"]);
        libCCDAGen.effectiveTime(org, time);

        // components loop
        var c = org.node('component');
        var ob = c.node('observation').attr({classCode: "OBS", moodCode: "EVN"});
        ob.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.27"});

        libCCDAGen.id(ob, data[i].identifiers);
        libCCDAGen.code(ob, data[i].vital);

        if (data[i].status) {
            ob.node('text').node('reference').attr({value: "#vit" + i});
            ob.node('statusCode').attr({code: data[i].status});
        }

        libCCDAGen.effectiveTime(ob, libCCDAGen.getTimes(data[i].date_time));

        if (data[i].value) {
            if (data[i].unit) {
                ob.node('value').attr({
                    "xsi:type": "PQ",
                    value: data[i].value,
                    unit: data[i].unit
                });
            } else {
                ob.node('value').attr({
                    "xsi:type": "PQ",
                    value: data[i].value
                });
            }
        }
    
        updateInterpretationCodes(ob, data[i].interpretations);
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}
