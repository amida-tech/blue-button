var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function(data, codeSystems, isCCD, CCDxml) {
     // determining the number of entries
    var entries = libCCDAGen.getNumEntries(data)

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.5", "2.16.840.1.113883.10.20.22.2.5.1", "11450-4", 
            "2.16.840.1.113883.6.1", "LOINC", "PROBLEM LIST", "PROBLEMS", isCCD);
    
            // entries loop
            for (var i = 0; i < entries[0].length; i++) {
                var time = libCCDAGen.getTimes(data[i]["date"]);
                
                var organizer = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                                      .node('act').attr({classCode: "ACT"}).attr({moodCode: "EVN"}); // problem concern act
                    organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.3"}).parent()
                    .node('id').attr({root: data[i]["source_list_identifiers"][0]["identifier"]}).parent()
                    .node('code')
                        .attr({code: "CONC" })
                        .attr({codeSystem:  "2.16.840.1.113883.5.6"})
                        .attr({displayName: 'Concern'}).parent()
                    .node('statusCode').attr({code: 'completed'}).parent()
                    .node('effectiveTime')
                        .node('low').attr({value: time[0]}).parent()
                        .node('high').attr({value: time[2]}).parent()
                    .parent()
                    .node('entryRelationship').attr({typeCode: "SUBJ"})
                        .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) //problem observation
                            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.4"}).parent()
                            .node('id').attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                            .node('code').attr({code: "409586006"}).attr({codeSystem: "2.16.840.1.113883.6.96"})
                                         .attr({displayName: "Complaint"}).parent()
                            .node('text')
                                .node('reference').attr({value: "#problem" + (i+1)}).parent()
                            .parent()
                            .node('statusCode').attr({code: "completed"}).parent()
                            .node('effectiveTime')
                                .node('low').attr({value: time[0]}).parent()
                                .node('high').attr({value: time[2]}).parent()
                            .parent()
                            .node('value').attr({"xsi:type": "CD"})
                                          .attr({code: data[i]["problem"]["code"]})
                                          .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                          .attr({displayName: data[i]["problem"]["name"]}).parent()
                            .node('entryRelationship').attr({typeCode: "REFR"})
                                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // problem status observation
                                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.6"}).parent()
                                    .node('id').attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                                    .node('code').attr({code: "33999-4"}).attr({codeSystem: "2.16.840.1.113883.6.1"})
                                                 .attr({displayName: "Status"}).parent()
                                    .node('text')
                                        .node('reference').attr({value: "#STAT" + (i+1)}).parent()
                                    .parent()
                                    .node('statusCode').attr({code: "completed"}).parent()
                                    .node('effectiveTime')
                                        .node('low').attr({value: time[0]}).parent()
                                        .node('high').attr({value: time[2]}).parent()
                                    .parent()
                                    .node('value').attr({"xsi:type": "CD"})
                                                  .attr({code: "55561003"})
                                                  .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                                  .attr({displayName: data[i]["status"]}).parent()
                                .parent()
                            .parent()
                            .node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
                                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) //age observation template
                                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.31"}).parent()
                                    .node('code').attr({code: "445518008"}).attr({codeSystem: "2.16.840.1.113883.6.96"})
                                                 .attr({displayName: "Age at onset"}).parent()
                                    .node('statusCode').attr({code: "completed"}).parent()
                                    .node('value').attr({"xsi:type": "PQ"})
                                                  .attr({value: data[i]["onset_age"]})
                                                  .attr({unit: "a"}).parent()
                                .parent()
                            .parent()
                            .node('entryRelationship').attr({typeCode: "REFR"})
                                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) //health status observation template
                                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.5"}).parent()
                                    .node('code').attr({code: "11323-3"}).attr({codeSystem: "2.16.840.1.113883.6.1"})
                                                 .attr({codeSystemName: "LOINC"})
                                                 .attr({displayName: "Health status"}).parent()
                                    .node('text')
                                        .node('reference').attr({value: "#problems"}).parent()
                                    .parent()
                                    .node('statusCode').attr({code: "completed"}).parent()
                                    .node('value').attr({"xsi:type": "CD"})
                                                  .attr({code: "81323004"})
                                                  .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                                  .attr({codeSystemName: "SNOMED CT"})
                                                  .attr({displayName: data[i]["patient_status"]}).parent()
                                .parent()
                            .parent()
                        xmlDoc.parent()
                    .parent()
            }   
    xmlDoc = xmlDoc.parent() // end section
        .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}