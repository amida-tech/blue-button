var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var XDate = require("xdate");

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.22", "2.16.840.1.113883.10.20.22.2.22.1",
        "46240-8", "2.16.840.1.113883.6.1", "LOINC", "History of encounters", "ENCOUNTERS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var time = libCCDAGen.getTimes(data[i]["date_time"]);
        // start the templating
        var xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"})
            .node('encounter')
                .attr({classCode: "ENC"})
                .attr({moodCode: "EVN"}); // encounter activities
                xmlDoc = xmlDoc.node('templateId')
                    .attr({root: "2.16.840.1.113883.10.20.22.4.49"}).parent();
                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
                if (data[i]["encounter"]) {
                    xmlDoc = libCCDAGen.code(xmlDoc, data[i]["encounter"], {"code_system": "2.16.840.1.113883.6.12"});
                        xmlDoc = xmlDoc.node('originalText', "Checkup Examination")
                            .node('reference').attr({value: "#Encounter" + (i + 1)}).parent()
                        .parent()
                }
                    xmlDoc = libCCDAGen.code(xmlDoc, data[i]["encounter"] ? 
                            data[i]["encounter"]["translations"][0] : data[i]["encounter"], {}, 'translation').parent();
                    xmlDoc = xmlDoc.parent();
                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time); 
                xmlDoc = xmlDoc.node('performer')
                    .node('assignedEntity')
                        .node('id').attr({root: "PseduoMD-3"}).parent();
                        xmlDoc = libCCDAGen.code(xmlDoc, data[i]["performers"] ? data[i]["performers"][0]["code"][0] : undefined).parent();
                    xmlDoc = xmlDoc.parent()
                .parent();
                xmlDoc = libCCDAGen.participant(xmlDoc, data[i]["locations"], {
                    "code": 1,
                    "addr": 1,
                    "tel": 1,
                    "playingEntity": {
                        "name": 1
                    }
                }, {});
                xmlDoc = libCCDAGen.indicationConstraint(xmlDoc, data[i]["findings"], libCCDAGen.getTimes(data[i]["findings"] ? data[i]["findings"][0]["date_time"] : undefined));
            xmlDoc = xmlDoc.parent()
        .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}
