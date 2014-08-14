var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.17", 
        undefined, sec_entries_codes["SocialHistorySection"], "SOCIAL HISTORY", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var time = libCCDAGen.getTimes(data[i]["date_time"]);
        var smoking = data[i]["value"] ? data[i]["value"].indexOf("smoke") > -1 : undefined;

        var xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"})
            .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                .node('templateId').attr(smoking ? {root: "2.16.840.1.113883.10.20.22.4.78"} : 
                    {root: "2.16.840.1.113883.10.20.22.4.38"}).parent();
                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
                xmlDoc = libCCDAGen.code(xmlDoc, undefined, smoking ? 
                    sec_entries_codes["SmokingStatusObservation"] : 
                    libCCDAGen.reverseTable("2.16.840.1.113883.11.20.9.38", data[i]["value"]));
                if (!smoking) {
                    xmlDoc = xmlDoc.node('originalText')
                        .node('reference').attr({value: "#soc" + i}).parent()
                    .parent();
                }
                xmlDoc = xmlDoc.parent()
                xmlDoc = xmlDoc.node('statusCode').attr({code: 'completed'}).parent();
                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);
                if (smoking) {
                    xmlDoc = libCCDAGen.value(xmlDoc, libCCDAGen.reverseTable("2.16.840.1.113883.11.20.9.38", data[i]["value"]), "CD");
                } else {
                    xmlDoc = libCCDAGen.value(xmlDoc, undefined, "ST", undefined, data[i]["observation_value"]);
                }
            xmlDoc = xmlDoc.parent()
        .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}
