var commonFunctions = require('./commonFunctions');



function parseInsurance(intObj, sectionType) {
    var result = [];
    var resultChild;
    for(var x in intObj){
        var child = intObj[x];
        if(sectionType.indexOf('plans') >= 0){
            resultChild = processMedicarePlanChild(child);
            result.push(resultChild);
        }
        else if(sectionType.indexOf('employer subsidy') >= 0){
            resultChild = processEmployerChild(child);
            result.push(resultChild);
        }

        else if(sectionType.indexOf('primary insurance') >= 0){
            resultChild = processInsuranceChild(child);
            result.push(resultChild);
        }

        else if(sectionType.indexOf('other insurance') >= 0){
            resultChild = processInsuranceChild(child);
            result.push(resultChild);
        }
    }
    return result;
}


//this is for medicare plans
function processMedicarePlanChild(childObj){
    var returnChildObj = {};
    var dateArray = [];
    var emailArray = [];
    var phoneArray = [];
    var typeArray = [];
    typeArray.push('medicare');
    for(var key in childObj){
        var key = key.toLowerCase();
        var value = childObj[key];
        if (key.indexOf('plan id') >= 0){
            returnChildObj.plan_id = value;
        }
        //plan name in original document is more adhering to insurance type
        else if (key.indexOf('plan name') >= 0){
            typeArray.push(value);
        }
        else if(key.indexOf('marketing name') >= 0){
            returnChildObj.name = value;
        }
        else if(key.indexOf('plan address') >= 9){
            //needs to be updated to an address object
            //try to split by state name first.
            returnChildObj.address = value;
        }
        else if(key.indexOf('plan period') >= 0){
            //parse stuff here.
            //var processDate = commonFunctions.getFunction('cda_date');
            //var dateObj = processDate(value);
            //dateArray.push(dateObj);
        }
        //not present in sample text file, but files probably have it.
        else if(key.indexOf('email') >= 0){
            var processEmail = commonFunctions.getFunction('cda_email');
            var emailObj = processEmail(value);
            emailArray.push(emailObj);
        }
        else if(key.indexOf('phone') >= 0){
            var processPhone = commonFunctions.getFunction('cda_phone');
            var phoneObj = processPhone(value);
            phoneArray.push(phoneObj);
        }
        else if(key.indexOf('plan type') >= 0){
            typeArray.push(value);
        }
    }

    if(typeArray.length > 0){
          returnChildObj.type = typeArray;
    }
    if(dateArray.length > 0){
        returnChildObj.date = dateArray;
    }


    return returnChildObj;


}

function processEmployerChild(childObj){
    var returnChildObj = {};
    var typeArray = [];
    var dateArray = [];
    typeArray.push('employer subsidy');
    for(var key in childObj) {
        key = key.toLowerCase();
        value = childObj[key];
        if(key.indexOf('employer plan') >= 0){
            returnChildObj.name = value;
        }
        else if(key.indexOf('date') >= 0){
            var processDate = commonFunctions.getFunction('cda_date');
            var dateObj = processDate(value);
            dateArray.push(dateObj);
        }
    }

    if(typeArray.length > 0){
          returnChildObj.type = typeArray;
    }
    if(dateArray.length > 0){
        returnChildObj.date = dateArray;
    }
    return returnChildObj;






}
//generic insurance plan, for primary insurance and other insurance
function processInsuranceChild(childObj){
    var returnChildObj = {};
    var dateArray = [];
    var emailArray = [];
    var phoneArray = [];
    var typeArray = [];
    var addressArray = [];
    for(var key in childObj){
        var key = key.toLowerCase();
        var value = childObj[key];
        if(key.indexOf('msp type') >= 0 && value.length > 0){
            returnChildObj.type = 'medicare msp:' + value;
        }
        else if(key.indexOf('msp type') >= 0){
            returnChildObj.type = 'medicare msp';
        }
        else if (key.indexOf('policy number') >= 0){
            returnChildObj.policy_number = value;
        }
        else if(key.indexOf('insurer name') >= 0){
            returnChildObj.payer_name = value;
        }
        else if(key.indexOf('insurer address') >= 0){
            //needs to be updated to an address object
            //try to split by state name first.
            var processLineAddr = commonFunctions.getFunction('cda_line_address');
            var addressObj = processLineAddr(value);
            addressArray.push(addressObj);
        }
        else if(key.indexOf('date') >= 0){
            var processDate = commonFunctions.getFunction('cda_date');
            var dateObj = processDate(value);
            dateArray.push(dateObj);
        }
        //not present in sample text file, but files probably have it.
        else if(key.indexOf('email') >= 0){
            var processEmail = commonFunctions.getFunction('cda_email');
            var emailObj = processEmail(value);
            emailArray.push(emailObj);
        }
        else if(key.indexOf('phone') >= 0){
            var processPhone = commonFunctions.getFunction('cda_phone');
            var phoneObj = processPhone(value);
            phoneArray.push(phoneObj);
        }
    }
    if(dateArray.length > 0){
        returnChildObj.date = dateArray;
    }
    if(addressArray.length > 0){
        returnChildObj.addresses = addressArray;
    }
    return returnChildObj;
}



module.exports = parseInsurance;
