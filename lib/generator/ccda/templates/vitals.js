var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    // determining the number of entries
    var entries = libCCDAGen.getNumEntries(data);

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.4", "2.16.840.1.113883.10.20.22.2.4.1", "8716-3",
        "2.16.840.1.113883.6.1", "LOINC", "VITAL SIGNS", "VITAL SIGNS", isCCD);
    var sum = 0;
    var count = 0;
    for (entry in entries[1]) {
        sum += entries[1][entry];
    }
    
    // entries loop
    var curr_sum = 0;
    for (var i = 0; i < entries[0].length; i++) {
        var time = libCCDAGen.getTimes(data[curr_sum]["date_time"]);
        curr_sum += entries[1][entries[0][i]];

        var xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"})
            .node('organizer').attr({classCode: "CLUSTER"}).attr({moodCode: "EVN"})
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.26"}).parent();
                xmlDoc = libCCDAGen.id(xmlDoc, data[0]["identifiers"]);
                xmlDoc = libCCDAGen.code(xmlDoc, undefined, sec_entries_codes["VitalSignsOrganizer"]).parent();
                xmlDoc = xmlDoc.node('statusCode')
                    .attr({code: data[0]['status']}).parent();
                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);

                // components loop
                for (var j = 0; j < entries[1][entries[0][i]]; j++) {
                    var idx = ((j + (i + 1)) + j * (entries[0].length - 1));
                    count++;
                    xmlDoc = xmlDoc.node('component')
                        .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.27"}).parent();
                            xmlDoc = libCCDAGen.id(xmlDoc, data[j]["identifiers"]);
                            xmlDoc = libCCDAGen.code(xmlDoc, data[j]["vital"]).parent();
                            xmlDoc = xmlDoc.node('text')
                                .node('reference').attr({value: "#vit" + idx }).parent()
                            .parent()
                            .node('statusCode').attr({code: data[j]['status']}).parent();
                            xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);
                            xmlDoc = xmlDoc.node('value')
                                .attr({"xsi:type": "PQ"})
                                .attr({value: data[j + (i == 0 ? 0 : entries[1][entries[0][i-1]])]["value"]})
                                .attr({unit: data[j]["unit"]}).parent()
                            .node('interpretationCode')
                                .attr({code: "N"})
                                .attr({codeSystem: "2.16.840.1.113883.5.83"}).parent()
                        .parent()
                    .parent()
                }
            xmlDoc = xmlDoc.parent()
        .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}
