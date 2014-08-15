var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.2", 
        "2.16.840.1.113883.10.20.22.2.2.1", sec_entries_codes["ImmunizationsSection"],"IMMUNIZATIONS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var time = libCCDAGen.getTimes(data[i]["date_time"]);

        xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"});
            xmlDoc = xmlDoc.node('substanceAdministration').attr({classCode: "SBADM"});
                    if (data[i]["status"] === "refused") {
                        xmlDoc = xmlDoc.attr({moodCode: "EVN"}).attr({negationInd: "true"})
                    } else if (data[i]["status"] === "pending") {
                        xmlDoc = xmlDoc.attr({moodCode: "INT"}).attr({negationInd: "false"})
                    } else if (data[i]["status"] === "complete") {
                        xmlDoc = xmlDoc.attr({moodCode: "EVN"}).attr({negationInd: "false"})
                    }
                xmlDoc = xmlDoc.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.52"}).parent();
                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
                xmlDoc = xmlDoc.node('text')
                    .node('reference').attr({value: "#immun" + (i+1)}).parent()
                .parent()
                .node('statusCode').attr({code: data[i]['status']}).parent();
                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time, undefined,'IVL_TS');
                xmlDoc = libCCDAGen.routeCode(xmlDoc, data[i]["administration"]);
                xmlDoc = libCCDAGen.doseQuantity(xmlDoc, data[i]["administration"]);
                xmlDoc = libCCDAGen.consumable(xmlDoc, data[i]["product"], "#immi" + (i + 1));
                xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i]["performer"], {});
    
            xmlDoc = libCCDAGen.entryRelationship(xmlDoc, data[i]["refusal"] ? data[i]["refusal"] : data[i]["instructions"], 
                data[i]["refusal"] ? 'observation' : 'act', data[i]["refusal"] ? 'RSON' : 'SUBJ', data[i]["refusal"] ? undefined : '#immunSect');
            xmlDoc = xmlDoc.parent() // end substanceAdministration
        .parent() // end entry
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument

    return isCCD ? xmlDoc : doc;
}
