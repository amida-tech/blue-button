var commonFunctions = require('./commonFunctions');
var _ = require('underscore');

function parseInsurance(intObj, sectionType) {
    var result = [];
    var resultChild;
    for (var x in intObj) {
        var child = intObj[x];
        if (sectionType.indexOf('plans') >= 0) {
            resultChild = processMedicarePlanChild(child);
            result.push(resultChild);
        } else if (sectionType.indexOf('employer subsidy') >= 0) {
            resultChild = processEmployerChild(child);
            result.push(resultChild);
        } else if (sectionType.indexOf('primary insurance') >= 0) {
            resultChild = processInsuranceChild(child);
            result.push(resultChild);
        } else if (sectionType.indexOf('other insurance') >= 0) {
            resultChild = processInsuranceChild(child);
            result.push(resultChild);
        }
    }
    return result;
}

//this is for medicare plans
function processMedicarePlanChild(childObj) {
    var returnChildObj = {};
    var addressArray = [];
    var dateArray = {};
    var emailArray = [];
    var phoneArray = [];
    var typeArray = [];
    typeArray.push('medicare');

    var tmpInsurerData = {};
    for (var key in childObj) {

        var key = key.toLowerCase();
        var value = childObj[key];

        ignoreValue = commonFunctions.getFunction('ignore');
        if (ignoreValue(value)) {
            continue;
        }
        if (key.indexOf('plan id') >= 0) {
            var processId = commonFunctions.getFunction('cda_id');

            //Plan identifier goes into participant > performer > identifiers, for covered individual.
            //Also goes into policy_holder > performer > identifiers, for subscriber id.
            //Presumed covered and subscriber are same (both mandatory per spec.)

            if (_.isUndefined(returnChildObj.participant)) {
                returnChildObj.participant = {};
                returnChildObj.participant.performer = {};
                returnChildObj.participant.performer.identifiers = [];
            }

            if (_.isUndefined(returnChildObj.policy_holder)) {
                returnChildObj.policy_holder = {};
                returnChildObj.policy_holder.performer = {};
                returnChildObj.policy_holder.performer.identifiers = [];
            }

            returnChildObj.participant.performer.identifiers.push(processId(value));
            returnChildObj.policy_holder.performer.identifiers.push(processId(value));

        } else if (key.indexOf('plan name') >= 0) {

            if (_.isUndefined(tmpInsurerData["name"])) {
                tmpInsurerData["name"] = [];
            }
            tmpInsurerData["name"].push(value);

        } else if (key.indexOf('plan period') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            var valueArray = value.split('-');
            dateArray["low"] = processDate(valueArray[0].trim());
            if (valueArray[1].indexOf('current') < 0) {
                dateArray["high"] = processDate(valueArray[1].trim());
            }

            //returnChildObj.plan_id = processId(value);
        } else if (key.indexOf('marketing name') >= 0) {

            if (_.isUndefined(tmpInsurerData.name)) {
                tmpInsurerData.name = [];
            }
            tmpInsurerData.name.push(value);

        } else if (key.indexOf('plan address') >= 0) {
            var processAddress = commonFunctions.getFunction('cda_line_address');

            if (_.isUndefined(tmpInsurerData.address)) {
                tmpInsurerData.address = [];
            }
            tmpInsurerData.address.push(processAddress(value));

            //addressArray.push(processAddress(value));
        }
        //not present in sample text file, but real files have it.
        else if (key.indexOf('email') >= 0) {
            var processEmail = commonFunctions.getFunction('cda_email');

            if (_.isUndefined(tmpInsurerData.email)) {
                tmpInsurerData.email = [];
            }
            tmpInsurerData.email.push(processEmail(value));

            //var emailObj = processEmail(value);
            //emailArray.push(emailObj);
        } else if (key.indexOf('phone') >= 0) {
            var processPhone = commonFunctions.getFunction('cda_phone');
            if (_.isUndefined(tmpInsurerData.phone)) {
                tmpInsurerData.phone = [];
            }
            tmpInsurerData.phone.push(processPhone(value));

            //var phoneObj = processPhone(value);
            //phoneArray.push(phoneObj);
        } else if (key.indexOf('plan type') >= 0) {

            if (_.isUndefined(tmpInsurerData.name)) {
                tmpInsurerData.name = [];
            }
            tmpInsurerData.name.push(value);
        }

    }

    //Plan details go into policy > insurance > performer > organization[0].

    if (_.isUndefined(returnChildObj.policy)) {
        returnChildObj.policy = {};
        returnChildObj.policy.insurance = {};
        returnChildObj.policy.insurance.performer = {};
        returnChildObj.policy.insurance.performer.organization = [];
    }

    returnChildObj.policy.insurance.performer.organization.push(tmpInsurerData);

    if (dateArray != {}) {

        if (_.isUndefined(returnChildObj.participant)) {
            returnChildObj.participant = {};
        }
        returnChildObj.participant.date_time = dateArray;
    }

    return returnChildObj;
}

function processEmployerChild(childObj) {
        var returnChildObj = {};
        var typeArray = [];
        var dateArray = {};
        var tmpInsurerData = {};

        typeArray.push('employer subsidy');
        for (var key in childObj) {
            key = key.toLowerCase();
            value = childObj[key];
            ignoreValue = commonFunctions.getFunction('ignore');
            if (ignoreValue(value)) {
                continue;
            }
            if (key.indexOf('employer plan') >= 0) {

                if (_.isUndefined(tmpInsurerData.name)) {
                    tmpInsurerData.name = [];
                }
                tmpInsurerData.name.push(value);

            } else if (key.indexOf('start date') >= 0) {
                var processDate = commonFunctions.getFunction('cda_date');
                dateArray["low"] = processDate(value);
            } else if (key.indexOf('end date') >= 0) {
                var processDate = commonFunctions.getFunction('cda_date');
                dateArray["high"] = processDate(value);
            }
        }

        if (_.isUndefined(tmpInsurerData.name)) {
            tmpInsurerData.name = [];
        }
        tmpInsurerData.name.push('EMPLOYER SUBSIDY');

        if (_.isUndefined(returnChildObj.policy)) {
            returnChildObj.policy = {};
            returnChildObj.policy.insurance = {};
            returnChildObj.policy.insurance.performer = {};
            returnChildObj.policy.insurance.performer.organization = [];
        }

        returnChildObj.policy.insurance.performer.organization.push(tmpInsurerData);

        if (dateArray != {}) {
            if (_.isUndefined(returnChildObj.participant)) {
                returnChildObj.participant = {};
            }
            returnChildObj.participant.date_time = dateArray;
        }

        return returnChildObj;

    }
    //generic insurance plan, for primary insurance and other insurance
function processInsuranceChild(childObj) {
    var returnChildObj = {};
    var dateArray = {};
    var emailArray = [];
    var phoneArray = [];
    var typeArray = [];
    var addressArray = [];
    var tmpInsurerData = {};

    for (var key in childObj) {
        var key = key.toLowerCase();
        var value = childObj[key];
        ignoreValue = commonFunctions.getFunction('ignore');
        if (ignoreValue(value)) {
            continue;
        }
        if (key.indexOf('msp type') >= 0 && value.length > 0) {
            typeArray.push('Medicare MSP: ' + value);
        } else if (key.indexOf('msp type') >= 0) {
            typeArray.push('Medicare MSP');
        } else if (key.indexOf('policy number') >= 0) {

            var processId = commonFunctions.getFunction('cda_id');

            //Plan identifier goes into participant > performer > identifiers, for covered individual.
            //Also goes into policy_holder > performer > identifiers, for subscriber id.
            //Presumed covered and subscriber are same (both mandatory per spec.)

            if (_.isUndefined(returnChildObj.participant)) {
                returnChildObj.participant = {};
                returnChildObj.participant.performer = {};
                returnChildObj.participant.performer.identifiers = [];
            }

            if (_.isUndefined(returnChildObj.policy_holder)) {
                returnChildObj.policy_holder = {};
                returnChildObj.policy_holder.performer = {};
                returnChildObj.policy_holder.performer.identifiers = [];
            }

            returnChildObj.participant.performer.identifiers.push(processId(value));
            returnChildObj.policy_holder.performer.identifiers.push(processId(value));

        } else if (key.indexOf('insurer name') >= 0) {

            if (_.isUndefined(tmpInsurerData["name"])) {
                tmpInsurerData["name"] = [];
            }
            tmpInsurerData["name"].push(value);

        } else if (key.indexOf('insurer address') >= 0) {
            var processAddress = commonFunctions.getFunction('cda_line_address');

            if (_.isUndefined(tmpInsurerData.address)) {
                tmpInsurerData.address = [];
            }
            tmpInsurerData.address.push(processAddress(value));
        } else if (key.indexOf('effective date') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            dateArray["low"] = processDate(value);
        } else if (key.indexOf('termination date') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            dateArray["high"] = processDate(value);
        }
        //not present in sample text file, but files probably have it.
        else if (key.indexOf('email') >= 0) {
            var processEmail = commonFunctions.getFunction('cda_email');

            if (_.isUndefined(tmpInsurerData.email)) {
                tmpInsurerData.email = [];
            }
            tmpInsurerData.email.push(processEmail(value));

        } else if (key.indexOf('phone') >= 0) {
            var processPhone = commonFunctions.getFunction('cda_phone');
            if (_.isUndefined(tmpInsurerData.phone)) {
                tmpInsurerData.phone = [];
            }
            tmpInsurerData.phone.push(processPhone(value));
        }
    }

    if (_.isUndefined(tmpInsurerData.name)) {
        tmpInsurerData.name = [];
    }
    tmpInsurerData.name = _.union(tmpInsurerData.name, typeArray);

    if (dateArray != {}) {
        if (_.isUndefined(returnChildObj.participant)) {
            returnChildObj.participant = {};
        }
        returnChildObj.participant.date_time = dateArray;
    }

    if (_.isUndefined(returnChildObj.policy)) {
        returnChildObj.policy = {};
        returnChildObj.policy.insurance = {};
        returnChildObj.policy.insurance.performer = {};
        returnChildObj.policy.insurance.performer.organization = [];
    }

    returnChildObj.policy.insurance.performer.organization.push(tmpInsurerData);

    return returnChildObj;
}

module.exports = parseInsurance;
