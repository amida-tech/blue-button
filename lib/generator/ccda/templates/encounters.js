var libxmljs = require("libxmljs");


function writeXML(sectionNumber, data, codeSystems) {
    var xml = {};
    if (sectionNumber == 7) {
        xml = loadEncounters(sectionNumber, data, codeSystems);
    }
    return xml;
}


function loadEncounters(sectionNumber, data, codeSystems) {
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
            .node('templateID').attr({root: "2.16.840.1.113883.10.20.22.2.22"}).parent()
            .node('templateID').attr({root: "2.16.840.1.113883.10.20.22.2.22.1"}).parent()
            .node('code').attr({code: "46240-8" })
                .attr({codeSystem: "2.16.840.1.113883.6.1"})
                .attr({codeSystemName: "LOINC"})
                .attr({displayName: "History of encounters"}).parent()
            .node('title', "ENCOUNTERS").parent()
            .node('text').parent()

            // entries loop
            for (var i = 0; i < uniqueEntries.length; i++) {
                var effectiveTime = data[i]["date"][0]["date"].split("-");
                effectiveTime[2] = effectiveTime[2].slice(0,2);
                var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
                var organizer = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                                      .node('encounter').attr({classCode: "ENC"}).attr({moodCode: "EVN"}); // encounter activities
                    organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.49"}).parent()
                        .node('id').attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                        .node('code')
                            .attr({code: data[i]["code"] })
                            .attr({displayName: data[i]["name"]})
                            .attr({codeSystemName: data[i]["code_system_name"]})
                            .attr({codeSystem: "2.16.840.1.113883.6.12" })
                            .attr({codeSystemVersion: "4"})
                            .node('originalText', "Checkup Examination")
                                .node('reference').attr({value: "#encounter" + (i+1)}).parent()
                            .parent()
                            .node('translation').attr({code: data[i]["translations"][0]["code"]})
                                                .attr({codeSystem: "2.16.840.1.113883.5.4"})
                                                .attr({displayName: data[i]["translations"][0]["name"]})
                                                .attr({codeSystemName: data[i]["translations"][0]["code_system_name"]}).parent()
                        .parent()
                        .node('effectiveTime').attr({value: time}).parent()
                        .node('performer')
                            .node('assignedEntity')
                                .node('id').attr({root: "PseduoMD-3"}).parent()
                                .node('code').attr({code: "59058001"})
                                             .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                             .attr({codeSystemName: "SNOMED CT"})
                                             .attr({displayName: "General Physician"}).parent()
                            .parent()
                        .parent()
                        .node('participant').attr({typeCode: "LOC"})
                            .node('participantRole').attr({classCode: "SDLOC"}) // service delivery location template
                                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.32"}).parent()
                                .node('code').attr({code: data[i]["locations"][0]["type"]["code"]})
                                             .attr({codeSystemName: data[i]["locations"][0]["type"]["code_system_name"]})
                                             .attr({displayName: data[i]["locations"][0]["type"]["name"]})
                                             .attr({codeSystem: "2.16.840.1.113883.6.259"}).parent()
                                .node('addr')
                                    .node('streetAddressLine', data[i]["locations"][0]["addresses"][0]["streetLines"][0]).parent()
                                    .node('city', data[i]["locations"][0]["addresses"][0]["city"]).parent()
                                    .node('state', data[i]["locations"][0]["addresses"][0]["state"]).parent()
                                    .node('postalCode', data[i]["locations"][0]["addresses"][0]["zip"]).parent()
                                    .node('country', data[i]["locations"][0]["addresses"][0]["country"]).parent()
                                .parent()
                                .node('telecom').attr({nullFlavor: "UNK"}).parent()
                                .node('playingEntity').attr({classCode: "PLC"})
                                    .node('name', data[i]["locations"][0]["name"]).parent()
                                .parent()
                            .parent()
                        .parent()
                        .node('entryRelationship').attr({typeCode: "RSON"})
                            .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.19"}).parent()
                                .node('id').attr({root: "db734647-fc99-424c-a864-7e3cda82e703"}).attr({extension: "45665"}).parent()
                                .node('code').attr({code: "404684003"}).attr({displayName: "Finding"})
                                             .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                             .attr({codeSystemName: "SNOMED CT"}).parent()
                                .node('statusCode').attr({code: 'completed'}).parent()
                                .node('effectiveTime')
                                    .node('low').attr({value: time}).parent()
                                .parent()
                                .node('value').attr({"xsi:type": "CD"})
                                              .attr({code: data[i]["findings"][0]["code"]})
                                              .attr({displayName: data[i]["findings"][0]["name"]})
                                              .attr({codeSystem: "2.16.840.1.113883.6.96"}).parent()
                            .parent()
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

