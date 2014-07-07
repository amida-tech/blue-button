var commonFunctions = require('./commonFunctions');

ignoreValue = commonFunctions.getFunction('ignore');

function parseClaims(intObj, sectionType) {
    //console.log(intObj);
    var result = [];

    for(var key in intObj){
        var child = intObj[key];
        var parsedChild;
        /*right now, it seems like the text file puts type D medication claims
        as a claim numbers. So at this point, we HAVE to check if the typeD
        is in claims and pull it out to the top level of claims, and process
        typeD sections separately. */
        var claimTypeD = false;
        if(Object.keys(child.claimLines).length === 1){
            var claimLineArr = child.claimLines;
            for(var x = 0; x < claimLineArr.length; x++){
                if('claim type' in claimLineArr[x] ){
                    var claimLine = claimLineArr[x];
                    if(claimLine['claim type'].toLowerCase().indexOf('part d') >= 0){
                        parsedChild = parseClaimTypeD(claimLine);
                        claimTypeD = true;
                        continue;// don't double process, get to next iteration
                    }
                }
            }
        }
        if(claimTypeD === false){
            parsedChild = parseClaimChild(child);
        }
        result.push(parsedChild);
    }
    return result;
}

function parseClaimTypeD(childObj){
    var returnChildObj = parseClaimChild(childObj);
    var drugObj = {};
    var claimLineObj = {};
    var providerObj  = {};
    var proscriberObj = {};
    for(var key in childObj){
        var value = childObj[key];
        key = key.toLowerCase();
        if(ignoreValue(value)){
            continue;
        }
        else if(key.indexOf('service provider') >= 0){
            providerObj.provider_id = value;
        }
        else if(key.indexOf('pharmacy name') >= 0){
            providerObj.provider_name = value;
        }
        else if(key.indexOf('drug code') >= 0){
            drugObj.code = value;
        }
        else if(key.indexOf('drug name') >= 0){
            drugObj.name = value;
        }
        else if(key.indexOf('prescriber identifer') >= 0){
            proscriberObj.code = value;
        }
        else if(key.indexOf('prescriber name') >= 0){
            proscriberObj.name = value;
        }
    }

    if(Object.keys(drugObj).length > 0){
        claimLineObj.drug = drugObj;
    }
    if(Object.keys(providerObj).length > 0){
        claimLineObj.provider = providerObj;
    }
    if(Object.keys(proscriberObj).length > 0){
        claimLineObj.proscriber = proscriberObj;
    }
    if(Object.keys(claimLineObj).length > 0){
        returnChildObj.claimLines = claimLineObj;
    }


    return returnChildObj;

}





function parseClaimChild(childObj){
    var returnChildObj = {};
    var chargesObj = {};
    var typeArray = [];
    var diagnosisArray = [];
    /* for now, this isn't utilized because sample file didn't specify how
    provider names/addresses really look */
    var providerObj = {};
    var value;

    returnChildObj.payer = ['medicare'];

    for(var key in childObj){
        value = childObj[key];
        key = key.toLowerCase();

        if(ignoreValue(value)){
            continue;
        }
        if(key.indexOf('claim number') >= 0) {
            returnChildObj.number = value;
        }
        else if(key.indexOf('service start date') >= 0 && value.length >= 0){
            var processDate = commonFunctions.getFunction('cda_date');
            returnChildObj.start_date = processDate(value);
        }
        else if(key.indexOf('service end date') >= 0 && value.length >= 0){
            var processDate = commonFunctions.getFunction('cda_date');
            returnChildObj.start_date = processDate(value);
        }
        else if(key.indexOf('amount charged') >= 0 && value.length >= 0){
            chargesObj.price_billed = value;
        }
        else if(key.indexOf('provider paid') >= 0 && value.length >= 0){
            chargesObj.provider_paid = value;
        }
        else if(key.indexOf('you may be billed') >= 0 && value.length >= 0){
            chargesObj.patient_responsibility = value;
        }
        else if(key.indexOf('claim type') >= 0 && value.length >= 0){
            var claimTypeEntry = 'medicare ' + value;
            typeArray.push(claimTypeEntry);
        }
        else if(key.indexOf('diagnosis code') >= 0 && value.length >= 0){
            var processCode = commonFunctions.getFunction('cda_coded_entry');
            var entry = processCode('', value, '');
            diagnosisArray.push(entry);
        }
        else if(key.indexOf('claimlines') >= 0 && value.length >= 0){
            var claimLineArray = value;
            var processedClaimLines = [];
            for(var x in claimLineArray){
                var claimLineObj = processClaimLine(claimLineArray[x]);
                processedClaimLines.push(claimLineObj);
            }
            returnChildObj.lines = processedClaimLines;
        }
        else if(key.indexOf('revenue code') >= 0 && value.length >= 0){
            var revenueValueArray = value.split('-');
            revenueObj.code = revenueValueArray[0].trim();
            revenueObj.description = revenueValueArray[1].trim();
            claimLineObj.procedure = procedureObj;
        }
        else if(key.indexOf('provider') >= 0 && value.length >= 0){
            providerObj.name = value;
        }

        else if(key.indexOf('provider billing address') >= 0 && value.length >= 0){
            var processAddress = commonFunctions.getFunction('cda_line_address');
            providerObj.billing_address = processAddress(value);
        }
    }
    //only add object entries if they are not empty
    if(Object.keys(chargesObj).length > 0){
        returnChildObj.charges = chargesObj;
    }
    if(Object.keys(typeArray).length > 0){
        returnChildObj.type = typeArray;
    }
    if(Object.keys(diagnosisArray).length > 0){
        returnChildObj.diagnosis = diagnosisArray;
    }
    if(Object.keys(providerObj).length > 0){
        returnChildObj.provider = providerObj;
    }
    return returnChildObj;
}


//tells whether this value needs to be ignored or not

function processClaimLine(claimLines){
    var claimLineObj = {};
    var modifierArray = [];

    var drugObj = {};
    var chargesObj = {};
    var placeObj = {};
    var typeObj = {};
    var renderingProviderObj = {};
    for(var key in claimLines){
        var value = claimLines[key];
        key = key.toLowerCase();
        ignoreValue = commonFunctions.getFunction('ignore');
        if(ignoreValue(value)){
            continue;
        }
        else if(key.indexOf('line number') >= 0 && value.length >= 0){
            claimLineObj.line = value;
        }
        else if(key.indexOf('date of service from') >= 0 && value.length >= 0){
            var processDate = commonFunctions.getFunction('cda_date');
            claimLineObj.start_date = processDate(value);
        }
        else if(key.indexOf('date of service to') >= 0 && value.length >= 0){
            claimLineObj.end_date = processDate(value);
        }
        else if(key.indexOf('procedure') >= 0 && value.length >= 0){
            var procedureValueArray = value.split('-');
            var procedureObj = {};
            procedureObj.code = procedureValueArray[0].trim();
            procedureObj.description = procedureValueArray[1].trim();
            claimLineObj.procedure = procedureObj;
        }
        else if(key.indexOf('modifier') >= 0 && value.length >= 0){
            var modifierObj = {};
            var modifierValueArray = value.split('-');
            modifierObj.code = procedureValueArray[0].trim();
            modifierObj.description = procedureValueArray[1].trim();
            modifierArray.push(modifierObj);
        }
        else if(key.indexOf('quantity') >= 0 && value.length >= 0){
            var numVal = new Number(value.trim());
            claimLineObj.quantity = numVal;
        }
        else if(key.indexOf('submitted amount') >= 0 && value.length >= 0){
            chargesObj.price_billed = value;
        }
        else if(key.indexOf('allowed amount') >= 0 && value.length >= 0){
            chargesObj.insurance_paid = value;
        }
        else if(key.indexOf('non-covered') >= 0 && value.length >= 0){
            chargesObj.patient_responsibility = value;
        }
        else if(key.indexOf('place of service') >= 0 && value.length >= 0){
            placeValueArray = value.split('-');
            placeObj.code = placeValueArray[0].trim();
            placeObj.name = placeValueArray[1].trim();
        }
        else if(key.indexOf('type of service') >= 0 && value.length >= 0){
            typeValueArray = value.split('-');
            typeObj.code = typeValueArray[0].trim();
            typeObj.name = typeValueArray[1].trim();
        }
        else if(key.indexOf('rendering provider no') >= 0 && value.length >= 0){
            renderingProviderObj.number = value;
        }
        else if(key.indexOf('rendering provider npi') >= 0 && value.length >= 0){
            renderingProviderObj.npi = value;
        }
    }
    if(modifierArray.length > 0){
        claimLineObj.modifier = modifierArray;
    }
    if(Object.keys(chargesObj).length > 0){
        claimLineObj.charges = chargesObj;
    }
    if(Object.keys(placeObj).length > 0){
        claimLineObj.place = placeObj;
    }
    if(Object.keys(typeObj).length > 0){
        claimLineObj.type = typeObj;
    }
    if(Object.keys(renderingProviderObj).length > 0){
        claimLineObj.rendering_provider = renderingProviderObj;
    }
    return claimLineObj;
    }

module.exports = parseClaims;
