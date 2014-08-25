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
    xmlDoc = libCCDAGen.tel(xmlDoc, data["phone"]);
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
         xmlDoc = libCCDAGen.code(xmlDoc, libCCDAGen.reverseTable("2.16.840.1.113883.6.238", 
            data["race_ethnicity"]), {}, "raceCode").parent();
    }
    xmlDoc = xmlDoc.node('ethnicGroupCode').attr({code: "2186-5"})
            .attr({displayName: "Not Hispanic or Latino"})
            .attr({codeSystem: "2.16.840.1.113883.6.238"})
            .attr({codeSystemName: "Race \u0026 Ethnicity - CDC"}).parent()
        .node('guardian');
            xmlDoc = libCCDAGen.code(xmlDoc, 
                libCCDAGen.reverseTable("2.16.840.1.113883.5.111", data["guardians"] ? data["guardians"][0]["relation"].toLowerCase() : undefined)).parent();
            xmlDoc = libCCDAGen.addr(xmlDoc, data["addresses"]);
            xmlDoc = libCCDAGen.tel(xmlDoc, data["phone"]);
            xmlDoc = libCCDAGen.guardianPerson(xmlDoc, data["guardians"]);
        xmlDoc = xmlDoc.parent()
        .node('birthplace')
            .node('place');
                xmlDoc = libCCDAGen.addr(xmlDoc, data["addresses"], true);
            xmlDoc = xmlDoc.parent()
        .parent();
    xmlDoc = libCCDAGen.languageCommunication(xmlDoc, data["languages"]);
    xmlDoc = xmlDoc.parent()
        .node('providerOrganization') // This can be refactored once demographics parses providerOrganization using templating
            .node('id').attr({root: "2.16.840.1.113883.4.6"}).parent() // functions representedOrganization function
            .node('name', "Community Health and Hospitals").parent()
            .node('telecom').attr({use: "WP"}).attr({value: "tel: 555-555-5000"}).parent()
            .node('addr')
            .node('streetAddressLine', '1001 Village Avenue').parent()
            .node('city', 'Portland').parent()
            .node('state', 'OR').parent()
            .node('postalCode', '99123').parent()
            .node('country', 'US').parent()
        .parent()
    .parent();
    if (!xmlDoc) {
        xmlDoc = xmlDoc.parent();
    }

    return isCCD ? xmlDoc : doc;
}
