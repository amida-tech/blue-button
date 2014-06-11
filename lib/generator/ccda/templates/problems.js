var libxmljs = require("libxmljs");


function writeXML(sectionNumber, data, codeSystems) {
    var xml = {};
    if (sectionNumber == 3) {
        xml = loadProblems(sectionNumber, data, codeSystems);
    }
    return xml;
}


function loadProblems(sectionNumber, data, codeSystems) {
     // determining the number of entries
    var entriesArr = [];
    var entries = {};
    for (var i = 0; i < data.length; i++) {
        entriesArr[i] = data[i]["date"][0]["date"].slice(0,4);
        entries[entriesArr[i]] = i + 1;
    }
    var uniqueEntries = entriesArr.filter(function(v,i) { return i == entriesArr.lastIndexOf(v); });

    for (var i = 1; i < uniqueEntries.length; i++) {
        entries[uniqueEntries[i]] = entries[uniqueEntries[i]] - entries[uniqueEntries[i-1]];
    }

    // start the templating
    var doc = new libxmljs.Document();
    var xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
        .attr({xmlns: "urn:hl7-org:v3"}).attr({"xmlns:cda": "urn:hl7-org:v3"}).attr({"xmlns:sdtc": "urn:hl7-org:sdtc"})
        .node('section')
            .node('templateID').attr({root: "2.16.840.1.113883.10.20.22.2.5"}).parent()
            .node('templateID').attr({root: "2.16.840.1.113883.10.20.22.2.5.1"}).parent()
            .node('code').attr({code: "11450-4" })
                .attr({codeSystem: "2.16.840.1.113883.6.1"})
                .attr({codeSystemName: "LOINC"})
                .attr({displayName: "PROBLEM LIST"}).parent()
            .node('title', "PROBLEMS").parent()
            .node('text').parent()

            // entries loop
            for (var i = 0; i < uniqueEntries.length; i++) {
                 var timeArr = [];
                for (var k = 0; k < data[i]["date"].length; k++) {
                    var effectiveTime = data[i]["date"][k]["date"].split("-");
                    effectiveTime[2] = effectiveTime[2].slice(0,2);
                    var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
                    timeArr.push(time);
                }
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
                        .node('low').attr({value: timeArr[0]}).parent()
                        .node('high').attr({value: timeArr[1]}).parent()
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
                                .node('low').attr({value: timeArr[0]}).parent()
                                .node('high').attr({value: timeArr[1]}).parent()
                            .parent()
                            .node('value').attr({"xsi:type": "CD"})
                                          .attr({code: data[i]["code"]})
                                          .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                          .attr({displayName: data[i]["name"]}).parent()
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
                                        .node('low').attr({value: timeArr[0]}).parent()
                                        .node('high').attr({value: timeArr[1]}).parent()
                                    .parent()
                                    .node('value').attr({"xsi:type": "CD"})
                                                  .attr({code: "413322009"})
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
    xmlDoc.parent() // end section
        .parent(); // end clinicalDocument
    return doc;
}

module.exports = function() {
    return writeXML(arguments["0"], arguments["1"], arguments["2"]);
}

