var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.7", "2.16.840.1.113883.10.20.22.2.7.1", 
        sec_entries_codes["ProceduresSection"], "PROCEDURES", isCCD);

    var templateIds = {
        "act": "2.16.840.1.113883.10.20.22.4.12",
        "observation": "2.16.840.1.113883.10.20.22.4.13",
        "procedure": "2.16.840.1.113883.10.20.22.4.14"
    }

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var time = libCCDAGen.getTimes(data[i]["date_time"]);
        xmlDoc = xmlDoc.node('entry')
            .attr({typeCode: "DRIV"})
            .node(data[i]["procedure_type"])
                .attr({classCode: data[i]["procedure_type"] == "procedure" ?
                    data[i]["procedure_type"].slice(0, 4).toUpperCase() : 
                    data[i]["procedure_type"].slice(0, 3).toUpperCase()})
                .attr({moodCode: "EVN"})
            .node('templateId').attr({root: templateIds[data[i]["procedure_type"]]}).parent(); // smoking status observation
            xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
            xmlDoc = libCCDAGen.code(xmlDoc, data[i]["procedure"]);
            xmlDoc = xmlDoc.node('originalText')
                .node('reference').attr({value: "#Proc1"}).parent()
            .parent()
            .parent()
            .node('statusCode').attr({code: data[i]["status"]}).parent();
            xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);
            xmlDoc = libCCDAGen.code(xmlDoc, data[i]["priority"], {}, 'priorityCode').parent();
            if (data[i]["procedure_type"] === "observation") {
                xmlDoc = xmlDoc.node("value").attr({"xsi:type": "CD"}).parent();
            }
            if (data[i]["procedure_type"] !== "act") {
                xmlDoc = xmlDoc.node('methodCode').attr({nullFlavor: "UNK"}).parent();
            }
        if (data[i]["body_sites"]) {
            xmlDoc = libCCDAGen.code(xmlDoc, data[i]["body_sites"][0], 
                {"code_system": "2.16.840.1.113883.3.88.12.3221.8.9", 
                "code_system_name": "Body Site Value Set"}, 'targetSiteCode').parent();
        }
        if (data[i]["procedure_type"] == "procedure") {
            xmlDoc = xmlDoc.node('specimen').attr({typeCode: "SPC"})
                .node('specimenRole').attr({classCode: "SPEC"});
                    xmlDoc = libCCDAGen.id(xmlDoc, data[i]["specimen"] ? data[i]["specimen"]["identifiers"] : undefined);
                    xmlDoc = xmlDoc.node('specimenPlayingEntity');
                        xmlDoc = libCCDAGen.code(xmlDoc, data[i]["specimen"] ? data[i]["specimen"]["code"] : undefined).parent();
                    xmlDoc = xmlDoc.parent()
                .parent()
            .parent();
        }

        xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i]["performer"][0]);

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
            xmlDoc = libCCDAGen.participant(xmlDoc, data[i]["locations"]);
        }
        xmlDoc = xmlDoc.parent()
            .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end component
    return isCCD ? xmlDoc : doc;
}
