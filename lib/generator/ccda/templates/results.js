"use strict";

var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

var resultsValueAttrs = function(result) {
    var attrs = {"xsi:type": "PQ"};
    if ((result.value !== null) && (result.value !== undefined))  {
        attrs.value = result.value;
    }
    if (result.unit) {
        attrs.unit = result.unit;
    }
    return attrs;
}

var updateEntry = function(xmlDoc, entry) {
    var e = xmlDoc.node('entry').attr({typeCode: "DRIV"});
    var org = e.node('organizer').attr({classCode: "BATTERY"}).attr({moodCode: "EVN"});
    org.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.1"});
    libCCDAGen.id(org, entry.identifiers);
    libCCDAGen.code(org, entry.result_set);
    org.node('statusCode').attr({code: 'completed'});

    if (entry.results) {
        for (var j = 0; j < entry.results.length; j++) {
            var results = entry.results[j];
        
            var comp = org.node('component')
            var ob = comp.node('observation').attr({classCode: "OBS", moodCode: "EVN"});
            ob.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.2"});
            libCCDAGen.id(ob, results.identifiers);
            libCCDAGen.code(ob, results.result);
            ob.node('text').node('reference').attr({value: "#result" + (j + 1)});
            ob.node('statusCode').attr({code: 'completed'});

            var time = libCCDAGen.getTimes(results.date_time);
            libCCDAGen.effectiveTime(ob, time);

            ob.node('value').attr(resultsValueAttrs(results));

            if (results.interpretations) {
                results.interpretations.forEach(function(interpretation) {
                    if (interpretation) {
                        ob.node('interpretationCode').attr({
                            code: interpretation.substr(0, 1),
                            codeSystem: "2.16.840.1.113883.5.83"
                        });
                    }
                });
            } 

            var or = ob.node('referenceRange').node('observationRange');

            if (results.reference_range) {
                if (results.reference_range.range) {
                    or.node('text', results.reference_range.range);
                } else {
                    var v = or.node('value').attr({"xsi:type": "IVL_PQ"});
                    v.node('low').attr({value: results.reference_range.low})
                        .attr({unit: results.reference_range.unit});
                    v.node('high').attr({value: results.reference_range.high})
                        .attr({unit: results.reference_range.unit});
                }
            }                               
        }
    }
}

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.3", 
        "2.16.840.1.113883.10.20.22.2.3.1", sec_entries_codes["ResultsSection"], "RESULTS", isCCD);

    // entries loop
    var n = data.length;
    for (var i=0; i<n; ++i) {
        updateEntry(xmlDoc, data[i]);
    }


    xmlDoc = xmlDoc.parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}
