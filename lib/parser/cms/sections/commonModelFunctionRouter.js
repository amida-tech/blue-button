//these are common models that must be hardcoded...
//might want to modify later so that HERE it also takes in custom default values.


var sections = {
    'cda_name': cda_name,
    'cda_concept': cda_concept,
    'cda_id': cda_id,
    'cda_coded_entry': cda_coded_entry
};
var special = {
    'cda_name': cda_name,
    'cda_concept': cda_concept,
    'cda_id': cda_id,
    'cda_date': cda_date,
    'cda_coded_entry': cda_coded_entry,
    'cda_phone': cda_phone,
    'cda_email': cda_email
};


function cda_phone(numberString, type) {
    var phoneObj = {};
    phoneObj.number = numberString;
    if(arguments.length > 1){
        phoneObj.type = type;
    }
    else{
        phoneObj.type = 'primary';
    }
    return phoneObj;
}

function cda_email(emailString, type) {
    var emailObj = {};
    emailObj.address = emailString;
    if(arguments.length > 1){
        emailObj.type = type;
    }
    else{
        emailObj.type = 'primary';
    }
    return emailObj;
}

function cda_concept() {}

function cda_id() {}


function cda_date(dateString, time, precision) {
    var dateObj;
    var date;
    if (arguments.length == 3) { //this means that both the date and time were specified
        dateObj = {};
        date = new Date(dateString, time);
        var iso = date.toISOString();
        dateObj.date = date.toISOString();
        dateObj.precision = precision;
        return dateObj;
    } else {
        dateObj = {};
        date = new Date(dateString);
        dateObj.date = date.toISOString();
        dateObj.precision = precision;
        return dateObj;
    }

}


function cda_name(name) {
    //this needs to be edited later to include prefixes
    var cdaNameObj = {};
    var nameArray = name.split(" ");
    if (nameArray.length == 2) {
        cdaNameObj.first = nameArray[0];
        cdaNameObj.last = nameArray[1];
    } else if (nameArray.length == 3) {
        cdaNameObj.first = nameArray[0];
        cdaNameObj.middle = nameArray[1];
        cdaNameObj.last = nameArray[2];
    }
    return cdaNameObj;
}


function cda_coded_entry(name, code, codeSystem) {
    var cdaCodedEntry = {};
    cdaCodedEntry.name = name;
    if (code !== undefined) {
        cdaCodedEntry.code = code;
    }
    if (codeSystem !== undefined) {
        cdaCodedEntry.codeSystem = codeSystem;
    }
    return cdaCodedEntry;
}

function getValueType(objValue) {
    if (objValue instanceof Array) {
        return [];
    } else if (typeof(objValue) == 'string') {
        if (objValue.charAt(0) == '[') {
            return [];
        }
        if (objValue.charAt(0) == "{") {
            return {};
        }
    } else if (typeof(objValue) === 'object' && objValue instanceof Array)
        return {};
}

function writeValue(value, obj, key){
    var objValue = obj[key];
    if (objValue instanceof Array) {
        objValue.push(value);
    } else if (typeof(objValue) == 'string') {
        obj[key] = value;
    } else if (typeof(objValue) === 'object' && objValue instanceof Array)
        obj[key] = value;
}



//gets a common model function if it's defined in the section
var getCommonModelFunction = function(commonModelName, type) {

    //sectionName = keyMap[sectionName];
    if (commonModelName in sections && arguments[1] === undefined) {
        if (sections[commonModelName] !== null) {
            return sections[commonModelName];
        }
    } else if (type == 'special') {
        return special[commonModelName];
    } else {
        return null;
    }
};

var getFunction = function(commonModelName) {
    if (commonModelName in special) {
        if (special[commonModelName] !== null) {
            return special[commonModelName];
        }
    }
    return null;
};

module.exports.getCommonModelFunction = getCommonModelFunction;
module.exports.sections = sections;
module.exports.writeValue = writeValue;
module.exports.getFunction = getFunction;
module.exports.getValueType = getValueType;
