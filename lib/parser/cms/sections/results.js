var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;


function parseResults(sectionObj) {

    //setup templates for common function
    sharedParser.modelTemplate = getJSON('/Models/results.json');
    sharedParser.sectionUnfoundKeys = getJSON('/unfoundKeyDict/resultsDict.json');
    sharedParser.commonModelUnfoundKeys = getJSON('/unfoundKeyDict/commonModelDict.json');
    sharedParser.commonModels = getJSON('/Models/commonModels.json');
    sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
    sharedParser.defaultValues = getJSON('/Models/defaultValues.json');


    sharedParser.setup();

    /*apply special functions to allergies, take out the fields from original cms
  parser, store them in an intermediary object.*/

    specialResult = {};
    var child;
    var specialIndex = 0;
    //Ultimately, this section will be used to parse results into different sections
    for (var key in sectionObj) {
        child = sectionObj[key];
        var childObj = {};
        var resultKey = 'test/lab type';
        if (resultKey in child) {
            var resultType = child[resultKey].toLowerCase();
            if (resultType.indexOf('glucose') >= 0) {
                childObj.results = processGlucoseLevels(child);
                specialResult[specialIndex] = childObj;
                specialIndex++;
            }
        }
    }
    var result = sharedParser.parseSection(sectionObj);

    //combine the two results together

    for (var rKey in result) {
        child = result[rKey];
        if (Object.keys(child).length === 0) {
            result.splice(rKey, 1);
        }
        var specialChild = specialResult[rKey];
        for (var item in specialChild) {
            child[item] = specialChild[item];
        }
    }

    //delete result['source'];
    //extremely crare case when you DON'T want the corresponding field to be included
    return result;
}



function processGlucoseLevels(childObj) {
    var resultArray = [];
    var glucoseLevels = childObj.results.split(',');
    var glucoseTypes = childObj.comments.split(',');
    var dateVal = childObj['date taken'];
    var parseDate = commonModelFunctionRouter.getCommonModelFunction('cda_date', 'special');
    var dateObj = parseDate(dateVal, 'day');
    var units = 'mg/dL'; //these are the default units
    for (var x in glucoseLevels) {
        var result = {};
        result.date = dateObj;
        result.name = findGlucoseMeasurementName(glucoseTypes[x]);
        result.value = glucoseLevels[x].trim();
        result.unit = units;
        resultArray.push(result);
    }

    return resultArray;
}

function findGlucoseMeasurementName(comment) {

    //you should load up the keys and values locally, for now we hardcode for example
    var defaultName = 'RBS';
    var commentToResultName = {
        'Fasting': 'FBS'
    };
    if (comment in commentToResultName) {
        return commentToResultName[comment];
    } else {
        return defaultName;
    }
}






module.exports = parseResults;
