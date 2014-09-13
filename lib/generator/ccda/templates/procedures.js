"use strict";

var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

var procTypeToAttr = function(procType) {
    var len = (procType === "procedure" ? 4 : 3);
    return {
        classCode: procType.slice(0, len).toUpperCase(),
        moodCode: "EVN"
    }; 
}

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.7", "2.16.840.1.113883.10.20.22.2.7.1", 
        sec_entries_codes["ProceduresSection"], "PROCEDURES", isCCD);

    var templateIds = {
        "act": "2.16.840.1.113883.10.20.22.4.12",
        "observation": "2.16.840.1.113883.10.20.22.4.13",
        "procedure": "2.16.840.1.113883.10.20.22.4.14"
    }

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var procType = data[i].procedure_type;
        if (templateIds[procType]) {
            var e = xmlDoc.node('entry').attr({typeCode: "DRIV"});
            var typeAttr = procTypeToAttr(procType);
            var t = e.node(procType).attr(typeAttr);
    
            t.node('templateId').attr({root: templateIds[procType]});

            libCCDAGen.id(t, data[i].identifiers);
            
            var p = libCCDAGen.code(t, data[i].procedure);
            p.node('originalText').node('reference').attr({value: "#Proc_" + (i+1)});

            if (data[i].status) {
                var statusCodeObject = libCCDAGen.reverseTable("2.16.840.1.113883.11.20.9.22", data[i].status);
                libCCDAGen.code(t, statusCodeObject, 'statusCode');
            }

            var time = libCCDAGen.getTimes(data[i]["date_time"]);
            libCCDAGen.effectiveTime(t, time);
            
            libCCDAGen.code(t, data[i].priority, 'priorityCode');            
            if (procType === "observation") {
                t.node("value").attr({"xsi:type": "CD"});
            }
            if (procType !== "act") {
                t.node('methodCode').attr({nullFlavor: "UNK"});
            }
            if (data[i].body_sites) {
                libCCDAGen.code(t, data[i].body_sites[0], 'targetSiteCode');
            }
            if ((procType === "procedure") && data[i].specimen) {
                var sp = t.node('specimen').attr({typeCode: "SPC"});
                var sr = sp.node('specimenRole').attr({classCode: "SPEC"});
                libCCDAGen.id(sr, data[i].specimen.identifiers);
                var spe = sr.node('specimenPlayingEntity');
                libCCDAGen.code(spe, data[i].specimen.code);
            }
            var dPerformer = data[i].performer;
            if (dPerformer) {
                libCCDAGen.performerRevised(t, dPerformer[0]);
            }
            libCCDAGen.participant(t, data[i].locations);
        }
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end component
    return isCCD ? xmlDoc : doc;
}
