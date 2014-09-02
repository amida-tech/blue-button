var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function (data, codeSystems, isCCD, xmlDoc) {
    var dob = libCCDAGen.getTimes(data["dob"]);
    var doc = new libxmljs.Document();
    if (!isCCD) {
        var xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
                .attr({xmlns: "urn:hl7-org:v3"})
                .attr({"xmlns:cda": "urn:hl7-org:v3"})

                .attr({"xmlns:sdtc": "urn:hl7-org:sdtc"});
            xmlDoc = libCCDAGen.id(xmlDoc, data["identifiers"]);
            xmlDoc = xmlDoc.node('id')
                .attr({extension: data["identifiers"][1]["extension"]})
                .attr({root: data["identifiers"][1]["identifier"]}).parent();
    }

    xmlDoc = libCCDAGen.addr(xmlDoc, data["addresses"]);
    xmlDoc = libCCDAGen.tel(xmlDoc, data["phone"], data.email);
    xmlDoc = xmlDoc.node('patient');
    xmlDoc = libCCDAGen.name(xmlDoc, data["name"], "L");
    xmlDoc = xmlDoc.node('administrativeGenderCode')
        .attr({code: data["gender"].substring(0, 1)})
        .attr({codeSystem: "2.16.840.1.113883.5.1"})
        .attr({displayName: data["gender"]}).parent();
    xmlDoc = libCCDAGen.effectiveTime(xmlDoc, dob, 'birthTime');
    xmlDoc = libCCDAGen.maritalStatusCode(xmlDoc, data["marital_status"]);

    if (data["religion"]) {
        xmlDoc = libCCDAGen.code(xmlDoc, libCCDAGen.reverseTable("2.16.840.1.113883.5.1076", 
            data["religion"]), {}, "religiousAffiliationCode").parent();
    }
    if (data["race_ethnicity"]) {
        var fullRace = libCCDAGen.reverseTable("2.16.840.1.113883.6.238", data.race_ethnicity);
        if (fullRace.code === "2135-2") {
            xmlDoc = libCCDAGen.code(xmlDoc, fullRace, {}, 'ethnicGroupCode').parent();
        } else {
            xmlDoc = libCCDAGen.code(xmlDoc, fullRace, {}, "raceCode").parent();
        }
    }

    if (data.guardians) {
        xmlDoc = xmlDoc.node('guardian');
            xmlDoc = libCCDAGen.code(xmlDoc, 
                libCCDAGen.reverseTable("2.16.840.1.113883.5.111", data.guardians ? data.guardians[0].relation : undefined)).parent();
            xmlDoc = libCCDAGen.addr(xmlDoc, data.guardians[0].addresses);
            xmlDoc = libCCDAGen.tel(xmlDoc, data.guardians[0].phone);
            xmlDoc = libCCDAGen.guardianPerson(xmlDoc, data.guardians);
        xmlDoc = xmlDoc.parent();
    }

    xmlDoc = xmlDoc.node('birthplace')
            .node('place');
                xmlDoc = libCCDAGen.addr(xmlDoc, data.birthplace, true);
            xmlDoc = xmlDoc.parent()
        .parent();
    xmlDoc = libCCDAGen.languageCommunication(xmlDoc, data["languages"]).parent();
    // xmlDoc = xmlDoc.
    //     .node('providerOrganization') // This can be refactored once demographics parses providerOrganization using templating
    //         .node('id').attr({root: "2.16.840.1.113883.4.6"}).parent() // functions representedOrganization function
    //         .node('name', "Community Health and Hospitals").parent()
    //         .node('telecom').attr({use: "WP"}).attr({value: "tel: 555-555-5000"}).parent()
    //         .node('addr')
    //         .node('streetAddressLine', '1001 Village Avenue').parent()
    //         .node('city', 'Portland').parent()
    //         .node('state', 'OR').parent()
    //         .node('postalCode', '99123').parent()
    //         .node('country', 'US').parent()
    //     .parent()
    // .parent();
    if (!xmlDoc) {
        xmlDoc = xmlDoc.parent();
    }

    return isCCD ? xmlDoc : doc;
}
