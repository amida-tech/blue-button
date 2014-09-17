"use strict";

var libxmljs = require("libxmljs");
var libCCDAgen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes.codes;

var observationAttrs = function (observation) {
    var attrs = {
        classCode: "OBS",
        moodCode: "EVN"
    };
    if (observation.hasOwnProperty('negation_indicator')) {
        attrs.negationInd = observation.negation_indicator.toString();
    }
    return attrs;
};

var updateAllergen = function (xmlDoc, allergen, index) {
    if (allergen) {
        var p = xmlDoc.node('participant').attr({
            typeCode: "CSM"
        });
        var pr = p.node('participantRole').attr({
            classCode: "MANU"
        });
        var pe = pr.node('playingEntity').attr({
            classCode: "MMAT"
        });
        libCCDAgen.code(pe, allergen);
        pe.node('originalText').node('reference').attr({
            value: "#allergen" + (index + 1)
        });
    } else {
        xmlDoc.node('participant').attr({
            nullFlavor: "UNK"
        });
    }
};

var updateStatus = function (xmlDoc, status) {
    if (status) {
        var er = xmlDoc.node('entryRelationship').attr({
            typeCode: "SUBJ",
            inversionInd: "true"
        });
        var ob = er.node('observation').attr({
            classCode: "OBS",
            moodCode: "EVN"
        });
        ob.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.28"
        });
        libCCDAgen.asIsCode(ob, sec_entries_codes.AllergyStatusObservation);
        ob.node('statusCode').attr({
            code: 'completed'
        });
        libCCDAgen.value(ob, status, "CE");
    }
};

var updateReaction = function (xmlDoc, reaction, i) { // Allergy reaction observation
    var es = xmlDoc.node('entryRelationship').attr({
        typeCode: "MFST",
        inversionInd: "true"
    });
    var ob = es.node('observation').attr({
        classCode: "OBS",
        moodCode: "EVN"
    });

    ob.node('templateId').attr({
        root: "2.16.840.1.113883.10.20.22.4.9"
    });

    libCCDAgen.id(ob, reaction.identifiers);

    ob.node('code').attr({
        nullFlavor: "NA"
    });
    ob.node('text').node('reference').attr({
        value: "#reaction" + (i + 1)
    });
    ob.node('statusCode').attr({
        code: 'completed'
    });
    libCCDAgen.effectiveTime(ob, libCCDAgen.getTimes(reaction["date_time"]));
    libCCDAgen.value(ob, reaction.reaction, "CD");
    var es2 = ob.node('entryRelationship').attr({
        typeCode: "SUBJ",
        inversionInd: "true"
    });
    var ob2 = es2.node('observation').attr({
        classCode: "OBS",
        moodCode: "EVN"
    });
    ob2.node('templateId').attr({
        root: "2.16.840.1.113883.10.20.22.4.8"
    });
    libCCDAgen.asIsCode(ob2, sec_entries_codes.SeverityObservation);
    ob2.node('text').node('reference').attr({
        value: "#severity" + (i + 4)
    });
    ob2.node('statusCode').attr({
        code: 'completed'
    });
    var dis = reaction.severity;
    if (dis) {
        libCCDAgen.value(ob2, dis.code, "CD");
        libCCDAgen.code(ob2, dis.interpretation, 'interpretationCode');
    }
};

var updateReactions = function (xmlDoc, reactions) { // Allergy reaction observation
    if (reactions) {
        var n = reactions.length;
        for (var i = 0; i < n; ++i) {
            updateReaction(xmlDoc, reactions[i], i);
        }
    }
};

var updateSeverity = function (xmlDoc, severity, index) {
    if (severity) {
        var erAttrs = {
            typeCode: "SUBJ",
            inversionInd: "true"
        };
        var er = xmlDoc.node('entryRelationship').attr(erAttrs);
        var ob = er.node('observation').attr({
            classCode: "OBS",
            moodCode: "EVN"
        });
        ob.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.8"
        });
        libCCDAgen.asIsCode(ob, sec_entries_codes.SeverityObservation);
        ob.node('text').node('reference').attr({
            value: "#severity" + (index + 1)
        });
        ob.node('statusCode').attr({
            code: 'completed'
        });
        libCCDAgen.value(ob, severity.code, "CD");
        libCCDAgen.code(ob, severity.interpretation, 'interpretationCode');
    }
};

var updateObservation = function (xmlDoc, observation, index) {
    if (observation) {
        var er = xmlDoc.node('entryRelationship').attr({
            typeCode: "SUBJ",
            inversionInd: "true"
        });
        var ob = er.node('observation').attr(observationAttrs(observation));
        ob.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.7"
        }); // allergy intolerance observation
        libCCDAgen.id(ob, observation.identifiers);
        libCCDAgen.asIsCode(ob, sec_entries_codes.AllergyObservation);
        ob.node('statusCode').attr({
            code: 'completed'
        });
        if (observation.date_time) {
            libCCDAgen.effectiveTime(ob, libCCDAgen.getTimes(observation.date_time));
        }
        if (observation.intolerance) {
            libCCDAgen.value(ob, observation.intolerance, "CD", (index + 1));
        }
        updateAllergen(ob, observation.allergen, index);
        updateStatus(ob, observation.status);
        updateReactions(ob, observation.reactions);
        updateSeverity(ob, observation.severity, index);
    }
};

var updateEntry = function (xmlDoc, entry, index) {
    var e = xmlDoc.node('entry').attr({
        typeCode: "DRIV"
    });
    var act = e.node('act').attr({
        classCode: "ACT",
        moodCode: "EVN"
    });
    act.node('templateId').attr({
        root: "2.16.840.1.113883.10.20.22.4.30"
    });
    libCCDAgen.id(act, entry.identifiers);
    libCCDAgen.asIsCode(act, sec_entries_codes.AllergiesSection);
    act.node('statusCode').attr({
        code: 'active'
    });
    if (entry.date_time) {
        libCCDAgen.effectiveTime(act, libCCDAgen.getTimes(entry.date_time));
    }
    updateObservation(act, entry.observation, index);
};

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    // create a new xml document and generate the header
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAgen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1",
        sec_entries_codes["AllergiesSection"], "ALLERGIES, ADVERSE REACTIONS, ALERTS", isCCD);

    // Now loop over each entry in the data set
    for (var i = 0; i < data.length; i++) {
        updateEntry(xmlDoc, data[i], i);
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument (or component)
    return isCCD ? xmlDoc : doc;
};
