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
var libCCDAGen = require("./lib/templating_functions.js");
var bbm = require('blue-button-meta');
var codeSystems = bbm.CCDA.codeSystems;  // maps code systems names to code system IDs

// Map section number to section name. 
var sectionNames = {
    0: "null",
    1: "demographics",
    2: "allergies",
    3: "encounters",
    4: "immunizations",
    5: "medications",
    6: "payers",
    7: "plan_of_care",
    8: "problems",
    9: "procedures",
    10: "results",
    11: "social_history",
    12: "vitals"
}

/*
Generates CCD-A from JSON data. 
@data is the data for a specific CCD section.
@CCD boolean parameteres indicating if it is an entire CCD or only individual section
@xmlDoc the previously generated CCDA/XML if generating an entire CCD
@section_name specifies the section template to call to generate the XML for that section
*/

var gen = function (data, CCD, xmlDoc, section_name) {
    if (data) {
        if (section_name == "demographics") {
            return require('./templates/demographics.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "allergies") {
            return require('./templates/allergies.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "encounters") {
            return require('./templates/encounters.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "immunizations") {
            return require('./templates/immunizations.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "medications") {
            return require('./templates/medications.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "payers") {
            return require('./templates/payers.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "plan_of_care") {
            return require('./templates/plan_of_care.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "problems") {
            return require('./templates/problems.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "procedures") {
            return require('./templates/procedures.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "results") {
            return require('./templates/results.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "social_history") {
            return require('./templates/social_history.js')(data, codeSystems, CCD, xmlDoc);
        } else if (section_name == "vitals") {
            return require('./templates/vitals.js')(data, codeSystems, CCD, xmlDoc);
        }
    } else {
        return xmlDoc;
    }
};

/*
Generates an entire CCD-A document. Uses gen() to string together the individual CCD-A sections. First, it generates
the CCD-A header, then iterates through all the section templates, stringing them 
together one after another.

@data the entire CCD-A JSON data to be converted to XML/CCDA
*/
var genWholeCCDA = function (data) {
    if (data.data != undefined) {
        data = data.data;
    }

    var doc = new libxmljs.Document();

    // generate the header 
    var xmlDoc = doc.node('ClinicalDocument')
            .attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
            .attr({xmlns: "urn:hl7-org:v3"})
            .attr({"xmlns:cda": "urn:hl7-org:v3"})
            .attr({"xmlns:sdtc": "urn:hl7-org:sdtc"})
        .node('realmCode').attr({code: "US"}).parent()
        .node('typeId')
            .attr({root: "2.16.840.1.113883.1.3"})
            .attr({extension: "POCD_HD000040"}).parent()
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
                .node('id').attr({extension: data["demographics"]["identifiers"][0]["extension"]})
                           .attr({root: data["demographics"]["identifiers"][0]["identifier"]}).parent()
                .node('id').attr({extension: data["demographics"]["identifiers"][1]["extension"]})
                           .attr({root: data["demographics"]["identifiers"][1]["identifier"]}).parent();

                // generate demographics section
                xmlDoc = gen(data[sectionNames[1]], true, xmlDoc, sectionNames[1]);
            xmlDoc = xmlDoc.parent() // end patientRole
        .parent() // end recordTarget
    
    // count the number of sections defined
    var count_sections = 0;
    for (sections in data) {
        if (sections != "demographics") {
            count_sections++;
        }
    }

    // if there are more sections than just demographics, then generate them
    if (count_sections > 0) {
        xmlDoc = xmlDoc.node('component')
            .node('structuredBody')
        // loop over all the sections and generate each one, adding them iteratively to each other
        for (var i = 2; i <= Object.keys(sectionNames).length; i++) {
            xmlDoc = gen(data[sectionNames[i]], true, xmlDoc, sectionNames[i]);
        }
    }
    xmlDoc = xmlDoc.parent() // end clinical document
    return doc.toString();
}

module.exports = gen;
module.exports.genWholeCCDA = genWholeCCDA;
