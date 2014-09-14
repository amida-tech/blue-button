"use strict";

var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

var updateOnsetAge = function (xmlDoc, entry) {
    if (entry.onset_age) {
        var es = xmlDoc.node('entryRelationship').attr({
            typeCode: "SUBJ",
            inversionInd: "true"
        });
        var ob = es.node('observation').attr({
            classCode: "OBS",
            moodCode: "EVN"
        }); // age observation template
        ob.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.31"
        });
        libCCDAGen.asIsCode(ob, sec_entries_codes.AgeObservation);
        ob.node('statusCode').attr({
            code: "completed"
        });
        var unit = libCCDAGen.reverseTable("2.16.840.1.113883.11.20.9.21", entry.onset_age_unit).code;
        ob.node('value').attr({
            "xsi:type": "PQ",
            value: entry.onset_age,
            unit: unit
        });
    }
};

var updatePatientStatus = function (xmlDoc, entry) {
    if (entry.patient_status) {
        var es = xmlDoc.node('entryRelationship').attr({
            typeCode: "REFR"
        });
        var ob = es.node('observation').attr({
            classCode: "OBS",
            moodCode: "EVN"
        }); // health status observation template
        ob.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.5"
        });
        libCCDAGen.asIsCode(ob, sec_entries_codes.HealthStatusObservation);
        ob.node('text').node('reference').attr({
            value: "#problems"
        });
        ob.node('statusCode').attr({
            code: "completed"
        });
        ob.node('value').attr({
            "xsi:type": "CD",
            code: "81323004",
            codeSystem: "2.16.840.1.113883.6.96",
            codeSystemName: "SNOMED CT",
            displayName: entry.patient_status
        });
    }
};

var updateStatus = function (xmlDoc, entry, index) {
    var er = xmlDoc.node('entryRelationship').attr({
        typeCode: "REFR"
    });
    var ob = er.node('observation').attr({
        classCode: "OBS"
    }).attr({
        moodCode: "EVN"
    }); // problem status observation
    ob.node('templateId').attr({
        root: "2.16.840.1.113883.10.20.22.4.6"
    });

    libCCDAGen.id(ob, entry.identifiers);
    libCCDAGen.asIsCode(ob, sec_entries_codes.ProblemStatus);

    ob.node('text').node('reference').attr({
        value: "#STAT" + (index + 1)
    });
    ob.node('statusCode').attr({
        code: "completed"
    });

    if (entry.status) {
        libCCDAGen.effectiveTime(ob, libCCDAGen.getTimes(entry.status.date_time));
        libCCDAGen.value(ob, libCCDAGen.reverseTable("2.16.840.1.113883.3.88.12.80.68", entry.status.name), "CD");
    }

};

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.5", "2.16.840.1.113883.10.20.22.2.5.1", "11450-4",
        "2.16.840.1.113883.6.1", "LOINC", "PROBLEM LIST", "PROBLEMS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var e = xmlDoc.node('entry').attr({
            typeCode: "DRIV"
        });
        var act = e.node('act').attr({
            classCode: "ACT",
            moodCode: "EVN"
        }); // problem concern act
        act.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.3"
        });
        libCCDAGen.id(act, data[i].source_list_identifiers);
        libCCDAGen.asIsCode(act, sec_entries_codes.ProblemConcernAct);
        act.node('statusCode').attr({
            code: 'completed'
        });
        libCCDAGen.effectiveTime(act, libCCDAGen.getTimes(data[i].date_time));
        var er = act.node('entryRelationship').attr({
            typeCode: "SUBJ"
        });
        var obsAttrs = {
            classCode: "OBS",
            moodCode: "EVN"
        };
        if (data[i].hasOwnProperty('negation_indicator')) {
            obsAttrs.negationInd = data[i].negation_indicator.toString();
        }
        var ob = er.node('observation').attr(obsAttrs); //problem observation
        ob.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.4"
        });
        libCCDAGen.id(ob, data[i].identifiers);
        ob.node('text').node('reference').attr({
            value: "#problem" + (i + 1)
        });
        ob.node('statusCode').attr({
            code: "completed"
        });
        if (data[i].problem) {
            libCCDAGen.effectiveTime(ob, libCCDAGen.getTimes(data[i].problem.date_time));
            libCCDAGen.value(ob, data[i].problem.code, "CD");
        }
        updateStatus(ob, data[i], i);
        updateOnsetAge(ob, data[i]);
        updatePatientStatus(ob, data[i]);
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
};
