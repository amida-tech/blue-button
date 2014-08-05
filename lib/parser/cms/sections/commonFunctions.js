//these are common models that must be hardcoded...
//might want to modify later so that HERE it also takes in custom default values.

//later on, this functions might become MUCH more complicated, because
//cities are not necessarily one word entries

var commonFunctions = function commonFunctions() {
    functions = {
        'cda_name': cda_name,
        'cda_concept': cda_concept,
        'cda_id': cda_id,
        'cda_date': cda_date,
        'cda_coded_entry': cda_coded_entry,
        'cda_phone': cda_phone,
        'cda_email': cda_email,
        'cda_line_address': cda_line_address,
        'cda_physical_quantity': cda_physical_quantity,
        'currency': formatCurrency,
        'ignore': ignoreValue
    };
    this.writeValue = writeValue;
    this.getFunction = getFunction;
    this.getValueType = getValueType;
};

function cda_line_address(addressString) {
    var addressObj = {
        "use": "primary",
        "streetLines": [],
        "city": "",
        "state": "",
        "zip": "",
        "country": "United States"
    };
    var addressArray = addressString.trim().split(',');

    /*case when there is only one comma, right after the city */
    if (addressArray.length === 2) {
        var streetAndCity = addressArray[0].trim();
        var stateAndZip = addressArray[1].trim();

        /*this part needs to be changed, since city names can be more than two
        words */
        var street = streetAndCity.substring(0, streetAndCity.lastIndexOf(' '));
        var city = streetAndCity.substring(streetAndCity.lastIndexOf(' ') + 1, streetAndCity.length);

        //this part is fine for now.
        stateAndZip = stateAndZip.split(' ');
        var state = stateAndZip[0];
        var zip = stateAndZip[1];
        addressObj.streetLines.push(street);
        addressObj.city = city;
        addressObj.state = state;
        addressObj.zip = zip;
        return addressObj;
    } else if (addressArray.length === 3) {
        addressObj.streetLines[0] = addressArray[0].trim();
        addressObj.city = addressArray[1].trim();
        var stateAndZip = addressArray[2].trim().split(' ');
        addressObj.state = stateAndZip[0];
        addressObj.zip = stateAndZip[1];
        return addressObj;

    }

    return null;
}

function cda_phone(numberString, type) {
    var phoneObj = {};
    phoneObj.number = numberString;
    if (arguments.length > 1) {
        phoneObj.type = type;
    } else {
        phoneObj.type = 'primary';
    }
    return phoneObj;
}

function cda_email(emailString, type) {
    var emailObj = {};
    emailObj.address = emailString;
    if (arguments.length > 1) {
        emailObj.type = type;
    } else {
        emailObj.type = 'primary';
    }
    return emailObj;
}

function cda_concept() {}

function cda_id(id, idType) {
    var obj = {};
    obj.identifier = id;
    return obj;
}

function cda_date(dateString, precision) {
    var dateObj;
    var date;
    var dateNum;
    if (arguments.length == 2) {
        dateObj = {};
        date = new Date(dateString);
        dateNum = date.getTime() - date.getTimezoneOffset() * 60000;
        date.setTime(dateNum);
        //TODO: don't need milliseconds precision here
        dateObj.date = date.toISOString();
        dateObj.precision = precision;
        return dateObj;
    } else {
        dateObj = {};
        date = new Date(dateString);
        dateNum = date.getTime() - date.getTimezoneOffset() * 60000;
        date.setTime(dateNum);
        dateObj.date = date.toISOString();
        dateObj.precision = determineDatePrecision(dateString);
        return dateObj;
    }

}

function cda_physical_quantity(value, unit) {
    var obj = {};
    obj.value = value;
    obj.unit = unit;
    return obj;
}

function determineDatePrecision(dateString) {

    //think about it when it's only a year
    var date;
    var yearMonthDay = dateString.substr(0, dateString.indexOf(' ')); // '72'
    var hourMinutes = dateString.substr(dateString.indexOf(' ') + 1);
    hourMinutes = hourMinutes.trim();
    //start from the order the hour
    //time is not defined
    if (hourMinutes !== undefined && dateString.indexOf(' ') >= 0) {
        //determine month, day, etc
        //splits to hh:mm, (A.M. or P.M.)
        date = new Date(dateString);

        var minutes = date.getMinutes();
        if (minutes > 0) {
            return 'minute';
        } else if (minutes === 0) {
            return 'hour';
        }
        return 'hour';
    } else {
        var yearMonthDayArray = dateString.split('/');
        if (yearMonthDayArray.length === 3) {
            return 'day';
        }
        if (yearMonthDayArray.length === 2) {
            return 'month';
        }
        if (yearMonthDayArray.length === 1) {
            return 'year';
        }
    }
    //if all those cases don't hold, then it's likely that it's a year.
    return 'year';
}

/* Not in use at the moment, may be useful later.
function processMoney(moneyString){

    moneyString = moneyString.trim();
    if(moneyString.indexOf('$') >=0){
        moneyString = moneyString.substring(moneyString.indexOf('$') + 1, moneyString.length);
        console.log(moneyString);
    }
    var dollarAmt = new Number(moneyString);
    console.log(dollarAmt);
    return dollarAmt;
}
*/

function cda_name(name) {
    //this needs to be edited later to include prefixes
    var cdaNameObj = {};
    var nameArray = name.split(" ");
    if (nameArray.length == 2) {
        cdaNameObj.first = nameArray[0];
        cdaNameObj.last = nameArray[1];
    } else if (nameArray.length > 2) {
        cdaNameObj.first = nameArray[0];
        var middleNameArr = [];
        for (var x = 1; x < nameArray.length - 1; x++) {
            middleNameArr.push(nameArray[x]);
        }
        cdaNameObj.middle = middleNameArr;
        cdaNameObj.last = nameArray[nameArray.length - 1];
    }
    return cdaNameObj;
}

function cda_coded_entry(name, code, codeSystem) {
    var cdaCodedEntry = {};

    if (typeof name === 'string' || name instanceof String) {
        if (name.length > 0) {
            cdaCodedEntry.name = name;
        }
    }
    if (typeof codeSystem === 'string' || codeSystem instanceof String) {
        if (codeSystem.length > 0) {
            cdaCodedEntry.codeSystem = codeSystem;
        }
    }
    if (typeof code === 'string' || code instanceof String) {
        if (code.length > 0) {
            cdaCodedEntry.code = code;
        }
    }

    return cdaCodedEntry;
}

function getValueType(objValue) {
    if (objValue instanceof Array) {
        return [];
    } else if (typeof (objValue) == 'string') {
        if (objValue.charAt(0) == '[') {
            return [];
        }
        if (objValue.charAt(0) == "{") {
            return {};
        }
    } else if (typeof (objValue) === 'object' && objValue instanceof Array)
        return {};
}

function writeValue(value, obj, key) {
    var objValue = obj[key];
    if (objValue instanceof Array) {
        objValue.push(value);
    } else if (typeof (objValue) == 'string') {
        obj[key] = value;
    } else if (typeof (objValue) === 'object' && objValue instanceof Array)
        obj[key] = value;
}
//this function ignores all not avaliable value fields
function ignoreValue(value) {
    if (value === null || value === undefined || value.length === 0) {
        return true;
    }
    if (value.length === 0) {
        return true;
    }
    if (typeof (value) === 'object') {
        return false;
    }
    value = value.toLowerCase();
    var ignoreValues = ['not available', 'no information'];
    for (var x = 0; x < ignoreValues.length; x++) {
        if (value.indexOf(ignoreValues[x]) >= 0) {
            return true;
        }
    }
    return false;
}

function getFunction(commonModelName) {
    if (commonModelName in functions) {
        if (functions[commonModelName] !== null) {
            return functions[commonModelName];
        }
    }
    return null;
}

//will be implemented later
function formatCurrency(currencyString) {}

commonFunctions.instance = null;

commonFunctions.getInstance = function () {
    if (this.instance === null) {
        this.instance = new commonFunctions();
    }
    return this.instance;
}

module.exports = commonFunctions.getInstance();
