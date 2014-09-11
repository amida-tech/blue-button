"use strict";

var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function (data, codeSystems, isCCD, xmlDoc) {
    var doc = new libxmljs.Document();
    if (!isCCD) {
        var xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
                .attr({xmlns: "urn:hl7-org:v3"})
                .attr({"xmlns:cda": "urn:hl7-org:v3"})

                .attr({"xmlns:sdtc": "urn:hl7-org:sdtc"});
            if (data["identifiers"]) {
                xmlDoc = libCCDAGen.id(xmlDoc, data["identifiers"]);    
            }
    }

    libCCDAGen.addr(xmlDoc, data.addresses);
    libCCDAGen.tel(xmlDoc, data.phone, data.email);
    var pat = xmlDoc.node('patient');
    
    if (data.name) {
        libCCDAGen.name(pat, data.name, "L");
    }
    if (data.gender) {
        pat.node('administrativeGenderCode')
            .attr({code: data.gender.substring(0, 1)})
            .attr({codeSystem: "2.16.840.1.113883.5.1"})
            .attr({displayName: data.gender});
    }
    if (data.dob) {
        libCCDAGen.effectiveTime(pat, libCCDAGen.getTimes(data.dob), 'birthTime');
    }   
    if (data.marital_status) {
        libCCDAGen.maritalStatusCode(pat, data.marital_status);
    }

    if (data.religion) {
        libCCDAGen.code(pat, libCCDAGen.reverseTable("2.16.840.1.113883.5.1076", data["religion"]), {}, "religiousAffiliationCode");
    }
    if (data.race_ethnicity) {
        var fullRace = libCCDAGen.reverseTable("2.16.840.1.113883.6.238", data.race_ethnicity);
        if (fullRace.code === "2135-2") {
            libCCDAGen.code(pat, fullRace, {}, 'ethnicGroupCode');
        } else {
            libCCDAGen.code(pat, fullRace, {}, "raceCode");
        }
    }
    if (data.guardians && data.guardians.length > 0) {
        var g = pat.node('guardian');
        libCCDAGen.code(g, libCCDAGen.reverseTable("2.16.840.1.113883.5.111", data.guardians[0] && data.guardians[0].relation));
        libCCDAGen.addr(g, data.guardians[0].addresses);
        libCCDAGen.tel(g, data.guardians[0].phone);
        libCCDAGen.guardianPerson(g, data.guardians);
    }

    if (data.birthplace) {
        var bp = pat.node('birthplace').node('place');
        libCCDAGen.addr(bp, data.birthplace, true);
    }

    if (data.languages) {
        libCCDAGen.languageCommunication(pat, data.languages);
    }

    if (!xmlDoc) {
        xmlDoc = xmlDoc.parent();
    }

    return isCCD ? xmlDoc : doc;
}
