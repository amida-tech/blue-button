"use strict";

var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.2", 
        "2.16.840.1.113883.10.20.22.2.2.1", sec_entries_codes["ImmunizationsSection"],"IMMUNIZATIONS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var e = xmlDoc.node('entry').attr({typeCode: "DRIV"});
        var sa = e.node('substanceAdministration').attr({classCode: "SBADM"});
        if (data[i].status) {
            if (data[i]["status"] === "refused") {
                sa.attr({moodCode: "EVN"}).attr({negationInd: "true"})
            } else if (data[i]["status"] === "pending") {
                sa.attr({moodCode: "INT"}).attr({negationInd: "false"})
            } else if (data[i]["status"] === "complete") {
                sa.attr({moodCode: "EVN"}).attr({negationInd: "false"})
            }
        }
        sa.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.52"});                
        libCCDAGen.id(sa, data[i]["identifiers"]);    
            
        sa.node('text').node('reference').attr({value: "#immun" + (i+1)});
        if (data[i].status) {
            sa.node('statusCode').attr({code: data[i].status});
        }
        if (data[i].date_time) {
            var time = libCCDAGen.getTimes(data[i].date_time);
            libCCDAGen.effectiveTime(sa, time, undefined, 'IVL_TS');
        }
        libCCDAGen.routeCode(sa, data[i]["administration"], true);
        if (data[i].administration && data[i].administration.body_site) {
            libCCDAGen.code(sa, data[i].administration.body_site, 'approachSiteCode');
        }
        libCCDAGen.doseQuantity(sa, data[i]["administration"]);
        libCCDAGen.consumable(sa, data[i]["product"], "#immi" + (i + 1));
        libCCDAGen.performerRevised(sa, data[i]["performer"], {});
        if (data[i].instructions) {
            libCCDAGen.entryRelationship(sa, data[i].instructions, 'act', 'SUBJ', '#immunSect', "2.16.840.1.113883.10.20.22.4.20");
        }
        if (data[i].refusal_reason) {
            var rrData = {code: libCCDAGen.reverseTable("2.16.840.1.113883.5.8", data[i].refusal_reason)};
            libCCDAGen.entryRelationship(sa, rrData, 'observation', 'RSON', undefined, "2.16.840.1.113883.10.20.22.4.53");
        }
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument

    return isCCD ? xmlDoc : doc;
}
