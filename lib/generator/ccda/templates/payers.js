var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes.codes;

var updateCoveredParticipant = function (xmlDoc, participant) {
    if (participant) {
        var p = xmlDoc.node('participant').attr({
            typeCode: "COV"
        });
        p.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.89"
        });
        var time = libCCDAGen.getTimes(participant.date_time);
        if (time) {
            libCCDAGen.effectiveTime(p, time, 'time');
        }
        var pr = p.node('participantRole').attr({
            classCode: "PAT"
        });

        if (participant.performer) {
            libCCDAGen.id(pr, participant.performer.identifiers);
            libCCDAGen.addr(pr, participant.performer.address);
            libCCDAGen.tel(pr, participant.performer.phone);
        }

        libCCDAGen.code(pr, participant.code);
        if (participant.name) {
            var pe = pr.node('playingEntity');
            libCCDAGen.addName(pe, participant.name);
        }
    }
};

var updatePolicyHolder = function (xmlDoc, performer) {
    if (performer) {
        var p = xmlDoc.node('participant').attr({
            typeCode: "HLD"
        });
        p.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.90"
        });
        var pr = p.node('participantRole');
        libCCDAGen.id(pr, performer.identifiers);
        libCCDAGen.addr(pr, performer.address);
    }
};

var updateAuthorization = function (xmlDoc, authorization) {
    if (authorization) {
        // Authorization Activity
        var er = xmlDoc.node('entryRelationship').attr({
            typeCode: "REFR"
        });
        var act = er.node('act').attr({
            classCode: "ACT"
        }).attr({
            moodCode: "EVN"
        });
        act.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.1.19"
        });
        libCCDAGen.id(act, authorization.identifiers);
        if (authorization.procedure) {
            var er2 = act.node('entryRelationship').attr({
                typeCode: 'SUBJ'
            });
            var p = er2.node('procedure').attr({
                classCode: "PROC",
                moodCode: "PRMS"
            });
            libCCDAGen.code(p, authorization.procedure.code);
        }
    }
};

var updatePolicy = function (xmlDoc, policy) {
    if (policy) {
        libCCDAGen.id(xmlDoc, policy.identifiers);
        libCCDAGen.code(xmlDoc, policy.code);
        if (policy.insurance) {
            libCCDAGen.performerRevised(xmlDoc, policy.insurance.performer, {
                "typeCode": "PRF",
                "tID": "2.16.840.1.113883.10.20.22.4.87",
                code: policy.insurance.code
            });
        }
    }
};

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.18", undefined,
        sec_entries_codes["PayersSection"], "INSURANCE PROVIDERS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var e = xmlDoc.node('entry').attr({
            typeCode: "DRIV"
        });
        var a = e.node('act').attr({
            classCode: "ACT",
            moodCode: "EVN"
        });
        a.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.60"
        });
        libCCDAGen.id(a, data[i]["identifiers"]);
        libCCDAGen.asIsCode(a, bbm.CCDA.sections_entries_codes.codes.CoverageActivity);
        a.node('statusCode').attr({
            code: "completed"
        }).parent();

        var er = a.node('entryRelationship').attr({
            typeCode: "COMP"
        });
        var act = er.node('act').attr({
            classCode: "ACT"
        }).attr({
            moodCode: "EVN"
        });
        act.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.61"
        });
        act.node('statusCode').attr({
            code: "completed"
        });

        updatePolicy(act, data[i].policy);
        var dGuarantor = data[i].guarantor;
        if (dGuarantor) {
            libCCDAGen.performerRevised(act, dGuarantor, {
                "typeCode": "PRF",
                "tID": "2.16.840.1.113883.10.20.22.4.89",
                code: dGuarantor.code
            });
        }

        updateCoveredParticipant(act, data[i].participant);
        updatePolicyHolder(act, data[i].policy_holder && data[i].policy_holder.performer);
        updateAuthorization(act, data[i].authorization);
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end component/clinicalDocument
    return isCCD ? xmlDoc : doc;
};
