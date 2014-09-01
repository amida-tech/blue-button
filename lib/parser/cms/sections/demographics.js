var commonFunctions = require('./commonFunctions');

function parseDemographics(intObj) {

    var result = {};
    intObj = intObj[0];

    var phoneArray = [];

    var emailArray = [];

    var addressObj = {
        "use": "primary home",
        "street_lines": [],
        "city": "",
        "state": "",
        "zip": "",
        "country": "US"
    };

    var addressKeys = {
        'address type': 'use',
        'address line 1': 'street_lines',
        'address line 2': 'street_lines',
        'city': 'city',
        'state': 'state',
        'zip': 'zip'
    };

    for (key in intObj) {
        key = key.toLowerCase();
        value = intObj[key];
        //convert key to bbModel Key
        ignoreValue = commonFunctions.getFunction('ignore');
        if (ignoreValue(value)) {
            continue;
        } else if (key.indexOf('name') >= 0) {
            var processName = commonFunctions.getFunction('cda_name')
            result.name = processName(value);
        } else if (key.indexOf('date of birth') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            result.dob = {
                "point": processDate(value)
            };
        } else if (key.indexOf('phone') >= 0) {
            var processPhone = commonFunctions.getFunction('cda_phone');
            var phoneObj = processPhone(value);
            phoneArray.push(phoneObj);
        } else if (key.indexOf('email') >= 0) {
            var processEmail = commonFunctions.getFunction('cda_email');
            var emailObj = processEmail(value);
            emailArray.push(emailObj);
        } else if (key in addressKeys) {
            var value = intObj[key]; //value of the int obj
            if (value.length >= 1) {
                var bbModelKey = addressKeys[key];
                commonFunctions.writeValue(value, addressObj, bbModelKey);
            }
        } else {
            continue;
        }
    }

    if (emailArray.length > 0) {
        result.email = emailArray;
    }
    if (phoneArray.length > 0) {
        result.phone = phoneArray;
    }
    if (Object.keys(addressObj).length > 2) {
        result.addresses = [addressObj];
    }

    //this is to adhere to parser format at the caller
    return [result];
}

module.exports = parseDemographics;
