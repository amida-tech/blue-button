var libxmljs = require("libxmljs");


function writeXML(sectionNumber, data, codeSystems) {
    var xml = {};
    if (sectionNumber == 1) {
        xml = loadAllergies(sectionNumber, data, codeSystems);
    }
    return xml;
}


function loadAllergies(sectionNumber, data, codeSystems) {
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

    // allergy problem act
    var doc = new libxmljs.Document();
    var xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
        .attr({xmlns: "urn:hl7-org:v3"}).attr({"xmlns:cda": "urn:hl7-org:v3"}).attr({"xmlns:sdtc": "urn:hl7-org:sdtc"})
        .node('section')
            .node('templateID').attr({root: "2.16.840.1.113883.10.20.22.2.6"}).parent()
            .node('templateID').attr({root: "2.16.840.1.113883.10.20.22.2.6.1"}).parent()
            .node('code').attr({code: "48765-2" })
                .attr({codeSystem: "2.16.840.1.113883.6.1"})
            .node('title', "ALLERGIES, ADVERSE REACTIONS, ALERTS").parent()
            .node('text').parent()

            // entries loop
            for (var i = 0; i < uniqueEntries.length; i++) {
                var effectiveTime = data[i]["date"][0]["date"].split("-");
                effectiveTime[2] = effectiveTime[2].slice(0,2);
                var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
                var organizer = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                                      .node('act').attr({classCode: "ACT"}).attr({moodCode: "EVN"});

                    // allergy problem act
                    organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.30"}).parent()
                        .node('id').attr({root: data[0]["identifiers"][0]["identifier"]}).parent()
                        .node('code')
                            .attr({code: "8716-3" })
                            .attr({codeSystem: codeSystems["LOINC"][0] })
                            .attr({codeSystemName: "LOINC"})
                            .attr({displayName: 'Allergies, adverse reactions, alerts'}).parent()
                        .node('statusCode').attr({code: 'active'}).parent()
                        .node('effectiveTime').attr({value: time}).parent()
                        
                        var observation = organizer.node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
                            .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.7"}).parent() // allergy observation
                                .node('id').attr({root: data[0]["identifiers"][0]["identifier"]}).parent()
                                .node('code').attr({code: "ASSERTION"}).attr({codeSystem: "2.16.840.1.113883.5.4"}).parent()
                                .node('statusCode').attr({code: 'completed'})
                                .node('effectiveTime')
                                    .node('low').attr({value: time}).parent()
                                .parent()
                                .node('value').attr({"xsi:type": "CD"})
                                              .attr({code: "419511003"})
                                              .attr({displayName: "Propensity to adverse reactions to drug"})
                                              .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                              .attr({codeSystemName: "SNOMED CT"}).parent()
                                .node('originalText')
                                    .node('reference').attr({value: "#reaction" + i}).parent()
                                .parent()
                                .node('participant').attr({typeCode: "CSM"})
                                    .node('participantRole').attr({classCode: "MANU"})
                                        .node('playingEntity').attr({classCode: "MMAT"})
                                            .node('code').attr({code: data[i]["code"]})
                                                         .attr({displayName: data[i]["name"]})
                                                         .attr({codeSystem: codeSystems[data[i]["code_system_name"]]})
                                                         .attr({codeSystemName: data[0]["code_system_name"]})
                                                .node('originalText')
                                                    .node('reference').attr({value: "#reaction" + i}).parent()
                                                .parent()
                                            .parent()
                                        .parent()
                                    .parent()
                                .parent()

                        // entryRelationship's loop
                        for (var j = 0; j < entries[uniqueEntries[i]]; j++) {
                            observation.node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
                                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Allergy status observation
                                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.28"}).parent()
                                    .node('code').attr({code: "33999-4" })
                                        .attr({codeSystem: "2.16.840.1.113883.6.1" })
                                        .attr({codeSystemName: "LOINC" })
                                        .attr({displayName: "Status"}).parent()
                                    .node('statusCode').attr({code: 'completed'}).parent()
                                    .node('value')
                                        .attr({"xsi:type": "CE"})
                                        .attr({code: "73425007"})
                                        .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                        .attr({displayName: "Inactive"})
                                    .parent()
                                .parent()
                            .parent()
                            .node('entryRelationship').attr({typeCode: "MFST"}).attr({inversionInd: "true"})
                                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Allergy status observation
                                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.9"}).parent()
                                    .node('id').attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                                    .node('code').attr({nullFlavor: "NA"}).parent()
                                    .node('text')
                                        .node('reference').attr({value: "#reaction" + j}).parent()
                                    .parent()
                                    .node('statusCode').attr({code: 'completed'}).parent()
                                    .node('effectiveTime')
                                        .node('low').attr({value: time}).parent()
                                        .node('high').attr({value: "TODO"}).parent()
                                    .parent()
                                    .node('value')
                                        .attr({"xsi:type": "CD"})
                                        .attr({code: data[i]["reaction"]["code"]})
                                        .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                        .attr({displayName: "Nausea"}).parent()
                                    .node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
                                        .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Severity Observation
                                            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.28"}).parent()
                                            .node('code').attr({code: "SEV" })
                                            .attr({displayName: "Severity Observation"})
                                            .attr({codeSystem: "2.16.840.1.113883.5.4" })
                                            .attr({codeSystemName: "ActCode" }).parent()
                                            .node('text')
                                                .node('reference').attr({value: "#severity" + j}).parent()
                                            .parent()
                                            .node('statusCode').attr({code: 'completed'}).parent()
                                            .node('value')
                                                .attr({"xsi:type": "CD"})
                                                .attr({code: "LOOKUP"})
                                                .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                                .attr({codeSystemName: "SNOMED CY" }).parent()
                                            .node('interpretationCode')
                                                .attr({code: "S"})
                                                .attr({displayName: 'Susceptible'})
                                                .attr({codeSystem: "2.16.840.1.113883.10.20.22.4.8"})
                                                .attr({codeSystemName: "Observation Interpretation" }).parent()
                                        .parent()
                                    .parent()
                                .parent()
                                .node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
                                    .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Severity Observation
                                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.28"}).parent()
                                        .node('code').attr({code: "SEV" })
                                        .attr({displayName: "Severity Observation"})
                                        .attr({codeSystem: "2.16.840.1.113883.5.4" })
                                        .attr({codeSystemName: "ActCode" }).parent()
                                        .node('text')
                                            .node('reference').attr({value: "#severity" + j}).parent()
                                        .parent()
                                        .node('statusCode').attr({code: 'completed'}).parent()
                                        .node('value')
                                            .attr({"xsi:type": "CD"})
                                            .attr({code: "LOOKUP"})
                                            .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                            .attr({codeSystemName: "SNOMED CY" }).parent()
                                        .node('interpretationCode')
                                            .attr({code: "N"})
                                            .attr({displayName: 'Normal'})
                                            .attr({codeSystem: "2.16.840.1.113883.1.11.78"})
                                            .attr({codeSystemName: "Observation Interpretation" }).parent()
                                    .parent()
                                .parent()
                            .parent()
                        .parent()
                    .parent()
                .parent()                 
            }
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

