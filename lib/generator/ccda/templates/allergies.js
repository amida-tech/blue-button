var libxmljs = require("libxmljs");
var genXML = require("../lib/templating_functions.js");


function writeXML(sectionNumber, data, codeSystems) {
    var xml = {};
    if (sectionNumber == 1) {
        xml = loadAllergies(sectionNumber, data, codeSystems);
    }
    return xml;
}


function loadAllergies(sectionNumber, data, codeSystems) {
    // entries[0] -- array of unique entries
    // entries[1] -- object which maps entries to number of entries
    var entries = genXML.getNumEntries(data);



    // allergy problem act
    var doc = new libxmljs.Document();
    // genXML.header(doc, "2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1", 
    //     "48765-2", "2.16.840.1.113883.6.1", undefined, undefined, "ALLERGIES, ADVERSE REACTIONS, ALERTS");
    var xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
        .attr({xmlns: "urn:hl7-org:v3"}).attr({"xmlns:cda": "urn:hl7-org:v3"}).attr({"xmlns:sdtc": "urn:hl7-org:sdtc"})
        .node('section')
            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.2.6"}).parent()
            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.2.6.1"}).parent()
            .node('code').attr({code: "48765-2" })
                .attr({codeSystem: "2.16.840.1.113883.6.1"}).parent()
            .node('title', "ALLERGIES, ADVERSE REACTIONS, ALERTS").parent()
            .node('text').parent()

            // entries loop
            for (var i = 0; i < entries[0].length; i++) {
                var effectiveTime = data[i]["date"][0]["date"].split("-");
                effectiveTime[2] = effectiveTime[2].slice(0,2);
                var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
                var organizer = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                                      .node('act').attr({classCode: "ACT"}).attr({moodCode: "EVN"});

                    // allergy problem act
                    organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.30"}).parent()
                        .node('id').attr({root: "36e3e930-7b14-11db-9fe1-0800200c9a66"}).parent()
                        .node('code')
                            .attr({code: "48765-2" })
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
                                .node('statusCode').attr({code: 'completed'}).parent()
                                .node('effectiveTime')
                                    .node('low').attr({value: time}).parent()
                                .parent()
                                .node('value').attr({"xsi:type": "CD"})
                                              .attr({code: "419511003"})
                                              .attr({displayName: "Propensity to adverse reactions to drug"})
                                              .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                              .attr({codeSystemName: "SNOMED CT"})
                                    .node('originalText')
                                        .node('reference').attr({value: "#reaction" + (i+1)}).parent()
                                    .parent()
                                .parent()
                                .node('participant').attr({typeCode: "CSM"})
                                    .node('participantRole').attr({classCode: "MANU"})
                                        .node('playingEntity').attr({classCode: "MMAT"})
                                            .node('code').attr({code: data[i]["allergen"]["code"]})
                                                         .attr({displayName: data[i]["allergen"]["name"]})
                                                         .attr({codeSystem: codeSystems[data[i]["allergen"]["code_system_name"]]})
                                                         .attr({codeSystemName: data[i]["allergen"]["code_system_name"]})
                                                .node('originalText')
                                                    .node('reference').attr({value: "#reaction" + (i+1)}).parent()
                                                .parent()
                                            .parent()
                                        .parent()
                                    .parent()
                                .parent()

                        // entryRelationship's loop
                        for (var j = 0; j < entries[1][entries[0][i]]; j++) {
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
                                        .attr({displayName: "Inactive"}).parent()
                                .parent()
                            .parent()
                            .node('entryRelationship').attr({typeCode: "MFST"}).attr({inversionInd: "true"})
                                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Allergy status observation
                                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.9"}).parent()
                                    .node('id').attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                                    .node('code').attr({nullFlavor: "NA"}).parent()
                                    .node('text')
                                        .node('reference').attr({value: "#reaction" + (i+1)}).parent()
                                    .parent()
                                    .node('statusCode').attr({code: 'completed'}).parent()
                                    .node('effectiveTime')
                                        .node('low').attr({value: time}).parent()
                                        .node('high').attr({value: "TODO"}).parent()
                                    .parent()
                                    .node('value')
                                        .attr({"xsi:type": "CD"})
                                        .attr({code: data[i]["reaction"][0]["code"]})
                                        .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                        .attr({displayName: data[i]["reaction"][0]["reaction"]["name"]}).parent()
                                    .node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
                                        .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Severity Observation
                                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.8"}).parent()
                                        .node('code').attr({code: "SEV" })
                                        .attr({displayName: "Severity Observation"})
                                        .attr({codeSystem: "2.16.840.1.113883.5.4" })
                                        .attr({codeSystemName: "ActCode" }).parent()
                                        .node('text')
                                            .node('reference').attr({value: "#severity" + (j+ 4 + i)}).parent()
                                        .parent()
                                        .node('statusCode').attr({code: 'completed'}).parent()
                                        .node('value')
                                            .attr({"xsi:type": "CD"})
                                            .attr({code: "255604002"})
                                            .attr({displayName: data[j]["reaction"][0]["severity"]})
                                            .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                            .attr({codeSystemName: "SNOMED CT" }).parent()
                                        .node('interpretationCode')
                                            .attr({code: "S"})
                                            .attr({displayName: 'Susceptible'})
                                            .attr({codeSystem: "2.16.840.1.113883.1.11.78"})
                                            .attr({codeSystemName: "Observation Interpretation" }).parent()
                                        .parent()
                                    .parent()
                                .parent()
                            .parent()
                            .node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
                                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Severity Observation
                                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.8"}).parent()
                                    .node('code').attr({code: "SEV" })
                                    .attr({displayName: "Severity Observation"})
                                    .attr({codeSystem: "2.16.840.1.113883.5.4" })
                                    .attr({codeSystemName: "ActCode" }).parent()
                                    .node('text')
                                        .node('reference').attr({value: "#severity" + ((i == 0) ? (j + i + 2) : (j + i + 1))}).parent()
                                    .parent()
                                    .node('statusCode').attr({code: 'completed'}).parent()
                                    .node('value')
                                        .attr({"xsi:type": "CD"})
                                        .attr({code: data[i]["reaction"][0]["reaction"]["code"]})
                                        .attr({displayName: data[i]["severity"]})
                                        .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                        .attr({codeSystemName: "SNOMED CT" }).parent()
                                    .node('interpretationCode')
                                        .attr({code: "N"})
                                        .attr({displayName: 'Normal'})
                                        .attr({codeSystem: "2.16.840.1.113883.1.11.78"})
                                        .attr({codeSystemName: "Observation Interpretation" }).parent()
                                .parent()
                            .parent()
                        }
                   observation.parent()
                .parent()   
            .parent()
        .parent()
    }   
    xmlDoc.parent() // end section
        .parent(); // end clinicalDocument
    return doc;
}

module.exports = function() {
    return writeXML(arguments["0"], arguments["1"], arguments["2"]);
}

