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

        var dEncounter = data[i].encounter;
        if (dEncounter) {
            xmlDoc = libCCDAGen.code(xmlDoc, dEncounter);
            xmlDoc = xmlDoc.node('originalText', "Checkup Examination")
                .node('reference').attr({value: "#Encounter" + (i + 1)}).parent()
                        .parent()
        }                
        xmlDoc = xmlDoc.parent();
        xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time); 
        var dPerformers = data[i].performers;
        if (dPerformers) {
            var nPerformer = dPerformers.length;
            for (var j=0; j<nPerformer; ++j) {
                xmlDoc = xmlDoc.node('performer').node('assignedEntity');
                xmlDoc = libCCDAGen.id(xmlDoc, dPerformers[j].identifiers);
                xmlDoc = libCCDAGen.addr(xmlDoc, dPerformers[j].address);
                xmlDoc = libCCDAGen.tel(xmlDoc, dPerformers[j].phone);
                xmlDoc = libCCDAGen.assignedPerson(xmlDoc, dPerformers[j].name);
                xmlDoc = libCCDAGen.representedOrganization(xmlDoc, dPerformers[j].organization);
                var dPerformersCode = dPerformers[j].code ? dPerformers[j].code[0] : undefined;
                xmlDoc = libCCDAGen.code(xmlDoc, dPerformersCode).parent();
                xmlDoc = xmlDoc.parent().parent();
            }
        }

        xmlDoc = libCCDAGen.participant(xmlDoc, data[i]["locations"], 
            {"code": 1, "addr": 1, "tel": 1, "playingEntity": {"name": 1}
                }, {});
        xmlDoc = libCCDAGen.indicationConstraint(xmlDoc, data[i]["findings"], libCCDAGen.getTimes(data[i]["findings"] ? data[i]["findings"][0]["date_time"] : undefined));
        xmlDoc = xmlDoc.parent().parent();
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}
