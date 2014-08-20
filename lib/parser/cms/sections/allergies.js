var commonFunctions = require('./commonFunctions');

function parseAllergies(sectionObj) {

    //setup templates for common function

    /*apply special functions to allergies, take out the fields from original cms
  parser, store them in an intermediary object.*/

    specialResult = {};
    result = [];
    var child;

    for (var key in sectionObj) {
        var obj = parseAllergyChild(sectionObj[key]);
        result.push(obj);
    }
    return result;
}

function parseAllergyChild(rawChildObj) {

    var returnChildObj = {
        "observation": {}
    };
    var dateArray = {};
    for (var key in rawChildObj) {
        key = key.toLowerCase();
        var value = rawChildObj[key];
        if (key.indexOf('first episode date') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            var date = processDate(value);
            dateArray.low = date;
        } else if (key.indexOf('last episode date') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            var date = processDate(value);
            dateArray.high = date;
        } else if (key.indexOf('allergy') >= 0) {
            var processAllergen = commonFunctions.getFunction('cda_coded_entry');
            var allergen = processAllergen(value);
            returnChildObj["observation"].allergen = allergen;
        }
    }

    if (Object.keys(dateArray).length > 0) {
        returnChildObj["observation"].date_time = dateArray;
    }

    reactions = processReactions(rawChildObj);
    returnChildObj["observation"].reactions = [reactions];

    if (returnChildObj["observation"].status === undefined) {
        returnChildObj["observation"].status = {
            "name": "Active",
            "code": "55561003",
            "code_system_name": "SNOMED CT"
        };
    }
    return returnChildObj;

}

function processReactions(childObj) {
    var reactionObj = {};

    /*on the assumption that cms does use these quantifiers. so far, only severe
    has been seen in the sample file */

    // from http://schemes.caregraf.info/snomed
    var severityDict = {
        "Fatal": {
            "code": "399166001",
            "name": "Fatal",
            "code_system_name": "SNOMED CT"
        },
        "life threatening severity": {
            "code": "442452003",
            "name": "Life threatening severity",
            "code_system_name": "SNOMED CT"
        },
        "mild": {
            "code": "255604002",
            "name": "Mild",
            "code_system_name": "SNOMED CT"
        },
        "mild to moderate": {
            "code": "371923003",
            "name": "Mild to moderate",
            "code_system_name": "SNOMED CT"
        },
        "moderate": {
            "code": "6736007",
            "name": "Moderate",
            "code_system_name": "SNOMED CT"
        },
        "moderate to severe": {
            "code": "371924009",
            "name": "Moderate to severe",
            "code_system_name": "SNOMED CT"
        },
        "severe": {
            "code": "24484000",
            "name": "Severe",
            "code_system_name": "SNOMED CT"
        }
    };

    var parseCodedEntry = commonFunctions.getFunction(
        'cda_coded_entry');
    //need to add in codes and stuff later.
    if ('reaction' in childObj) {
        var reactionName = childObj.reaction;
        reactionObj.reaction = parseCodedEntry(reactionName);
        delete childObj.reaction;
    }
    if ('severity' in childObj) {

        var severityVal = childObj['severity'].toLowerCase();

        if (severityVal in severityDict) {
            reactionObj.severity = {};
            reactionObj.severity.code = severityDict[severityVal];
        } else {
            reactionObj.severity = {};
            reactionObj.severity.code = parseCodedEntry(severityVal);
        }
        delete childObj.severity;

    }

    return reactionObj;
}

module.exports = parseAllergies;
