var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

function writeXML(sectionNumber, data, codeSystems) {
    var xml = {};
    if (sectionNumber == 6) {
        xml = loadProcedures(sectionNumber, data, codeSystems);
    }
    return xml;
}

function loadProcedures(sectionNumber, data, codeSystems) {
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
    var xmlDoc = libCCDAGen.header(doc, "2.16.840.1.113883.10.20.22.2.7", "2.16.840.1.113883.10.20.22.2.7.1", "47519-4", 
        "2.16.840.1.113883.6.1", "LOINC", "HISTORY OF PROCEDURES", "PROCEDURES");
    
            // entries loop
                var i = 0;
                var timeArr = libCCDAGen.getTimes(data[i]["date"].length, data[i]["date"]);
                var organizer = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                                      .node('procedure').attr({classCode: "PROC"}).attr({moodCode: "EVN"});
                    organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.14"}).parent() // smoking status observation
                        .node('id').attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                        .node('code')
                            .attr({code: data[i]["code"] })
                            .attr({codeSystem: "2.16.840.1.113883.6.96" })
                            .attr({codeSystemName: "SNOMED CT"})
                            .attr({displayName: data[i]["name"]}).parent()
                            .node('originalText')
                                .node('reference').attr({value: "#Proc" + (i+1)}).parent()
                            .parent()
                        .node('statusCode').attr({code: 'completed'}).parent()
                        .node('effectiveTime').attr({value: timeArr[0]}).parent()
                        .node('methodCode').attr({nullFlavor: "UNK"}).parent()
                        .node('targetSiteCode').attr({code: data[i]["bodysite"][0]["code"]})
                                               .attr({displayName: data[i]["bodysite"][0]["name"]})
                                               .attr({codeSystem: "2.16.840.1.113883.3.88.12.3221.8.9"})
                                               .attr({codeSystemName: "Body Site Value Set"}).parent()
                        .node('specimen').attr({typeCode: "SPC"})
                            .node('specimenRole').attr({classCode: "SPEC"})
                                .node('id').attr({root: "c2ee9ee9-ae31-4628-a919-fec1cbb58683"}).parent()
                                .node('specimenPlayingEntity')
                                    .node('code').attr({code: "309226005"})
                                                 .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                                 .attr({displayName: data[i]["bodysite"][0]["name"]}).parent()
                                .parent()
                            .parent()
                        .parent()
                        .node('performer')
                            .node('assignedEntity')
                                .node('id').attr({root: "2.16.840.1.113883.19.5.9999.456"})
                                           .attr({extension: "2981823"}).parent()
                                .node('addr')
                                    .node('streetAddressLine', data[i]["providers"][0]["address"]["streetLines"][0]).parent()
                                    .node('city', data[i]["providers"][0]["address"]["city"]).parent()
                                    .node('state', data[i]["providers"][0]["address"]["state"]).parent()
                                    .node('postalCode', data[i]["providers"][0]["address"]["zip"]).parent()
                                    .node('country', data[i]["providers"][0]["address"]["country"]).parent()
                                .parent()
                                .node('telecom').attr({use: "WP"}).attr({value: data[i]["providers"][0]["telecom"]["value"]}).parent()
                                .node('representedOrganization')
                                    .node('id').attr({root: "2.16.840.1.113883.19.5.9999.1393"}).parent()
                                    .node('name', "Community Health and Hospitals").parent()
                                    .node('telecom').attr({use: "WP"})
                                                    .attr({value: data[i]["providers"][0]["organization"]["telecom"]["value"]}).parent()
                                    .node('addr')
                                        .node('streetAddressLine', data[i]["providers"][0]["organization"]["address"]["streetLines"][0]).parent()
                                        .node('city', data[i]["providers"][0]["organization"]["address"]["city"]).parent()
                                        .node('state', data[i]["providers"][0]["organization"]["address"]["state"]).parent()
                                        .node('postalCode', data[i]["providers"][0]["organization"]["address"]["zip"]).parent()
                                        .node('country', data[i]["providers"][0]["organization"]["address"]["country"]).parent()
                                    .parent()
                                .parent()
                            .parent()
                        .parent()
                        .node('participant').attr({typeCode: "DEV"})
                            .node('participantRole').attr({classCode: "MANU"})
                                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.37"}).parent()
                                .node('id').attr({root: "742aee30-21c5-11e1-bfc2-0800200c9a66"}).parent()
                                .node('playingDevice')
                                    .node('code').attr({code: "90412006"})
                                                 .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                                 .attr({displayName: "Colonoscope"}).parent()
                                    .parent()
                                .node('scopingEntity')
                                    .node('id').attr({root: "eb936010-7b17-11db-9fe1-0800200c9b65"}).parent()
                                .parent()
                            .parent()
                        .parent()
                    .parent()
                .parent();
                i = 1;
                timeArr = libCCDAGen.getTimes(data[i]["date"].length, data[i]["date"]);
                xmlDoc = xmlDoc.node('entry')
                    .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.13"}).parent() // procedure activity observation
                        .node('id').attr({extension: data[i]["identifiers"][0]["identifier_type"]})
                                   .attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                        .node('code').attr({code: data[i]["code"]})
                                     .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                     .attr({displayName: data[i]["name"]})
                                     .attr({codeSystemName: data[i]["code_system_name"]})
                            .node('originalText')
                                .node('reference').attr({value: "#Proc" + (i)}).parent()
                            .parent()
                        .parent()
                        .node('statusCode').attr({code: data[i]["status"]}).parent()
                        .node('effectiveTime').attr({value: timeArr[0]}).parent()
                        .node('priorityCode').attr({code: "CR"})
                                             .attr({codeSystem: "2.16.840.1.113883.5.7"})
                                             .attr({codeSystemName: "ActPriority"})
                                             .attr({displayName: "Callback results"}).parent()
                        .node('value').attr({"xsi:type": "CD"}).parent()
                        .node('methodCode').attr({nullFlavor: "UNK"}).parent()
                        .node('targetSiteCode').attr({code: data[i]["bodysite"][0]["code"]})
                                               .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                               .attr({codeSystemName: "SNOMED CT"})
                                               .attr({displayName: data[i]["bodysite"][0]["name"]}).parent()
                        .node('performer')
                            .node('assignedEntity')
                                .node('id').attr({root: "2.16.840.1.113883.19.5"}).attr({extension: "1234"}).parent();
                                xmlDoc = libCCDAGen.addr(xmlDoc, data[i]["providers"][0]["address"]);
                                xmlDoc.node('telecom').attr({use: "WP"}).attr({value: data[i]["providers"][0]["telecom"]["value"]}).parent()
                                xmlDoc = libCCDAGen.representedOrganization(xmlDoc, data[i]["providers"][0]["organization"]);
                            xmlDoc = xmlDoc.parent()
                        .parent()
                        xmlDoc = xmlDoc.node('participant').attr({typeCode: "LOC"})
                            .node('participantRole').attr({classCode: "SDLOC"})
                                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.32"}).parent()
                                .node('code').attr({code: data[i]["locations"][0]["loc_type"]["code"]})
                                             .attr({codeSystem: "2.16.840.1.113883.6.259"})
                                             .attr({codeSystemName: data[i]["locations"][0]["loc_type"]["code_system_name"]})
                                             .attr({displayName: data[i]["locations"][0]["loc_type"]["name"]}).parent();
                                xmlDoc = libCCDAGen.addr(xmlDoc, data[i]["locations"][0]["addresses"][0]);
                                xmlDoc = xmlDoc.node('telecom').attr({nullFlavor: "UNK"}).parent()
                                .node('playingEntity').attr({classCode: "PLC"})
                                    .node('name', data[i]["locations"][0]["name"])
                                .parent()
                            .parent()
                        .parent()
                    .parent()
                .parent()
            .parent()

                i = 2;
                timeArr = libCCDAGen.getTimes(data[i]["date"].length, data[i]["date"]);
                xmlDoc = xmlDoc.node('entry')
                    .node('act').attr({classCode: "ACT"}).attr({moodCode: "INT"})
                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.12"}).parent()
                        .node('id').attr({root: data[i]["identifiers"][0]["identifier_type"]})
                                   .attr({extension: data[i]["identifiers"][0]["identifier"]}).parent()
                        .node('code').attr({code: data[i]["code"]})
                                     .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                     .attr({codeSystemName: "SNOMED CT"})
                                     .attr({displayName: data[i]["name"]})
                            .node('originalText') 
                                .node('reference').attr({value: "#Proc" + (i+1)}).parent()
                            .parent()
                        .parent()
                        .node('statusCode').attr({code: "completed"}).parent()
                        .node('effectiveTime').attr({value: timeArr[0]}).parent()
                        .node('priorityCode').attr({code: "CR"})
                                             .attr({codeSystem: "2.16.840.1.113883.5.7"})
                                             .attr({codeSystemName: "ActPriority"})
                                             .attr({displayName: "Callback results"}).parent();
                        xmlDoc = libCCDAGen.performer(xmlDoc, "2.16.840.1.113883.19", "1234", data[i]["providers"][0]["address"], 
                            data[i]["providers"][0]["telecom"], data[i]["providers"][0]["organization"]);
                        xmlDoc = xmlDoc.node('participant').attr({typeCode: "LOC"})
                            .node('participantRole').attr({classCode: "SDLOC"})
                                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.32"}).parent()
                                .node('code').attr({code: data[i]["locations"][0]["loc_type"]["code"]})
                                             .attr({codeSystem: "2.16.840.1.113883.6.259"})
                                             .attr({codeSystemName: data[i]["locations"][0]["loc_type"]["code_system_name"]})
                                             .attr({displayName: data[i]["locations"][0]["loc_type"]["name"]}).parent();
                                xmlDoc = libCCDAGen.addr(xmlDoc, data[i]["locations"][0]["addresses"][0]);
                                xmlDoc = xmlDoc.node('telecom').attr({nullFlavor: "UNK"}).parent()
                                xmlDoc.node('playingEntity').attr({classCode: "PLC"})
                                    .node('name', data[i]["locations"][0]["name"]).parent()
                                .parent()
                            .parent()
                        .parent()
                    .parent()
                .parent()
        xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return doc;
}

module.exports = function() {
    return writeXML(arguments["0"], arguments["1"], arguments["2"]);
}

