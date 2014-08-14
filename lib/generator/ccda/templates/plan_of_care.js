var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

module.exports = function (data, codeSystems, isCCD, CCDxml) {

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.10", undefined, 
        sec_entries_codes["PlanOfCareSection"], "PLAN OF CARE", isCCD);

    var info = {
        "act": ["2.16.840.1.113883.10.20.22.4.39", "ACT", "RQO"],
        "observation": ["2.16.840.1.113883.10.20.22.4.44", "OBS", "RQO"],
        "procedure": ["2.16.840.1.113883.10.20.22.4.41", "PROC", "RQO"],
        "encounter": ["2.16.840.1.113883.10.20.22.4.40", "ENC", "INT"],
        "substance administration": ["2.16.840.1.113883.10.20.22.4.42", "SBADM", "RQO"],
        "supply": ["2.16.840.1.113883.10.20.22.4.43", "SPLY", "INT"],
        "instructions": ["2.16.840.1.113883.10.20.22.4.20", "ACT", "INT"]
    }

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var time = libCCDAGen.getTimes(data[i]["date_time"]);
        xmlDoc = xmlDoc.node('entry');
        if (data[i]["type"] == "observation") {
            xmlDoc = xmlDoc.attr({typeCode: "DRIV"})
        }
            
            xmlDoc = xmlDoc.node(data[i]["type"])
                .attr({classCode: info[data[i]["type"]][1] })
                .attr({moodCode: info[data[i]["type"]][2]})
                .node('templateId').attr({root: info[data[i]["type"]][0]}).parent();
                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
                xmlDoc = libCCDAGen.code(xmlDoc, data[i]["plan"]).parent();
                xmlDoc = xmlDoc.node('statusCode').attr({code: 'new'}).parent();
                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);
            xmlDoc = xmlDoc.parent()
        .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end component
    return isCCD ? xmlDoc : doc;
}
