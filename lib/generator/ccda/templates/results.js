var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

function writeXML(data, codeSystems) {
    var xml = {};
    xml = loadResults(data, codeSystems);
    return xml;
}

function loadResults(data, codeSystems) {
// demographics
var doc = new libxmljs.Document();
var xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
    .attr({xmlns: "urn:hl7-org:v3"}).attr({"xmlns:cda": "urn:hl7-org:v3"}).attr({"xmlns:sdtc": "urn:hl7-org:sdtc"})
    .node('section')
        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.2.3"}).parent()
        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.2.3.1"}).parent()
        .node('code').attr({code: "30954-2" })
            .attr({codeSystem: "2.16.840.1.113883.6.1"})
            .attr({codeSystemName: "LOINC"})
            .attr({displayName: "RESULTS"}).parent()
        .node('title', "RESULTS").parent()
        .node('text').parent()
        // entries loop
        var organizer = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                              .node('organizer').attr({classCode: "BATTERY"}).attr({moodCode: "EVN"});
            organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.1"}).parent()
                .node('id').attr({root: data[0]["identifiers"][0]["identifier"]}).parent()
                .node('code')
                    .attr({code: data[0]["result_set"]["code"] })
                    .attr({displayName: data[0]["result_set"]["name"]})
                    .attr({codeSystem: codeSystems["SNOMED CT"][0] })
                    .attr({codeSystemName: data[0]["result_set"]["code_system_name"]}).parent()
                .node('statusCode').attr({code: 'completed'}).parent()

                // results loop
                for (var j = 0; j < data[0]["results"].length; j++) {
                    var effectiveTime = data[0]["results"][j]["date"][0]["date"].split("-");
                    effectiveTime[2] = effectiveTime[2].slice(0,2);
                    var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
                    organizer.node('component')
                        .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.2"}).parent()
                            .node('id').attr({root: data[0]["results"][j]['identifiers'][0]['identifier']}).parent()
                            .node('code').attr({code: data[0]["results"][j]["result"]["code"] })
                                .attr({displayName: data[0]["results"][j]["result"]['name']})
                                .attr({codeSystem: codeSystems[data[0]["results"][j]["result"]["code_system_name"]][0]})
                                .attr({codeSystemName: data[0]["results"][j]["result"]["code_system_name"]}).parent()
                            .node('text')
                                .node('reference').attr({value: "#result" + (j+1)}).parent()
                            .parent()
                            .node('statusCode').attr({code: 'completed'}).parent()
                            .node('effectiveTime').attr({value: time}).parent()
                            .node('value').attr({"xsi:type": "PQ"}).attr({value: data[0]["results"][j]["value"]}).attr({unit: data[0]["results"][j]["unit"]}).parent()
                            .node('interpretationCode').attr({code: data[0]["results"][j]["interpretations"][0].substr(0,1)}).attr({codeSystem: "2.16.840.1.113883.5.83"}).parent()
                            .node('referenceRange')
                                .node('observationRange')
                                    .node('text', "UNIMPLEMENTED" /*previously: data[0]["results"][j]["freeTextValue"]*/).parent()
                                .parent()
                            .parent()
                        .parent()
                    .parent()
                }
            xmlDoc.parent()
        .parent()
    xmlDoc.parent() // end section
.parent(); // end clinicalDocument

return doc;
}

module.exports = function() {
    return writeXML(arguments["0"], arguments["1"], arguments["2"]);
}

