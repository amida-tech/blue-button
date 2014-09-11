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
        var type = data[i].type;
        var typeInfo = type && info[type];
        if (typeInfo) {
            var e = xmlDoc.node('entry');
            if (type == "observation") {
                e.attr({typeCode: "DRIV"})
            }
                
            var t = e.node(type).attr({classCode: typeInfo[1], moodCode: typeInfo[2]});
            t.node('templateId').attr({root: typeInfo[0]});
            libCCDAGen.id(t, data[i].identifiers);
            libCCDAGen.code(t, data[i].plan);
            xmlDoc.node('statusCode').attr({code: 'new'});
            var time = libCCDAGen.getTimes(data[i].date_time);
            libCCDAGen.effectiveTime(t, time);
        }
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end component
    return isCCD ? xmlDoc : doc;
}
