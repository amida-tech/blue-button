/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in 
standard XML/CCDA format) back to XML/CCDA format. In order to re-build the CCD accurately, the script determines the 
section template to which the data belongs to by analyzing its value set codes. In other words, if the JSON data contains 
a value set belonging to a certain section, then it must belong to that section since different sections do not have the 
same value sets.

For example, if the JSON data contains an entry with a code of 8302-2 (which belongs to the value set "Height"), then that 
entry must be a descendant of the Vital Signs section template since the Vital Signs section contains such a value set, as 
specified by the CCDA standard (available at http://www.hl7.org/implement/standards/product_brief.cfm?product_id=258).

Once the section template is determined, an XML document is generated using the libxmljs Document API and passing in the 
appropriate XML attributes for the section template determined previously.
*/

var libxmljs = require("libxmljs");

// Map section number to section name and specify order for valueSetCodesToSections parallel array
var sectionNames = {
    1: "demographics",
    2: "allergies",
    3: "encounters",
    4: "immunizations",
    5: "medications",
    6: "problems",
    7: "procedures",
    8: "results",
    9: "socialHistory",
    10: "vitals"
}

/*
This data structure maps code system names to code systems identifiers.
*/
var codeSystems = {
    "LOINC": ["2.16.840.1.113883.6.1", "8716-3"], 
    "SNOMED CT": ["2.16.840.1.113883.6.96", "46680005"], 
    "RXNORM": "2.16.840.1.113883.6.88",
    "ActCode": "2.16.840.1.113883.5.4", 
    "CPT-4": "2.16.840.1.113883.6.12", 
    "CVX": "2.16.840.1.113883.12.292", 
    "HL7ActCode": "2.16.840.1.113883.5.4"
}

/*
This function takes JSON data as a parameter, determines its section template, then generates an 
XML document appropriate to that section.

@data the JSON data to be converted to XML/CCDA
*/
var gen = function(data, CCD, xmlDoc) {
    return require('./templates/' + sectionNames[determineSection(data)] + '.js')(data, codeSystems, CCD, xmlDoc);
};

/*
This function takes JSON data as a parameter, determines its section template, then generates an 
XML document appropriate to that section.

@data the JSON data to be converted to XML/CCDA
*/
var genWholeCCDA = function(data) {
    return generateCCDHeader(data);
}

function generateCCDHeader(data) {
    var doc = new libxmljs.Document();
    var xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
        .attr({xmlns: "urn:hl7-org:v3"}).attr({"xmlns:cda": "urn:hl7-org:v3"}).attr({"xmlns:sdtc": "urn:hl7-org:sdtc"})
        .node('realmCode').attr({code: "US"}).parent()
        .node('typeId').attr({root: "2.16.840.1.113883.1.3"}).attr({extension: "POCD_HD000040"}).parent()
        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.1.1"}).parent()
        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.1.2"}).parent()
        .node('id').attr({extension: "TT988"}).attr({root: "2.16.840.1.113883.19.5.99999.1"}).parent()
        .node('code').attr({codeSystem: "2.16.840.1.113883.6.1"}).attr({codeSystemName: "LOINC"})
                     .attr({code: "34133-9"}).attr({displayName: "Summarization of Episode Note"}).parent()
        .node('title', "Community Health and Hospitals: Health Summary").parent()
        .node('effectiveTime').attr({value: "TODO"}).parent()
        .node('confidentialityCode').attr({code: "N"}).attr({codeSystem: "2.16.840.1.113883.5.25"}).parent()
        .node('languageCode').attr({code: "en-US"}).parent()
        .node('setId').attr({extension: "sTT988"}).attr({root: "2.16.840.1.113883.19.5.99999.19"}).parent()
        .node('versionNumber').attr({value: "1"}).parent()
        .node('recordTarget')
           .node('patientRole')
               .node('id').attr({extension: "998991"}).attr({root: "2.16.840.1.113883.19.5.99999.2"}).parent()
               .node('id').attr({extension: "111-00-2330"}).attr({root: "2.16.840.1.113883.4.1"}).parent();

               xmlDoc = gen(data[sectionNames[1]], true, xmlDoc); // demographics is in the header
            xmlDoc = xmlDoc.parent() // end patientRole
        .parent() // end recordTarget
        xmlDoc = xmlDoc.node('component')
            .node('structuredBody')
                for (var i = 2; i <= 10; i++) {
                    xmlDoc = gen(data[sectionNames[i]], true, xmlDoc);
                    xmlDoc = xmlDoc.parent()
                    .parent()
                }
            xmlDoc = xmlDoc.parent()
    return doc;
}

function determineSection(json) {
    
    if (json[0] && json[0]["reaction"]) { // allergies
        sectionNumber = 2
    } else if (json[0] && json[0]["sig"]) { // medications
        sectionNumber = 5
    } else if (json[0] && json[0]["onset_age"]) { // problems
        sectionNumber = 6
    } else if (json[0] && json[0]["results"] != undefined) {// results
        sectionNumber = 8
    } else if (json["gender"]) { // demographics
        sectionNumber = 1
    } else if (json[0] && json[0]["body_sites"]) { // procedures
        sectionNumber = 7
    } else if (json[0] && json[0]["locations"]) { // encounters
        sectionNumber = 3
    } else if (json[0] && json[0]["product"]) { // immunizations
        sectionNumber = 4
    } else if (json[0] && json[0]["vital"]) { // vital signs
        sectionNumber = 10
    } else { // social history
        sectionNumber = 9
    }
    return sectionNumber;
};


module.exports = gen;
module.exports.genWholeCCDA = genWholeCCDA;





