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

    var returnChildObj = {};
    var dateArray = [];
    for (var key in rawChildObj) {
        key = key.toLowerCase();
        var value = rawChildObj[key];
        if (key.indexOf('date') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            var date = processDate(value);
            dateArray.push(date);
        } else if (key.indexOf('allergy') >= 0) {
            var processAllergen = commonFunctions.getFunction('cda_coded_entry');
            var allergen = processAllergen(value);
            returnChildObj.allergen = allergen;
        }
    }

    if (dateArray.length > 0) {
        returnChildObj.date = dateArray;
    }

    reactions = processReactions(rawChildObj);
    returnChildObj.reactions = reactions;

    if (returnChildObj.status === undefined) {
        returnChildObj.status == 'Active';
    }
    return returnChildObj;

}

function processReactions(childObj) {
    var reactionObj = {};
    var parseCodedEntry = commonFunctions.getFunction(
        'cda_coded_entry');
    //need to add in codes and stuff later.
    if ('reaction' in childObj) {
        var reactionName = childObj.reaction;
        reactionObj.reaction = parseCodedEntry(reactionName);
        delete childObj.reaction;
    }
    if ('severity' in childObj) {
        reactionObj.severity = childObj.severity;
        delete childObj.severity;
    }
    return reactionObj;
}

module.exports = parseAllergies;
