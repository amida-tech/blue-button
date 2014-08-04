var commonFunctions = require('./commonFunctions');

function parseResults(sectionObj) {

    /*apply special functions to allergies, take out the fields from original cms
  parser, store them in an intermediary object.*/

    result = [];
    var child;
    var specialIndex = 0;
    //Ultimately, this section will be used to parse results into different sections
    for (var key in sectionObj) {
        var rawChild = sectionObj[key];
        var obj = processResultsChild(rawChild);
        result.push(obj);

    }

    //extremely crare case when you DON'T want the corresponding field to be included
    return result;
}

function processResultsChild(rawChild) {
    var returnChildObj = {};
    var resultArray = [];
    //apply special function for glucose first, don't loop through
    var resultKey = 'test/lab type';
    if (resultKey in rawChild) {
        var resultType = rawChild[resultKey].toLowerCase();
        if (resultType.indexOf('glucose') >= 0) {
            var resultObjs = processGlucoseLevels(rawChild);
            for (var key in resultObjs) {
                resultArray.push(resultObjs[key]);
            }
        } else if (resultType.indexOf('cbc') >= 0) {
            var resultObjs = processCBC(rawChild);
            for (var key in resultObjs) {
                resultArray.push(resultObjs[key]);
            }
        }
    }
    for (var key in rawChild) {
        key = key.toLowerCase();
        var value = rawChild[key];
        if (key.indexOf('test/lab type') >= 0) {
            var processFunction = commonFunctions.getFunction('cda_coded_entry');
            var obj = processFunction(value);
            returnChildObj.result_set = obj;
        }
    }
    if (resultArray.length > 0) {
        returnChildObj.results = resultArray;
    }

    return returnChildObj;
}

function processGlucoseLevels(childObj) {
    var resultArray = [];
    var glucoseLevels = childObj.results.split(',');
    var glucoseTypes = childObj.comments.split(',');
    var dateVal = childObj['date taken'];
    var parseDate = commonFunctions.getFunction('cda_date');
    var dateObj = parseDate(dateVal);
    var units = 'mg/dL'; //these are the default units
    for (var x in glucoseLevels) {
        var result = {};
        result.date_time = {
            "point": dateObj
        };
        //result.name = findGlucoseMeasurementName(glucoseTypes[x]);
        result.result = {
            "name": findGlucoseMeasurementName(glucoseTypes[x])
        };
        result.status = "completed";
        result.value = parseInt(glucoseLevels[x].trim());
        result.unit = units;
        result.status = 'completed';
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

function processCBC(childObj) {
    var resultArray = [];
    var typeToUnit = {
        HGB: "g/dl",
        WBC: "10+3/ul",
        PLT: "10+3/ul"
    };
    var measurements = childObj.results.split(',');
    var comments = childObj.comments.split(',');
    var dateVal = childObj['date taken'];
    var parseDate = commonFunctions.getFunction('cda_date');
    var parseCodedEntry = commonFunctions.getFunction('cda_coded_entry');
    var dateObj = parseDate(dateVal);
    var unit;
    for (var x in measurements) {
        var result = {};
        result.date_time = {
            "point": dateObj
        };
        var name = comments[x].trim();
        result.result = commonFunctions.getFunction('cda_coded_entry')(name);
        result.value = Number(measurements[x].trim());
        result.unit = typeToUnit[name];
        result.status = 'completed';
        resultArray.push(result);
    }
    return resultArray;

}

module.exports = parseResults;
