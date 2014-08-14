var commonFunctions = require('./commonFunctions');

ignoreValue = commonFunctions.getFunction('ignore');

function parseClaims(intObj, sectionType) {
    //console.log(intObj);
    var result = [];

    for (var key in intObj) {
        var child = intObj[key];
        var parsedChild;
        /*right now, it seems like the text file puts type D medication claims
        as a claim numbers. So at this point, we HAVE to check if the typeD
        is in claims and pull it out to the top level of claims, and process
        typeD sections separately. */
        if (isClaimTypeD(child)) {
            parsedChild = parseClaimTypeD(child);
        } else {
            parsedChild = parseClaimChild(child);
        }
        result.push(parsedChild);
    }
    return result;
}

function isClaimTypeD(childObj) {
    var claimLineArr = childObj.claimLines;
    if (ignoreValue(claimLineArr)) {
        return false;
    }
    if (claimLineArr.length > 0) {
        var claimLine = claimLineArr[0];
        if (claimLine['claim type'] === undefined) {
            return false;
        }
        if (claimLine['claim type'].toLowerCase().indexOf('part d') >= 0) {
            return true;
        }
    }
    return false;
}

function parseClaimTypeD(childObj) {

    var claimLineObjArr = [];
    var claimLineArr = childObj.claimLines;

    /* so each claim type d doesn't have a main claim type body, so I'm extracting some
    elements from the claim line and populating the body with information from the claim lines
    */
    var parsedChild = parseClaimChild(claimLineArr[0]);
    //Next parse all other claim lines
    for (var x = 0; x < claimLineArr.length; x++) {
        var claimLine = claimLineArr[x];
        var claimLineObj = parseClaimLineTypeD(claimLine);
        claimLineObjArr.push(claimLineObj);
    }

    parsedChild.lines = claimLineObjArr;
    extrapolateDatesFromLines(parsedChild.lines, parsedChild);
    extrapolatePerformersFromClaimLines(parsedChild.lines, parsedChild);
    return parsedChild;
}

function parseClaimLineTypeD(childObj) {

    //medicare type d - I'm going to parser it into performers for the pharmacists,
    //and add a 'pharmacy' attribute to the type: array
    var drugObj = {};
    var performerArray = [];
    var claimLineObj = {};
    /*Okay we decided that providers = performers, so I'm parsing both of the
    pharmacy service provider and the prescriber as performers, with each of them
    having the type attribute set to either prescriber or provider/pharmacy
    */
    var pharmacyObj = {};
    var prescriberObj = {};
    for (var key in childObj) {
        var value = childObj[key];
        key = key.toLowerCase();
        if (ignoreValue(value)) {
            continue;
        } else if (key.indexOf('service provider') >= 0) {
            //this would be parsed under the organization of the pharmacist
            pharmacyObj.type = 'pharmacy';
            pharmacyObj.identifiers = [commonFunctions.getFunction('cda_id')("2.16.840.1.113883.4.6", value)];
        } else if (key.indexOf('pharmacy name') >= 0) {
            pharmacyObj.name = [value];
        } else if (key.indexOf('drug code') >= 0) {
            drugObj.code = value;
        } else if (key.indexOf('drug name') >= 0) {
            drugObj.name = value;
        } else if (key.indexOf('prescriber identifer') >= 0) {
            //parsing this as a single element array of cda_id, "2.16.840.1.113883.4.6" is the oid for npi
            prescriberObj.identifiers = [commonFunctions.getFunction('cda_id')("2.16.840.1.113883.4.6", value)];
            prescriberObj.type = 'prescriber';
        } else if (key.indexOf('prescriber name') >= 0) {
            prescriberObj.name = [commonFunctions.getFunction('cda_name')(value)];
        } else if (key.indexOf('service date') >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            if (!claimLineObj.date_time) {
                claimLineObj.date_time = {};
            };
            claimLineObj.date_time["point"] = processDate(value);
        }
    }

    if (Object.keys(prescriberObj).length > 0) {
        performerArray.push(prescriberObj);
    }
    if (Object.keys(pharmacyObj).length > 0) {
        performerArray.push(pharmacyObj);
    }
    if (Object.keys(drugObj).length > 0) {
        claimLineObj.drug = drugObj;
    }
    if (performerArray.length > 0) {
        claimLineObj.performer = performerArray;
    }
    return claimLineObj;

}

function parseClaimChild(childObj) {
    var returnChildObj = {};
    var chargesObj = {};
    var typeArray = [];
    var diagnosisArray = [];
    /* for now, this isn't utilized because sample file didn't specify how
    provider names/addresses really look */
    var performerObj = {};
    var value;

    returnChildObj.payer = ['medicare'];

    for (var key in childObj) {
        value = childObj[key];
        key = key.toLowerCase();
        if (ignoreValue(value)) {
            continue;
        }
        if (key.indexOf('claim number') >= 0) {
            returnChildObj.number = value;
        } else if (key.indexOf('service start date') >= 0 && value.length >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            if (!returnChildObj.date_time) {
                returnChildObj.date_time = {};
            };
            returnChildObj.date_time["low"] = processDate(value);
        } else if (key.indexOf('service end date') >= 0 && value.length >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            if (!returnChildObj.date_time) {
                returnChildObj.date_time = {};
            };
            returnChildObj.date_time["high"] = processDate(value);
        } else if (key.indexOf('claim service date') >= 0 && value.length >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            if (!returnChildObj.date_time) {
                returnChildObj.date_time = {};
            };
            returnChildObj.date_time["point"] = processDate(value);
        } else if (key.indexOf('amount charged') >= 0 && value.length >= 0) {
            chargesObj.price_billed = value;
        } else if (key.indexOf('medicare approved') >= 0 && value.length >= 0) {
            chargesObj.insurance_paid = value;
        } else if (key.indexOf('provider paid') >= 0 && value.length >= 0) {
            chargesObj.provider_paid = value;
        } else if (key.indexOf('you may be billed') >= 0 && value.length >= 0) {
            chargesObj.patient_responsibility = value;
        } else if (key.indexOf('claim type') >= 0 && value.length >= 0) {
            var claimTypeEntry = 'medicare ' + value;
            typeArray.push(claimTypeEntry);
        } else if (key.indexOf('diagnosis code') >= 0 && value.length >= 0) {
            var processCode = commonFunctions.getFunction('cda_coded_entry');
            var entry = processCode('', value, '');
            diagnosisArray.push(entry);
        } else if (key.indexOf('claimlines') >= 0 && value.length >= 0) {
            var claimLineArray = value;
            var processedClaimLines = [];
            for (var x in claimLineArray) {
                var claimLineObj = processClaimLine(claimLineArray[x]);
                processedClaimLines.push(claimLineObj);
            }
            returnChildObj.lines = processedClaimLines;
        } else if (key.indexOf('revenue code') >= 0 && value.length >= 0) {
            var revenueValueArray = value.split('-');
            revenueObj.code = revenueValueArray[0].trim();
            revenueObj.description = revenueValueArray[1].trim();
            claimLineObj.procedure = procedureObj;
        } else if (key.indexOf('provider billing address') >= 0 && value.length >= 0) {
            var processAddress = commonFunctions.getFunction('cda_line_address');
            performerObj.address = [processAddress(value)];
            //these few commands are for claim line type d
        } else if (key === 'provider' && value.length >= 0) {
            performerObj.name = [value];
        }
    }
    //only add object entries if they are not empty
    if (Object.keys(chargesObj).length > 0) {
        returnChildObj.charges = chargesObj;
    }
    if (Object.keys(typeArray).length > 0) {
        returnChildObj.type = typeArray;
    }
    if (Object.keys(diagnosisArray).length > 0) {
        returnChildObj.diagnosis = diagnosisArray;
    }
    if (Object.keys(performerObj).length > 0) {
        returnChildObj.performer = [performerObj];
    }
    //extrapolate various date for main claims
    extrapolateDatesFromLines(returnChildObj.lines, returnChildObj);
    return returnChildObj;
}

//extrapolates main claim body dates from claim lines

function extrapolateDatesFromLines(claimLines, returnChildObj) {
    var lowTime;
    var highTime;
    var pointTime;
    if (returnChildObj.date_time) {
        if (returnChildObj.date_time.low) {
            lowTime = returnChildObj.date_time.low;
        }
        if (returnChildObj.date_time.high) {
            highTime = returnChildObj.date_time.high;
        }
        if (returnChildObj.date_time.point) {
            pointTime = returnChildObj.date_time.point;
        }
    }
    for (var x in claimLines) {
        var claimLineObj = claimLines[x];
        if (claimLineObj.date_time) {
            /*if the main claim body has undefined dates, populate it with
            claim lines date */
            if (claimLineObj.date_time.low && lowTime === undefined) {
                lowTime = claimLineObj.date_time.low;
            }
            if (claimLineObj.date_time.high && highTime === undefined) {
                highTime = claimLineObj.date_time.high;
            }
            if (claimLineObj.date_time.point && pointTime === undefined) {
                pointTime = claimLineObj.date_time.point;
            }
            //if the claim lines are defined, then update them with better/more accurate information
            if (lowTime !== undefined && claimLineObj.date_time.low) {
                var lowDateTime = new Date(lowTime.date);
                var lineLowDateTime = new Date(claimLineObj.date_time.low.date);
                if (lineLowDateTime < lowDateTime) {
                    lowTime = claimLineObj.date_time.low;
                }
            }
            if (highTime !== undefined && claimLineObj.date_time.high) {
                var highDateTime = new Date(highTime.date);
                var lineHighDateTime = new Date(claimLineObj.date_time.high.date);
                if (lineHighDateTime > highDateTime) {
                    highTime = claimLineObj.date_time.high;
                }
            }
            //on the assumption that the most recent service date is most relevant
            if (pointTime !== undefined && claimLineObj.date_time.point) {
                var pointDateTime = new Date(pointTime.date);
                var linePointDateTime = new Date(claimLineObj.date_time.point.date);
                if (pointDateTime > pointDateTime) {
                    pointTime = claimLineObj.date_time.point;
                }
            }
        }
    }
    //assign the newly discovered times to the main claims body object
    if (returnChildObj.date_time === undefined) {
        returnChildObj.date_time = {};
    }
    if (lowTime) {
        returnChildObj.date_time.low = lowTime;
    }
    if (highTime) {
        returnChildObj.date_time.high = highTime;
    }
    if (pointTime) {
        returnChildObj.date_time.point = pointTime;
    }

}

function extrapolatePerformersFromClaimLines(claimLines, returnChildObj) {

    //clever solution from net
    var uniquePerformerObj = {};
    var uniquePerformerArr = [];
    for (var i = 0; i < Object.keys(claimLines).length; i++) {

        for (var j = 0; j < Object.keys(claimLines[i].performer).length; j++) {
            var uniqueKey = JSON.stringify(claimLines[i].performer[j]);
            uniquePerformerObj[uniqueKey] = claimLines[i].performer[j];
        }
    }
    for (var i in uniquePerformerObj) {
        uniquePerformerArr.push(uniquePerformerObj[i]);
    }
    returnChildObj.performer = uniquePerformerArr;

}

//tells whether this value needs to be ignored or not

function processClaimLine(claimLines) {
    var claimLineObj = {};
    var modifierArray = [];

    var drugObj = {};
    var chargesObj = {};
    var placeObj = {};
    var typeObj = {};
    ///will be parsed as rendering provider

    //this time performer object is the rendering provider
    var performerObj = {};
    var performerIdentifierArray = [];
    for (var key in claimLines) {
        var value = claimLines[key];
        key = key.toLowerCase();
        ignoreValue = commonFunctions.getFunction('ignore');
        if (ignoreValue(value)) {
            continue;
        } else if (key.indexOf('line number') >= 0 && value.length >= 0) {
            claimLineObj.line = value;
        } else if (key.indexOf('date of service from') >= 0 && value.length >= 0) {
            var processDate = commonFunctions.getFunction('cda_date');
            if (!claimLineObj.date_time) {
                claimLineObj.date_time = {};
            };
            claimLineObj.date_time["low"] = processDate(value);
        } else if (key.indexOf('date of service to') >= 0 && value.length >= 0) {
            if (!claimLineObj.date_time) {
                claimLineObj.date_time = {};
            };
            claimLineObj.date_time["high"] = processDate(value);
        } else if (key.indexOf('revenue') >= 0 && value.length >= 0) {
            var revenueValueArray = value.split('-');
            var revenueObj = {};
            revenueObj.code = revenueValueArray[0].trim();
            revenueObj.description = revenueValueArray[1].trim();
            claimLineObj.revenue = revenueObj;
        } else if (key.indexOf('procedure') >= 0 && value.length >= 0) {
            var procedureValueArray = value.split('-');
            var procedureObj = {};
            procedureObj.code = procedureValueArray[0].trim();
            procedureObj.description = procedureValueArray[1].trim();
            claimLineObj.procedure = procedureObj;
        } else if (key.indexOf('modifier') >= 0 && value.length >= 0) {
            var modifierObj = {};
            var modifierValueArray = value.split('-');
            modifierObj.code = modifierValueArray[0].trim();
            modifierObj.description = modifierValueArray[1].trim();
            modifierArray.push(modifierObj);
        } else if (key.indexOf('quantity') >= 0 && value.length >= 0) {
            var numVal = parseInt(value);
            var quantityObj = {};
            quantityObj.value = numVal;
            quantityObj.unit = 'line';
            claimLineObj.quantity = quantityObj;
        } else if (key.indexOf('submitted amount') >= 0 && value.length >= 0) {
            chargesObj.price_billed = value;
        } else if (key.indexOf('allowed amount') >= 0 && value.length >= 0) {
            chargesObj.insurance_paid = value;
        } else if (key.indexOf('noncovered') >= 0 && value.length >= 0) {
            chargesObj.patient_responsibility = value;
        } else if (key.indexOf('place of service') >= 0 && value.length >= 0) {
            placeValueArray = value.split('-');
            placeObj.code = placeValueArray[0].trim();
            placeObj.name = placeValueArray[1].trim();
        } else if (key.indexOf('type of service') >= 0 && value.length >= 0) {
            typeValueArray = value.split('-');
            typeObj.code = typeValueArray[0].trim();
            typeObj.name = typeValueArray[1].trim();
        } else if (key.indexOf('rendering provider npi') >= 0 && value.length >= 0) {
            performerObj.type = 'rendering provider';
            //parsing this as a single element array of cda_id, "2.16.840.1.113883.4.6" is the oid for npi
            var parsedIdentifier = commonFunctions.getFunction('cda_id')("2.16.840.1.113883.4.6", value);
            performerIdentifierArray.push(parsedIdentifier);
        }
    }
    if (modifierArray.length > 0) {
        claimLineObj.modifier = modifierArray;
    }
    if (Object.keys(chargesObj).length > 0) {
        claimLineObj.charges = chargesObj;
    }
    if (Object.keys(placeObj).length > 0) {
        claimLineObj.place_of_service = placeObj;
    }
    if (Object.keys(typeObj).length > 0) {
        claimLineObj.type = typeObj;
    }
    if (performerIdentifierArray.length > 0) {
        performerObj.identifiers = performerIdentifierArray;
    }

    if (Object.keys(performerObj).length > 0) {
        claimLineObj.performer = [performerObj];
    }
    return claimLineObj;
}

module.exports = parseClaims;
