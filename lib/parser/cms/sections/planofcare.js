var commonFunctions = require('./commonFunctions');

function parsePlanOfCare(intObj) {

    //setup templates for common function
    var result = [];
    for (var key in intObj) {
        var obj = processPlanOfCareChild(intObj[key]);
        result.push(obj);
    }

    return result;
}

function processPlanOfCareChild(rawChildObj) {
    var childObj = {};
    var dateArray = {};
    for (var key in rawChildObj) {
        var value = rawChildObj[key];
        ignoreValue = commonFunctions.getFunction('ignore');
        if (ignoreValue(value)) {
            continue;
        } else if (key.indexOf('description') >= 0) {
            var processFunction = commonFunctions.getFunction('cda_coded_entry');
            childObj.plan = processFunction(value);
        } else if (key.indexOf('next eligible date') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            dateArray["low"] = processDate(value);
        } else if (key.indexOf('last date of service') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            dateArray["high"] = processDate(value);
        }
    }

    childObj.type = 'medicare';

    if (dateArray !== {}) {
        childObj.date_time = dateArray;
    }
    return childObj;
}

module.exports = parsePlanOfCare;
