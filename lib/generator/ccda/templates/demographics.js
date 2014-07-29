var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function (data, codeSystems, isCCD, xmlDoc) {
    var dob = libCCDAGen.getTimes(data["dob"]);
    var doc = new libxmljs.Document();
    if (!isCCD) {
        var xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
                .attr({xmlns: "urn:hl7-org:v3"})
                .attr({"xmlns:cda": "urn:hl7-org:v3"})
                .attr({"xmlns:sdtc": "urn:hl7-org:sdtc"})
            .node('id').attr({extension: data["identifiers"][0]["identifier_type"]})
                .attr({root: data["identifiers"][0]["identifier"]}).parent()
            .node('id').attr({extension: data["identifiers"][1]["identifier_type"]})
                .attr({root: data["identifiers"][1]["identifier"]}).parent();
    }

    xmlDoc = libCCDAGen.addr(xmlDoc, data["addresses"]);
    xmlDoc = libCCDAGen.tel(xmlDoc, data["phone"]);
    xmlDoc = xmlDoc.node('patient');
    xmlDoc = libCCDAGen.name(xmlDoc, data["name"]);
    xmlDoc = xmlDoc.node('administrativeGenderCode')
        .attr({code: data["gender"].substring(0, 1)})
        .attr({codeSystem: "2.16.840.1.113883.5.1"})
        .attr({displayName: data["gender"]}).parent()
        .node('birthTime').attr({value: dob[0]}).parent();
    xmlDoc = libCCDAGen.maritalStatusCode(xmlDoc, data["marital_status"]);

    if (data["religion"]) {
        xmlDoc = xmlDoc.node('religiousAffiliationCode').attr({code: "1013"})
            .attr({displayName: data["religion"]})
            .attr({codeSystemName: "HL7 Religious Affiliation"})
            .attr({codeSystem: "2.16.840.1.113883.5.1076"}).parent();
    }
    if (data["race_ethnicity"]) {
        xmlDoc = xmlDoc.node('raceCode').attr({code: "2106-3"})
            .attr({displayName: data["race_ethnicity"]})
            .attr({codeSystem: "2.16.840.1.113883.6.238"})
            .attr({codeSystemName: "Race \u0026 Ethnicity - CDC"}).parent()
    }
    xmlDoc = xmlDoc.node('ethnicGroupCode').attr({code: "2186-5"}).attr({displayName: "Not Hispanic or Latino"})
            .attr({codeSystem: "2.16.840.1.113883.6.238"})
            .attr({codeSystemName: "Race \u0026 Ethnicity - CDC"}).parent()
        .node('guardian')
            .node('code').attr({code: "PRN"})
                .attr({displayName: "Parent"})
                .attr({codeSystem: "2.16.840.1.113883.5.111"})
                .attr({codeSystemName: "HL7 Role Code"}).parent();
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
        .node('providerOrganization')
        .node('id').attr({root: "2.16.840.1.113883.4.6"}).parent()
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
    if (xmlDoc == undefined) {
        xmlDoc = xmlDoc.parent();
    }

    return isCCD ? xmlDoc : doc;
}
