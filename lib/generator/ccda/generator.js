/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in 
standard XML/CCDA format) back to XML/CCDA format. The script determines the 
section template to which the data belongs to by matching on its object properties (the determineSection function). 

Two different functions allow for the upload of data that belongs only to a single section, or data for all sections
in a CCD-A document (gen() vs. genWholeCCDA()). This aids in unit testing the individual sections for accuracy, even though
in reality we do not need support for this.

When the section has been determined, it is used to summon appropriate templating file from lib/generator/templates, which then
generates the appropriate XML using the libxmljs Document API.

In the case of compiling a whole CCD-A document, these individual sections are strung together and returned as one single
document.
*/

var libxmljs = require("libxmljs");

// Map section number to section name. 
// This is the order that these section appear in the CCD-A document. 
var sectionNames = {
    0: "null",
    1: "demographics",
    2: "allergies",
    3: "encounters",
    4: "immunizations",
    5: "medications",
    6: "problems",
    7: "procedures",
    8: "results",
    9: "social_history",
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
Generates individual CCD-A sections. This function takes JSON data (@data) as a parameter, determines its section, then calls the appropriate
template and returns the result.

@data the section JSON data to be converted to XML/CCDA
*/
var gen = function(data, CCD, xmlDoc) {
    // console.log(data);
    if (data !== undefined) {
        return require('./templates/' + sectionNames[determineSection(data)] + '.js')(data, codeSystems, CCD, xmlDoc);
    } else {
        return xmlDoc;
    }
};

/*
Generates an entire CCD-A document. Uses gen() to string together the individual CCD-A sections. First, it generates
the CCD-A header, then it simply exectues for loop and iterates through all the section templates, stringing them 
together one after another.

@data the entire CCD-A JSON data to be converted to XML/CCDA
*/
var genWholeCCDA = function(data) {
    if (data.data != undefined) {
        data = data.data;
    }
    // console.log(data);
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
               .node('id').attr({extension: "998991"}).attr({root: "2.16.840.1.113883.19.5.99999.2"}).parent();
               // .node('id').attr({extension: "111-00-2330"}).attr({root: "2.16.840.1.113883.4.1"}).parent();

               xmlDoc = gen(data[sectionNames[1]], true, xmlDoc); // demographics is in the header
            xmlDoc = xmlDoc.parent() // end patientRole
        .parent() // end recordTarget

        // count the number of sections defined
        var count_sections = 0;
        for (sections in data) {
            if (sections != "demographics") {
                count_sections++;
            }
        }

        // if there are more sections than just demographics, then serialize them
        if (count_sections > 0) { 
            xmlDoc = xmlDoc.node('component')
                .node('structuredBody')
                    for (var i = 2; i <= 10; i++) {
                        // console.log("Section should be: " + sectionNames[i]);
                        xmlDoc = gen(data[sectionNames[i]], true, xmlDoc);
                        // xmlDoc = xmlDoc.parent()
                        // .parent()
                    }
        }
            xmlDoc = xmlDoc.parent() // end clinical document
    return doc;
}

/* Determines the section to which the data belongs to by matching its object properties
to the properties that a section is known to have, then returns a number in sectionNames map.
*/
function determineSection(json) {
    if (json != undefined) {
        if (json[0] && json[0]["allergen"]) { // allergies
            sectionNumber = 2
        } else if (json[0] && json[0]["sig"]) { // medications
            sectionNumber = 5
        } else if (json[0] && json[0]["problem"]) { // problems
            sectionNumber = 6
        } else if (json[0] && json[0]["results"] != undefined) { // results
            sectionNumber = 8
        } else if (json["gender"]) { // demographics
            sectionNumber = 1
        } else if (json[0] && json[0]["procedure"]) { // procedures
            sectionNumber = 7
        } else if (json[0] && json[0]["encounter"]) { // encounters
            sectionNumber = 3
        } else if (json[0] && json[0]["product"]) { // immunizations
            sectionNumber = 4
        } else if (json[0] && json[0]["vital"]) { // vital signs
            sectionNumber = 10
        } else if (json[0] && json[0]["smoking_statuses"]) { // social history
            sectionNumber = 9
        } else {
            return 3;
        }
        // console.log("Section actually is: " + sectionNames[sectionNumber]);
        return sectionNumber;    
    } else {
        return 0;
    }
    
};


module.exports = gen;
module.exports.genWholeCCDA = genWholeCCDA;





