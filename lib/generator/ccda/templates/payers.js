var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.18", undefined, 
        sec_entries_codes["PayersSections"], "INSURANCE PROVIDERS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var time = libCCDAGen.getTimes(data[i]["date_time"]);
        xmlDoc = xmlDoc.node('entry').attr({ typeCode: "DRIV" })
            .node('act').attr({ classCode: "ACT" }).attr({ moodCode: "EVN" })
                .node('templateId').attr({ root: "2.16.840.1.113883.10.20.22.4.60" }).parent();
                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
                xmlDoc = libCCDAGen.code(xmlDoc, undefined, bbm.CCDA.sections_entries_codes["codes"]["CoverageActivity"]).parent();
                xmlDoc = xmlDoc.node('statusCode').attr({ code: "completed" }).parent();
                xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "COMP"})
                    .node('act').attr({ classCode: "ACT" }).attr({ moodCode: "EVN" })
                        .node('templateId').attr({ root: "2.16.840.1.113883.10.20.22.4.61" }).parent();
                        xmlDoc = libCCDAGen.id(xmlDoc, data[i]["policy"]["identifiers"]);
                        xmlDoc = libCCDAGen.code(xmlDoc, data[i]["policy"]["code"]).parent();
                        xmlDoc = xmlDoc.node('statusCode').attr({ code: "completed" }).parent();
                        xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i]["policy"]["insurance"] ? data[i]["policy"]["insurance"]["performer"] : undefined, { "typeCode": "PRF", "tID": "2.16.840.1.113883.10.20.22.4.87" });
                        xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i]["guarantor"], { "typeCode": "PRF", "tID": "2.16.840.1.113883.10.20.22.4.89" });

                        // Covered Party Participant
                        xmlDoc = xmlDoc.node('participant').attr({ typeCode: "COV" })
                            .node('templateId').attr({ root: "2.16.840.1.113883.10.20.22.4.89" }).parent();
                            xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time, 'time');
                            xmlDoc = xmlDoc.node('participantRole').attr({ classCode: "PAT"}); 
                                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["participant"]["performer"]["identifiers"]);
                                xmlDoc = libCCDAGen.code(xmlDoc, data[i]["participant"]["code"]).parent();
                                xmlDoc = libCCDAGen.addr(xmlDoc, data[i]["participant"]["performer"]["address"]);
                                xmlDoc = xmlDoc.node('playingEntity');
                                    xmlDoc = libCCDAGen.name(xmlDoc, data[i]["participant"]["name"]);
                                xmlDoc = xmlDoc.parent();
                            xmlDoc = xmlDoc.parent()
                        .parent()
                
                        // Policy Holder
                        xmlDoc = xmlDoc.node('participant').attr({typeCode: "HLD"})
                            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.90"}).parent()
                            .node('participantRole')
                                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["policy_holder"] ? data[i]["policy_holder"]["performer"]["identifiers"] : undefined)
                                xmlDoc = libCCDAGen.addr(xmlDoc, data[i]["policy_holder"] ? data[i]["policy_holder"]["performer"]["address"] : undefined)
                            xmlDoc = xmlDoc.parent()
                        .parent()
                
                        // Authorization Activity
                        xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "REFR"})
                            .node('act').attr({ classCode: "ACT"}).attr({ moodCode: "EVN"})
                                .node('templateId').attr({ root: "2.16.840.1.113883.10.20.1.19"}).parent();
                                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["authorization"] ? data[i]["authorization"]["identifiers"] : undefined);
                                xmlDoc = libCCDAGen.code(xmlDoc, data[i]["code"]).parent();
                                xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: 'SUBJ'})
                                .node('procedure').attr({classCode: "PROC"}).attr({moodCode: "PRMS"})
                                    xmlDoc = libCCDAGen.code(xmlDoc, data[i]["authorization"] ? data[i]["authorization"]["procedure"] ? data[i]["authorization"]["procedure"]["code"] : undefined : undefined).parent()
                                xmlDoc = xmlDoc.parent()
                            .parent()
                        .parent()
                    .parent()
                .parent()
            .parent()
        .parent()
    .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end component/clinicalDocument
    return isCCD ? xmlDoc : doc;
}
