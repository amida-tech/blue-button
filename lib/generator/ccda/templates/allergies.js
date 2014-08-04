var libxmljs = require("libxmljs");
var libCCDAgen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var entries = libCCDAgen.getNumEntries(data);

    // create a new xml document and generate the header
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAgen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1",
        "48765-2", "2.16.840.1.113883.6.1", undefined, undefined, "ALLERGIES, ADVERSE REACTIONS, ALERTS", isCCD);

    // Now loop over each entry in the data set
    for (var i = 0; i < entries[0].length; i++) {
        var time = libCCDAgen.getTimes(data[i]["date"]);

        var xmlDoc = xmlDoc.node('entry')
            .attr({typeCode: "DRIV"})
            .node('act')
                .attr({classCode: "ACT"})
                .attr({moodCode: "EVN"})
                xmlDoc = xmlDoc.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.30"}).parent() // allergy problem act
                .node('id').attr({root: "36e3e930-7b14-11db-9fe1-0800200c9a66"}).parent();
                xmlDoc = libCCDAgen.code(xmlDoc, undefined, bbm.CCDA.sections_entries_codes["codes"]["AllergiesSection"]).parent();
                xmlDoc = xmlDoc.node('statusCode').attr({code: 'active'}).parent()
                .node('effectiveTime').attr({value: time[0]}).parent()

                xmlDoc = xmlDoc.node('entryRelationship')
                    .attr({typeCode: "SUBJ"})
                    .attr({inversionInd: "true"})
                    .node('observation')
                        .attr({classCode: "OBS"})
                        .attr({moodCode: "EVN"})
                        .node('templateId')
                            .attr({root: "2.16.840.1.113883.10.20.22.4.7"}).parent() // allergy xmlDoc
                        .node('id').attr({root: data[0]["identifiers"][0]["identifier"]}).parent()
                        .node('code')
                            .attr({code: "ASSERTION"})
                            .attr({codeSystem: "2.16.840.1.113883.5.4"}).parent()
                        .node('statusCode').attr({code: 'completed'}).parent();
                        xmlDoc = libCCDAgen.effectiveTime(xmlDoc, time);
                        xmlDoc = xmlDoc.node('value')
                            .attr({"xsi:type": "CD"})
                            .attr({code: "419511003"})
                            .attr({displayName: "Propensity to adverse reactions to drug"})
                            .attr({codeSystem: "2.16.840.1.113883.6.96"})
                            .attr({codeSystemName: "SNOMED CT"})
                        .node('originalText')
                            .node('reference').attr({value: "#reaction" + (i + 1)}).parent()
                    .parent()
                .parent();
                if (data[i]["allergen"]) {
                    xmlDoc = xmlDoc.node('participant')
                        .attr({typeCode: "CSM"})
                        .node('participantRole')
                            .attr({classCode: "MANU"})
                            .node('playingEntity')
                                .attr({classCode: "MMAT"})
                                .node('code')
                                    .attr({code: data[i]["allergen"]["code"]})
                                    .attr({displayName: data[i]["allergen"]["name"]})
                                    .attr({codeSystem: codeSystems[data[i]["allergen"]["code_system_name"]]})
                                    .attr({codeSystemName: data[i]["allergen"]["code_system_name"]})
                                    .node('originalText')
                                        .node('reference').attr({value: "#reaction" + (i + 1)}).parent()
                                    .parent()
                                .parent()
                            .parent()
                        .parent()
                    .parent()
                } else {
                    xmlDoc = xmlDoc.node('participant').attr({nullFlavor: "UNK"});
                }

                // entryRelationship's loop
                for (var j = 0; j < entries[1][entries[0][i]]; j++) {
                    xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
                        .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Allergy status xmlDoc
                            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.28"}).parent()
                            .node('code')
                                .attr({code: "33999-4"})
                                .attr({codeSystem: "2.16.840.1.113883.6.1"})
                                .attr({codeSystemName: "LOINC"})
                                .attr({displayName: "Status"}).parent()
                            .node('statusCode')
                                .attr({code: 'completed'}).parent()
                            .node('value')
                                .attr({"xsi:type": "CE"})
                                .attr({code: "73425007"})
                                .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                .attr({displayName: "Inactive"}).parent()
                        .parent()
                    .parent();
                    xmlDoc = xmlDoc.node('entryRelationship')
                        .attr({typeCode: "MFST"})
                        .attr({inversionInd: "true"})
                        .node('observation')
                            .attr({classCode: "OBS"})
                            .attr({moodCode: "EVN"}) // Allergy status xmlDoc
                            .node('templateId')
                                .attr({root: "2.16.840.1.113883.10.20.22.4.9"}).parent()
                            .node('id')
                                .attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                            .node('code')
                                .attr({nullFlavor: "NA"}).parent()
                            .node('text')
                                .node('reference')
                                    .attr({value: "#reaction" + (i + 1)}).parent()
                            .parent()
                            .node('statusCode')
                                .attr({code: 'completed'}).parent();
                            xmlDoc = libCCDAgen.effectiveTime(xmlDoc, time);
                            xmlDoc = xmlDoc.node('value')
                                .attr({"xsi:type": "CD"})
                                .attr({code: data[i]["reaction"] == undefined ? "UNK" : data[i]["reaction"][0]["reaction"]["code"]})
                                .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                .attr({displayName: data[i]["reaction"] == undefined ? "UNK" : data[i]["reaction"][0]["reaction"]["name"]}).parent();
        
                            xmlDoc = libCCDAgen.entryRelationship(xmlDoc, data, 'observation', i, j, "255604002", 1.1);
                        xmlDoc = xmlDoc.parent()
                    .parent();
                    xmlDoc = libCCDAgen.entryRelationship(xmlDoc, data, 'observation', i, j, data[i]["reaction"] ? data[i]["reaction"][0]["reaction"] ? data[i]["reaction"][0]["reaction"]["code"] : "UNK" : "UNK", 1.2);
                }
                xmlDoc = xmlDoc.parent()
            .parent()
        .parent()
    .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument (or component)
    return isCCD ? xmlDoc : doc;
}
