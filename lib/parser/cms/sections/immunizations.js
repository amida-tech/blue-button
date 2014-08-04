var commonFunctions = require('./commonFunctions');

function parseImmunizations(sectionObj) {

    //Again, there's no need to use the shared parser, because immunizations is too
    //specific
    /*apply special functions to medications, take out the fields from original cms
  parser, store them in an intermediary object.*/
    var specialResult = {};
    var specialIndex = 0;
    var result = [];
    //combine the two results together
    for (var x in sectionObj) {
        var child = sectionObj[x];
        if (Object.keys(child).length > 1) { //get the dates for each object
            var dates = getDates(child);
            var immObj = {};
            for (var dateKey in dates) {
                immObj = getImmunObj(child, dateKey, dates[dateKey]);
                result.push(immObj);
            }
        }
    }
    return result;
}

function getImmunObj(child, dateKey, dateObj) {
    var returnObj = {};
    var dateArray = {};
    var administration = getAdministration(child);
    var immunName = child['immunization name'];
    var product = getProduct(immunName, dateKey);
    if (dateObj !== undefined) {
        dateArray["point"] = dateObj;
        returnObj.status = 'complete';
    }
    if (administration !== undefined) {
        returnObj.administration = administration;
    }
    if (product !== undefined) {
        returnObj.product = product;
    }
    if (dateArray != {}) {
        returnObj.date_time = dateArray;
    }
    return returnObj;
}

function getAdministration(child) {
    var adminObj = {};
    var parseCodedEntry = commonFunctions.getFunction(
        'cda_coded_entry');

    if ('method' in child) {
        var name = child.method;
        adminObj.route = parseCodedEntry(name);
    }
    return adminObj;
}

function getProduct(immunName, dateKey) {
    var productObj = {};
    var parseCodedEntry = commonFunctions.getFunction(
        'cda_coded_entry');
    if (dateKey.toLowerCase().indexOf('booster') >= 0) {
        name = immunName + " (" + dateKey + ")";
    } else {
        name = immunName;
    }
    productObj.product = parseCodedEntry(name);
    return productObj;
}

function getDates(child) {
    var dateObj;
    var returnObj = {};
    var parseDate = commonFunctions.getFunction('cda_date');
    if ('date administered' in child) {
        dateObj = parseDate(child['date administered']);
        if (dateObj !== undefined) {
            returnObj.administered = dateObj;
        }
    }
    var boosterNum = 1;
    for (var key in child) {
        if (key.toLowerCase().indexOf('booster') >= 0 && child[key].length > 0) {
            dateObj = parseDate(child[key]);
            var boosterKey = 'booster ' + boosterNum;
            returnObj[boosterKey] = dateObj;
            boosterNum++;
        }
    }
    return returnObj;
}

module.exports = parseImmunizations;
