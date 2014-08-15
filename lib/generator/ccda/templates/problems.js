var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.5", "2.16.840.1.113883.10.20.22.2.5.1", "11450-4",
        "2.16.840.1.113883.6.1", "LOINC", "PROBLEM LIST", "PROBLEMS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var time = libCCDAGen.getTimes(data[i]["date_time"]);

        xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"})
            .node('act').attr({classCode: "ACT"})
                .attr({moodCode: "EVN"}) // problem concern act
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.3"}).parent();
                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["source_list_identifiers"]);
                xmlDoc = libCCDAGen.code(xmlDoc, undefined, sec_entries_codes["ProblemConcernAct"]).parent();
                xmlDoc = xmlDoc.node('statusCode').attr({code: 'completed'}).parent()
                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, libCCDAGen.getTimes(data[i]["date_time"]));
                xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"})
                    .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) //problem observation
                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.4"}).parent();
                        xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
                        xmlDox = xmlDoc.node('code') // TODO
                            .attr({code: "409586006"})
                            .attr({codeSystem: "2.16.840.1.113883.6.96"})
                            .attr({displayName: "Complaint"}).parent()
                        .node('text')
                            .node('reference').attr({value: "#problem" + (i + 1)}).parent()
                        .parent()
                        .node('statusCode').attr({code: "completed"}).parent();
                        xmlDoc = libCCDAGen.effectiveTime(xmlDoc, libCCDAGen.getTimes(data[i]["problem"] ? data[i]["problem"]["date_time"] : time));
                        xmlDoc = libCCDAGen.value(xmlDoc, data[i]["problem"], "CD");
                        xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "REFR"})
                            .node('observation').attr({classCode: "OBS"})
                                .attr({moodCode: "EVN"}) // problem status observation
                                .node('templateId')
                                    .attr({root: "2.16.840.1.113883.10.20.22.4.6"}).parent();
                                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
                                xmlDoc = libCCDAGen.code(xmlDoc, undefined, sec_entries_codes["ProblemStatus"]).parent();
                                xmlDoc = xmlDoc.node('text')
                                    .node('reference').attr({value: "#STAT" + (i + 1)}).parent()
                                .parent()
                                .node('statusCode').attr({code: "completed"}).parent();
                                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, libCCDAGen.getTimes(data[i]["status"] ? data[i]["status"]["date_time"] : time));
                                xmlDoc = libCCDAGen.value(xmlDoc, 
                                    libCCDAGen.reverseTable("2.16.840.1.113883.3.88.12.80.68", 
                                        data[i]["status"]), "CD");
                            xmlDoc = xmlDoc.parent()
                        .parent()
                        .node('entryRelationship').attr({typeCode: "SUBJ"})
                            .attr({inversionInd: "true"})
                            .node('observation').attr({classCode: "OBS"})
                                .attr({moodCode: "EVN"}) // age observation template
                                .node('templateId')
                                    .attr({root: "2.16.840.1.113883.10.20.22.4.31"}).parent();
                                xmlDoc = libCCDAGen.code(xmlDoc, undefined, sec_entries_codes["AgeObservation"]).parent();
                                xmlDoc = xmlDoc.node('statusCode')
                                    .attr({code: "completed"}).parent()
                                .node('value').attr({"xsi:type": "PQ"})
                                    .attr({value: data[i]["onset_age"]})
                                    .attr({unit: "a"}).parent()
                            .parent()
                        .parent()
                        .node('entryRelationship').attr({typeCode: "REFR"})
                            .node('observation').attr({classCode: "OBS"})
                                .attr({moodCode: "EVN"}) // health status observation template
                                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.5"}).parent()
                                xmlDoc = libCCDAGen.code(xmlDoc, undefined, sec_entries_codes["HealthStatusObservation"]).parent();
                                xmlDoc = xmlDoc.node('text')
                                    .node('reference').attr({value: "#problems"}).parent()
                                .parent()
                                .node('statusCode')
                                    .attr({code: "completed"}).parent()
                                .node('value') // TODO
                                    .attr({"xsi:type": "CD"})
                                    .attr({code: "81323004"})
                                    .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                    .attr({codeSystemName: "SNOMED CT"})
                                    .attr({displayName: data[i]["patient_status"]}).parent()
                            .parent()
                        .parent()
                    xmlDoc = xmlDoc.parent()
                .parent()
            .parent()
        .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent() // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}
