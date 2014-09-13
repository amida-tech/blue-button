"use strict";

var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.22", "2.16.840.1.113883.10.20.22.2.22.1",
        "46240-8", "2.16.840.1.113883.6.1", "LOINC", "History of encounters", "ENCOUNTERS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        // start the templating
        var e = xmlDoc.node('entry').attr({typeCode: "DRIV"});
        var enc = e.node('encounter').attr({classCode: "ENC", moodCode: "EVN"}); // encounter activities

        enc.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.49"});        
        libCCDAGen.id(enc, data[i].identifiers);

        var dEncounter = data[i].encounter;
        if (dEncounter) {
            libCCDAGen.code(enc, dEncounter);
            var ot = enc.node('originalText', "Checkup Examination")
            ot.node('reference').attr({value: "#Encounter" + (i + 1)});
        }                

        if (data[i].date_time) {
           var time = libCCDAGen.getTimes(data[i].date_time);
            libCCDAGen.effectiveTime(enc, time); 
        }

        var dPerformers = data[i].performers;
        if (dPerformers) {
            var nPerformer = dPerformers.length;
            for (var j=0; j<nPerformer; ++j) {
                var ae = enc.node('performer').node('assignedEntity');
                libCCDAGen.id(ae, dPerformers[j].identifiers);
                libCCDAGen.addr(ae, dPerformers[j].address);
                libCCDAGen.tel(ae, dPerformers[j].phone);
                libCCDAGen.assignedPerson(ae, dPerformers[j].name);
                libCCDAGen.representedOrganization(ae, dPerformers[j].organization);
                var dPerformersCode = dPerformers[j].code ? dPerformers[j].code[0] : undefined;
                libCCDAGen.code(ae, dPerformersCode);
            }
        }

        libCCDAGen.participant(enc, data[i].locations);

        if (data[i].findings && data[i].findings[0].date_time) {
            libCCDAGen.indicationConstraint(enc, data[i].findings, libCCDAGen.getTimes(data[i].findings[0].date_time));
        }
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}
