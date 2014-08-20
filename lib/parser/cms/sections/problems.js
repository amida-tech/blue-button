var commonFunctions = require('./commonFunctions');

function parseProblems(intObj) {

    //setup templates for common function
    var result = [];
    for (var key in intObj) {
        var obj = processProblemChild(intObj[key]);
        result.push(obj);
    }

    return result;
}

function processProblemChild(rawChildObj) {
    var childObj = {};
    var dateArray = {};
    for (var key in rawChildObj) {
        var value = rawChildObj[key];
        ignoreValue = commonFunctions.getFunction('ignore');
        if (ignoreValue(value)) {
            continue;
        } else if (key.indexOf('name') >= 0) {
            var processFunction = commonFunctions.getFunction('cda_coded_entry');
            var pr = childObj.problem = {};
            pr.code = processFunction(value);
        } else if (key.indexOf('start date') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            dateArray["low"] = processDate(value);
        } else if (key.indexOf('end date') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            dateArray["high"] = processDate(value);
        }
    }

    if (dateArray !== {}) {
        childObj.date_time = dateArray;
    }

    if (childObj.status === undefined) {
        childObj.status == 'resolved';
    }
    return childObj;
}

module.exports = parseProblems;
