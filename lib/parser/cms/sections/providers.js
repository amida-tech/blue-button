var commonFunctions = require('./commonFunctions');

function parseProviders(intObj) {

    //setup templates for common function
    var result = [];
    for (var key in intObj) {
        var obj = processProviderChild(intObj[key]);
        result.push(obj);
    }

    return result;
}

function processProviderChild(rawChildObj) {
    var childObj = {};
    var dateArray = {};
    for (var key in rawChildObj) {
        var value = rawChildObj[key];

        ignoreValue = commonFunctions.getFunction('ignore');
        if (ignoreValue(value)) {
            continue;
        }
        /* need to be able to discern between individuals vs organization
        health care provider */
        else if (key.indexOf('provider name') >= 0) {
            childObj.name = value;
        } else if (key.indexOf('provider address') >= 0) {
            //this is temporary for now, we need a smart address parser later
            //there definitely needs to be a better address parser, taking into account:
            // 1. comma separated addresses.(whether it be one or two)
            // 2. No comma separated addresses.
            childObj.address = commonFunctions.getFunction('cda_line_address')(value);
        } else if (key.indexOf('type') >= 0) {
            childObj.type = commonFunctions.getFunction('cda_coded_entry')(value);
        }
        //this field, I am not sure where this goes.
        else if (key.indexOf('specialty') >= 0) {

            /*means that this field is defined, then the provider is a person, so
            transform the original name field into a person object, populate the
            cda_name field and delete the generic name field in the top level
            */
            childObj.name = commonFunctions.getFunction('cda_name')(childObj.name);
            childObj.ind_flag = true;
        }

        /*this needs to be worked on, because there could be no samples that had
        this field populated. */
        else if (key.indexOf('medicare provider') >= 0) {
            var organization = {};
            organization.name = value;
            childObj.organization = organization;
        }
    }

    if (!childObj.ind_flag) {

        childObj.organization = {};
        childObj.organization.name = new Array(childObj.name);
        delete childObj.name;

    } else {
        delete childObj.ind_flag;
    }

    if (Object.keys(dateArray).length > 0) {
        childObj.date_time = dateArray;
    }
    return childObj;
}

module.exports = parseProviders;
