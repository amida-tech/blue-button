var libxmljs = require("libxmljs");


function writeXML(sectionNumber, data, codeSystems) {
    var xml = {};
    if (sectionNumber == 9) {
        xml = loadVitalSigns(sectionNumber, data, codeSystems);
    }
    return xml;
}


function loadVitalSigns(sectionNumber, data, codeSystems) {
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
            .node('templateID').attr({root: "2.16.840.1.113883.10.20.22.2.4"}).parent()
            .node('templateID').attr({root: "2.16.840.1.113883.10.20.22.2.4.1"}).parent()
            .node('code').attr({code: codeSystems[data[0]["code_system_name"]][1] })
                .attr({codeSystem: codeSystems[data[0]["code_system_name"]][0]})
                .attr({codeSystemName: data[0]["code_system_name"]})
                .attr({displayName: "VITAL SIGNS"}).parent()
            .node('title', "VITAL SIGNS").parent()
            .node('text').parent()

            // entries loop
            for (var i = 0; i < uniqueEntries.length; i++) {
                var effectiveTime = data[i]["date"][0]["date"].split("-");
                effectiveTime[2] = effectiveTime[2].slice(0,2);
                var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
                var organizer = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                                      .node('organizer').attr({classCode: "CLUSTER"}).attr({moodCode: "EVN"});
                    organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.26"}).parent()
                        .node('id').attr({root: data[0]["identifiers"][0]["identifier"]}).parent()
                        .node('code')
                            .attr({code: codeSystems["SNOMED CT"][1] })
                            .attr({codeSystem: codeSystems["SNOMED CT"][0] })
                            .attr({codeSystemName: "SNOMED CT"})
                            .attr({displayName: 'Vital signs'}).parent()
                        .node('statusCode').attr({code: data[0]['status']}).parent()
                        .node('effectiveTime').attr({value: time}).parent()

                        // components loop
                        for (var j = 0; j < entries[uniqueEntries[i]]; j++) {
                            organizer.node('component')
                                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.27"}).parent()
                                    .node('id').attr({root: data[j]['identifiers'][0]['identifier']}).parent()
                                    .node('code').attr({code: codeSystems[data[j]["code_system_name"]][1] })
                                        .attr({codeSystem: codeSystems[data[j]["code_system_name"]][0]})
                                        .attr({codeSystemName: data[j]["code_system_name"]})
                                        .attr({displayName: data[j]['name']}).parent()
                                    .node('text')
                                        .node('reference').attr({value: "#vit" + j}).parent()
                                    .parent()
                                    .node('statusCode').attr({code: data[j]['status']}).parent()
                                    .node('effectiveTime').attr({value: time}).parent()
                                    .node('value').attr({"xsi:type": "PQ"}).attr({value: data[j]["value"]}).attr({unit: data[j]["unit"]}).parent()
                                    .node('interpretationCode').attr({code: "N"}).attr({codeSystem: "2.16.840.1.113883.5.83"}).parent()
                            
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

