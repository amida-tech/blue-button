var libxmljs = require("libxmljs");


function writeXML(sectionNumber, data, codeSystems) {
    var xml = {};
    if (sectionNumber == 5) {
        xml = loadDemographics(sectionNumber, data, codeSystems);
    }
    return xml;
}


function loadDemographics(sectionNumber, data, codeSystems) {
     // determining the number of entries
    var entriesArr = [];
    var entries = {};
    for (var i = 0; i < data.length; i++) {
        entriesArr = data["date"][0]["date"].slice(0,4);
        entries[entriesArr] = i + 1;
    }
    var uniqueEntries = entriesArr.filter(function(v,i) { return i == entriesArr.lastIndexOf(v); });

    for (var i = 1; i < uniqueEntries.length; i++) {
        entries[uniqueEntries] = entries[uniqueEntries] - entries[uniqueEntries[i-1]];
    }

    var dob = data["dob"][0]["date"];
    dob.split("-");
    dob[2] = dob[2].slice(0,2);
    dob = dob[0] + dob[1] + dob[2];

    // demographics
    var doc = new libxmljs.Document();
    var xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
        .attr({xmlns: "urn:hl7-org:v3"}).attr({"xmlns:cda": "urn:hl7-org:v3"}).attr({"xmlns:sdtc": "urn:hl7-org:sdtc"})
        .node('id').attr({extension: data["identifiers"][0]["identifier_type"]})
                   .attr({root: data["identifiers"][0]["identifier"]}).parent()
        .node('id').attr({extension: data["identifiers"][1]["identifier_type"]})
                   .attr({root: data["identifiers"][1]["identifier"]}).parent()
        .node('addr').attr({use: "HP"})
            .node('streetAddressLine', data["addresses"][0]["streetLines"][0]).parent()
            .node('city', data["addresses"][0]["city"]).parent()
            .node('state', data["addresses"][0]["state"]).parent()
            .node('postalCode', data["addresses"][0]["zip"]).parent()
            .node('country', data["addresses"][0]["country"]).parent()
        .parent()
        .node('telecom').attr({value: "tel:" + data["phone"][0]["number"]}).attr({use: "HP"}).parent()
        .node('patient')
            .node('name').attr({use: "L"})
                .node('given', data["name"]["first"]).parent()
                .node('given', data["name"]["middle"][0]).parent()
                .node('family', data["name"]["last"]).parent()
            .parent()
            .node('administrativeGenderCode').attr({code: data["gender"].substring(0,1)})
                                             .attr({codeSystem: "2.16.840.1.113883.5.1"})
                                             .attr({displayName: data["gender"]}).parent()
            .node('birthTime').attr({value: dob}).parent()
            .node('maritalStatusCode').attr({code: data["marital_status"].substring(0,1)})
                                      .attr({displayName: data["marital_status"]})
                                      .attr({codeSystem: "2.16.840.1.113883.5.2"})
                                      .attr({codeSystemName: "MaritalStatusCode"}).parent()
            .node('religiousAffiliationCode').attr({code: "1013"})
                                             .attr({displayName: data["religion"]})
                                             .attr({codeSystemName: "HL7 Religious Affiliation"})
                                             .attr({codeSystem: "2.16.840.1.113883.5.1076"}).parent()
            .node('raceCode').attr({code: "2106-3"})
                             .attr({displayName: data["race_ethnicity"]})
                             .attr({codeSystem: "2.16.840.1.113883.6.238"})
                             .attr({codeSystemName: "Race &amp; Ethnicity - CDC"}).parent()
            .node('ethnicGroupCode').attr({code: "2186-5"}).attr({displayName: "Not Hispanic or Latino"})
                                    .attr({codeSystem: "2.16.840.1.113883.6.238"})
                                    .attr({codeSystemName: "Race &amp; Ethnicity - CDC"}).parent()
            .node('guardian')
                .node('code').attr({code: "PRN"})
                             .attr({displayName: "Parent"})
                             .attr({codeSystem: "2.16.840.1.113883.5.111"})
                             .attr({codeSystemName: "HL7 Role Code"}).parent()
                .node('addr').attr({use: "HP"})
                    .node('streetAddressLine', data["addresses"][0]["streetLines"][0]).parent()
                    .node('city', data["addresses"][0]["city"]).parent()
                    .node('state', data["addresses"][0]["state"]).parent()
                    .node('postalCode', data["addresses"][0]["zip"]).parent()
                    .node('country', data["addresses"][0]["country"]).parent()
                .parent()
                .node('telecom').attr({value: data["guardians"][0]["phone"][0]["number"]}).attr({use: "HP"}).parent()
                .node('guardianPerson')
                    .node('name')
                        .node('given', data["guardians"][0]["names"][0]["first"]).parent()
                        .node('family', data["guardians"][0]["names"][0]["last"]).parent()
                    .parent()
                .parent()
            .parent()
            .node('birthplace')
                .node('place')
                    .node('addr')
                        .node('city', data["addresses"][0]["city"]).parent()
                        .node('state', data["addresses"][0]["state"]).parent()
                        .node('postalCode', data["addresses"][0]["zip"]).parent()
                        .node('country', data["addresses"][0]["country"]).parent()
                    .parent()
                .parent()
            .parent()
            .node('languageCommunication')
                .node('languageCode').attr({code: data["languages"][0]["language"]}).parent()
                .node('modeCode').attr({code: "ESP"})
                                 .attr({displayName: data["languages"][0]["mode"]})
                                 .attr({codeSystem: "2.16.840.1.113883.5.60"})
                                 .attr({codeSystemName: "LanguageAbilityMode"}).parent()
                .node('proficiencyLevelCode').attr({code: data["languages"][0]["proficiency"].substring(0,1)})
                                             .attr({displayName: data["languages"][0]["proficiency"]})
                                             .attr({codeSystem: "2.16.840.1.113883.5.61"})
                                             .attr({codeSystemName: "LanguageAbilityProficiency"}).parent()
                .node('preferenceInd').attr({value: "true"}).parent()
            .parent()
        .parent()
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
        .parent()
    .parent()

    return doc;
}

module.exports = function() {
    return writeXML(arguments["0"], arguments["1"], arguments["2"]);
}

