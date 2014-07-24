var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function (data, codeSystems, isCCD, CCDxml) {

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.18", undefined, "48768-6",
        "2.16.840.1.113883.6.1", "LOINC", "Payer", "INSURANCE PROVIDERS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        // var date_times = libCCDAGen.getTimes(data[i]["date_time"]);
        xmlDoc = xmlDoc.node('entry').attr({ typeCode: "DRIV" })
            .node('act').attr({
                classCode: "ACT"
            }).attr({
                moodCode: "EVN"
            })
            .node('templateId').attr({
                root: "2.16.840.1.113883.10.20.22.4.60"
            }).parent();
        xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
        xmlDoc = xmlDoc.node('code')
            .attr({
                code: "48768-6"
            })
            .attr({
                codeSystem: "2.16.840.1.113883.6.1"
            })
            .attr({
                codeSystemName: "LOINC"
            })
            .attr({
                displayName: "Payment sources"
            }).parent()
            .node('statusCode').attr({
                code: "completed"
            }).parent();
        xmlDoc = xmlDoc.node('entryRelationship').attr({
            typeCode: "COMP"
        })
            .node('act').attr({
                classCode: "ACT"
            }).attr({
                moodCode: "EVN"
            })
            .node('templateId').attr({
                root: "2.16.840.1.113883.10.20.22.4.61"
            }).parent();
        xmlDoc = libCCDAGen.id(xmlDoc, data[i]["policy"]["identifiers"]);
        xmlDoc = libCCDAGen.code(xmlDoc, data[i]["policy"]["code"]).parent();
        xmlDoc = xmlDoc.node('statusCode').attr({
            code: "completed"
        }).parent();
        xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i]["policy"]["insurance"]["performer"], {
            "typeCode": "PRF",
            "tID": "2.16.840.1.113883.10.20.22.4.87"
        });
        xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i]["guarantor"], {
            "typeCode": "PRF",
            "tID": "2.16.840.1.113883.10.20.22.4.89"
        });

        // Covered Party Participant
        xmlDoc = xmlDoc.node('participant').attr({
            typeCode: "COV"
        })
            .node('templateId').attr({
                root: "2.16.840.1.113883.10.20.22.4.89"
            }).parent()
            .node('time')
            .node('low').attr(data[i]["participant"]["date_time"]["low"] ? {
                value: data[i]["participant"]["date_time"]["low"]
            } : {
                nullFlavor: "UNK"
            }).parent()
            .node('high').attr(data[i]["participant"]["date_time"]["high"] ? {
                value: data[i]["participant"]["date_time"]["high"]
            } : {
                nullFlavor: "UNK"
            }).parent()
            .parent()
            .node('participantRole').attr({
                classCode: "PAT"
            }); // service delivery location template
        xmlDoc = libCCDAGen.id(xmlDoc, data[i]["participant"]["performer"]["identifiers"]);
        xmlDoc = libCCDAGen.code(xmlDoc, data[i]["participant"]["code"]).parent();
        xmlDoc = libCCDAGen.addr(xmlDoc, data[i]["participant"]["performer"]["address"]);
        xmlDoc = libCCDAGen.playingEntity(xmlDoc, data[i]["participant"]["name"]);
        xmlDoc = xmlDoc.parent()
            .parent()

        // Policy Holder
        xmlDoc = xmlDoc.node('participant').attr({
            typeCode: "HLD"
        })
            .node('templateId').attr({
                root: "2.16.840.1.113883.10.20.22.4.90"
            }).parent()
            .node('participantRole')
        xmlDoc = libCCDAGen.id(xmlDoc, data[i]["policy_holder"]["performer"]["identifiers"])
        xmlDoc = libCCDAGen.addr(xmlDoc, data[i]["policy_holder"]["performer"]["address"])
        xmlDoc = xmlDoc.parent()
            .parent()

        // Authorization Activity
        xmlDoc = xmlDoc.node('entryRelationship').attr({
            typeCode: "REFR"
        })
            .node('act').attr({
                classCode: "ACT"
            }).attr({
                moodCode: "EVN"
            })
            .node('templateId').attr({
                root: "2.16.840.1.113883.10.20.1.19"
            }).parent();
        xmlDoc = libCCDAGen.id(xmlDoc, data[i]["authorization"]["identifiers"]);
        xmlDoc = libCCDAGen.code(xmlDoc, data[i]["code"]).parent();
        xmlDoc = xmlDoc.node('entryRelationship').attr({
            typeCode: 'SUBJ'
        })
            .node('procedure').attr({
                classCode: "PROC"
            }).attr({
                moodCode: "PRMS"
            })
        xmlDoc = libCCDAGen.code(xmlDoc, data[i]["authorization"]["procedure"]).parent()
        xmlDoc = xmlDoc.parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end component/clinicalDocument
    return isCCD ? xmlDoc : doc;
}
