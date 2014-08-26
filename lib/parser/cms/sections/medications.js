var commonFunctions = require('./commonFunctions');

function parseMedications(sectionObj) {

    //setup templates for common function

    /*apply special functions to medications, take out the fields from original cms
  parser, store them in an intermediary object.*/

    //console.log(sectionObj);

    var result = [];
    var child;
    /*Ultimately, this code is for the sole purpose of rerunning medications
  code on allergies */
    var productKeys = ['drug name', 'comments'];
    for (var key in sectionObj) {
        child = sectionObj[key];
        var parsedObj = {};
        for (var x in productKeys) {
            var productKey = productKeys[x];
            if (productKey in child && child[productKey].length > 0) {
                var resultType = child[productKey].toLowerCase();
                var processedProduct = processProduct(child);
                if (processedProduct.date_time !== undefined) {
                    if (processedProduct.date_time) {
                        parsedObj.date_time = processedProduct.date_time;
                        delete processedProduct.date_time;
                    }

                }
                parsedObj.product = processedProduct;
                if (productKey === 'drug name') {
                    parsedObj.administration = processAdministration(child);
                    if (parsedObj.administration === undefined) {
                        delete parsedObj.administration;
                    }
                }
                var sigValue;
                if (child['orig drug entry']) {
                    sigValue = child['orig drug entry'];
                } else {
                    sigValue = child[productKey];
                }
                parsedObj.sig = sigValue;
                parsedObj.status = 'Completed'

                result.push(parsedObj);
            }
            /*be selective about what sections you want to pass into shared parser
       you don't want to pass a section with a blank entry for comments. */
            if (productKey in child && child[productKey].length <= 0) {
                delete sectionObj[key];
            }
        }
    }
    //extremely crare case when you DON'T want the corresponding field to be included
    return result;
}

function processProduct(childObj) {
    var productObj = {};
    var drugName;
    var parseCodedEntry = commonFunctions.getFunction(
        'cda_coded_entry');
    var dateArray = {};
    if ('drug name' in childObj) { //for drugs section
        var value = childObj['drug name'];
        var drugName = parseDrugName(value);

        codedDrugName = parseCodedEntry(drugName);
        //get medication type
        productObj.product = codedDrugName;
        productObj.unencoded_name = drugName;
    } else if ('comments' in childObj) { //for mediations section
        //do check to make sure comments has a drug
        drugName = parseCodedEntry(childObj.comments);
        productObj.product = drugName;
        productObj.unencoded_name = childObj.comments;
        if ('last treatment date' in childObj) {
            var value = childObj['last treatment date'];
            if (value.length !== 0) {
                var processDate = commonFunctions.getFunction('cda_date');
                dateArray = {
                    "point": processDate(value)
                };
            }
        }
    }

    //date_time object shouldn't be empty
    if (Object.keys(dateArray).length > 0) {
        productObj.date_time = dateArray;
    }

    return productObj;
}

function parseDrugName(drugName) {
    var drugNameArray = drugName.split(' ');
    var drugTypes = {
        'TAB': 'tabulet',
        'INJ': 'injection',
        'CAP': 'capsule'
    };
    var drugName = '';
    for (var x = 0; x < drugNameArray.length; x++) {
        var drugWord = drugNameArray[x];
        if (!(drugWord in drugTypes)) {
            drugName += drugWord;
            break;
        }
        drugName += ' ';
    }
    return drugName;
}

function processAdministration(childObj) {
    var adminObj = {};
    setRoute(adminObj, childObj);
    setForm(adminObj, childObj);
    setDose(adminObj, childObj);
    setRate(adminObj, childObj);
    var rate;
    if (Object.keys(adminObj).length > 0) {
        return adminObj;
    }
}

function setRoute(adminObj, childObj) {
    var routeTypes = {
        'TAB': 'oral',
        'INJ': 'injection',
        'CAP': 'oral'
    };
    var drugNameArray = childObj['drug name'].split(' ');
    for (var x = 0; x < drugNameArray.length; x++) {
        var word = drugNameArray[x];
        if ((word in routeTypes)) {
            var processFunction = commonFunctions.getFunction('cda_coded_entry');
            var route = routeTypes[word];
            adminObj.route = processFunction(route);
            break;
        }
    }
    //console.log(adminObj);
}

function setForm(adminObj, childObj) {
    var formTypes = {
        'TAB': 'tabulet',
        'INJ': 'injection',
        'CAP': 'capsule'
    };
    var drugNameArray = childObj['drug name'].split(' ');
    for (var x = 0; x < drugNameArray.length; x++) {
        var word = drugNameArray[x];
        if ((word in formTypes)) {
            var processFunction = commonFunctions.getFunction('cda_coded_entry');
            var form = formTypes[word];
            adminObj.form = processFunction(form);
            break;
        }
    }

}

function setDose(adminObj, childObj) {
    var formTypes = {
        'TAB': 'tabulet',
        'INJ': 'injection',
        'CAP': 'capsule'
    };
    var drugNameArray = childObj['drug name'].split(' ');
    for (var x = 0; x < drugNameArray.length; x++) {
        var word = drugNameArray[x];
        if ((word in formTypes)) {
            var processFunction = commonFunctions.getFunction('cda_physical_quantity');
            //check to make sure that the next number string doesn't exceed original string length
            if (x + 1 < drugNameArray.length) {
                var numberString = drugNameArray[x + 1];
                var index = 0;
                while (!isNaN(numberString.substr(0, index))) {
                    index++;
                }
                var number = Number(numberString.substr(0, index - 1));
                var unit = numberString.substr(index - 1, numberString.length);
                if (number > 0 && (unit !== undefined || unit.length > 0)) {
                    adminObj.dose = processFunction(number, unit);
                }
            }
            //adminObj.dose
            break;
        }
    }
}

function setRate(adminObj, childObj) {
    var rawRate = childObj.supply;
    if (rawRate.length > 0) {
        var index = 0;
        while (!isNaN(rawRate.substr(0, index))) {
            index++;
        }
        var number = Number(rawRate.substr(0, index - 1));

        var rawRateArray = rawRate.split(' ');
        var unit = '';
        for (var x = 0; x < rawRateArray.length; x++) {
            if (rawRateArray[x] == 'Month') {
                unit = rawRateArray[x - 1] + ' ' + rawRateArray[x];
            }
            var processFunction = commonFunctions.getFunction('cda_physical_quantity');
            if (number > 0 && (unit !== undefined || unit.length > 0)) {
                adminObj.rate = processFunction(number, unit);
            }
        }
    }

}

module.exports = parseMedications;
