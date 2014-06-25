var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function(data, codeSystems, isCCD, CCDxml) {
     // determining the number of entries
    var entries = libCCDAGen.getNumEntries(data);

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.22", "2.16.840.1.113883.10.20.22.2.22.1", 
            "46240-8", "2.16.840.1.113883.6.1", "LOINC", "History of encounters", "ENCOUNTERS", isCCD);

            // entries loop
            for (var i = 0; i < entries[0].length; i++) {
                // time processing
                var effectiveTime = data[i]["date"][0]["date"].split("-");
                var store = effectiveTime[2].replace(":", "").replace(":", "").replace("T", "");
                var idx = store.indexOf(".");
                store = store.substr(0, idx);
                store += "+0500";
                effectiveTime[2] = store;
                var store1 = effectiveTime[2].slice(0,2);
                var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
                var time2 = effectiveTime[0] + effectiveTime[1] + store1;

                // start the templating
                var xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                                      .node('encounter').attr({classCode: "ENC"}).attr({moodCode: "EVN"}); // encounter activities
                    xmlDoc = xmlDoc.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.49"}).parent()
                        .node('id').attr(data[i]["identifiers"] !== undefined ? {root: data[i]["identifiers"][0]["identifier"]} : {nullFlavor: "UNK"} ).parent();
                        if (data[i]["encounter"] != undefined) {
                            xmlDoc = xmlDoc.node('code')
                                    .attr({code: data[i]["encounter"]["code"] })
                                    .attr({displayName: data[i]["encounter"]["name"]})
                                    .attr({codeSystemName: data[i]["encounter"]["code_system_name"]})
                                    .attr({codeSystem: "2.16.840.1.113883.6.12" })
                                    .attr({codeSystemVersion: "4"})
                                    .node('originalText', "Checkup Examination")
                                        .node('reference').attr({value: "#Encounter" + (i+1)}).parent()
                                    .parent() 
                        }
                            console.log(data[0]["locations"]);

                            xmlDoc = libCCDAGen.translation(xmlDoc, data[i]["encounter"] != undefined ? data[i]["encounter"]["translations"] : data[i]["encounter"]);
                        xmlDoc = xmlDoc.parent()
                        .node('effectiveTime').attr({value: time}).parent()
                        .node('performer')
                            .node('assignedEntity')
                                .node('id').attr({root: "PseduoMD-3"}).parent()
                                .node('code').attr({code: "59058001"})
                                             .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                             .attr({codeSystemName: "SNOMED CT"})
                                             .attr({displayName: "General Physician"}).parent()
                            .parent()
                        .parent();
                        xmlDoc = libCCDAGen.participant(xmlDoc, data[i]["locations"]);
                        xmlDoc = libCCDAGen.indicationConstraint(xmlDoc, data[i]["findings"], time);
                    xmlDoc = xmlDoc.parent()
                .parent()
            }
        xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}