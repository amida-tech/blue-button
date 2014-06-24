var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function(data, codeSystems, isCCD, CCDxml) {
    // determining the number of entries
    console.log(data);
    console.log("LENGTH" + data.length);
    // var entries = libCCDAGen.getNumEntries(data);

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.7", "2.16.840.1.113883.10.20.22.2.7.1", "47519-4", 
            "2.16.840.1.113883.6.1", "LOINC", "HISTORY OF PROCEDURES", "PROCEDURES", isCCD);    

    var templateIds = {
        "act": "2.16.840.1.113883.10.20.22.4.12",
        "observation": "2.16.840.1.113883.10.20.22.4.13",
        "procedure": "2.16.840.1.113883.10.20.22.4.14"
    }

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var timeArr = libCCDAGen.getTimes(data[i]["date"]);
        xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"})
            .node(data[i]["procedure_type"])
                    .attr({classCode: data[i]["procedure_type"] == "procedure" ? 
                        data[i]["procedure_type"].slice(0,4).toUpperCase() : 
                        data[i]["procedure_type"].slice(0,3).toUpperCase()})
                    .attr({moodCode: "EVN"})
                .node('templateId').attr({root: templateIds[data[i]["procedure_type"]]}).parent() // smoking status observation
                .node('id').attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                .node('code')
                    .attr({code: data[i]["procedure"]["code"] })
                    .attr({codeSystem: "2.16.840.1.113883.6.96" })
                    .attr({codeSystemName: "SNOMED CT"})
                    .attr({displayName: data[i]["procedure"]["name"]})
                    .node('originalText')
                        .node('reference').attr({value: "#Proc1"}).parent()
                    .parent()
                .parent()
                .node('statusCode').attr({code: 'completed'}).parent()
                .node('effectiveTime').attr({value: timeArr == undefined ? "UNK" : timeArr[0]}).parent()
                .node('methodCode').attr({nullFlavor: "UNK"}).parent();
                if (data[i]["body_sites"]) {
                    xmlDoc = xmlDoc.node('targetSiteCode').attr({code: data[i]["body_sites"][0]["code"]})
                                       .attr({displayName: data[i]["body_sites"][0]["name"]})
                                       .attr({codeSystem: "2.16.840.1.113883.3.88.12.3221.8.9"})
                                       .attr({codeSystemName: "Body Site Value Set"}).parent()
                }
                if (data[i]["procedure_type"] == "procedure") {
                    xmlDoc = xmlDoc.node('specimen').attr({typeCode: "SPC"})
                        .node('specimenRole').attr({classCode: "SPEC"})
                            .node('id').attr({root: "c2ee9ee9-ae31-4628-a919-fec1cbb58683"}).parent()
                            .node('specimenPlayingEntity')
                                .node('code').attr({code: "309226005"})
                                             .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                             .attr({displayName: data[i]["procedure"]["name"]}).parent()
                            .parent()
                        .parent()
                    .parent();    
                }
                
                xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i]["providers"], "2.16.840.1.113883.19.5", "1234");
                
                if (data[i]["procedure_type"] == "procedure") {
                    xmlDoc = xmlDoc.node('participant').attr({typeCode: "DEV"})
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
                } else { // procedure is either of type observation or act
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
                }
            xmlDoc = xmlDoc.parent()
        .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end component
    return isCCD ? xmlDoc : doc;
}