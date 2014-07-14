
var commonFunctions = require('./commonFunctions');


/*vitals does not need the common parser because it doesn't have a lot of common
elements */

function parseVitals(sectionObj) {


    //setup templates for common function

    /*apply special functions */
    var specialResult = {};
    var specialIndex = 0;
    var result = [];
    for (var key in sectionObj) {
        var child = sectionObj[key];
        var childObj = {};
        if (Object.keys(child).length > 1) {
            childObj = standardizeChildKeys(child);
            childObj = parseVitalsChild(childObj);
            //
            //This is for blood pressure/values separated with slases and to process numbers
            //as values
            if(childObj.value.indexOf('/') >=0){
                var numbersArray = childObj.value.split('/');
                for(var x = 0; x < numbersArray.length; x++){
                    var obj = JSON.parse(JSON.stringify(childObj));
                    obj.value = Number(numbersArray[x]);
                    result.push(obj);
                }
            }
            else{
                childObj.value = Number(childObj.value);
                result.push(childObj);
            }
        }
        /*be selective about what sections you want to pass into shared parser
       you don't want to pass a section with a blank entry for comments. */
    }
    //check to make sure that there isn't any bad entries, clean up
    return result;
}

function standardizeChildKeys(childObj) {
    for (var key in childObj) {
        if (key.indexOf('value') >= 0) {
            childObj.reading = childObj[key];
            delete childObj[key];
        }
    }
    return childObj;
}




function parseVitalsChild(childObj) {
    var vitalChildObj = {};
    var parseDate = commonFunctions.getFunction('cda_date');
    var parseCodedEntry = commonFunctions.getFunction(
        'cda_coded_entry');
    var vitalType = childObj['vital statistic type'];

    vitalChildObj.vital = parseCodedEntry(vitalType);
    var date = childObj.date;
    var time = childObj.time;
    var dateTime = date + " " + time;
    vitalChildObj.date = [parseDate(dateTime)];
    vitalChildObj.value = childObj.reading; //needs to be changed so that it can take "Readings/Value"
    vitalChildObj.unit = getVitalUnits(vitalType);
    if (date !== null || date !== undefined) {
        vitalChildObj.status = 'completed';
    }

    return vitalChildObj;
}
//this needs to be a more complex function that can correctly analyze what
//type of units it is. Also should be given the value as well later.

function getVitalUnits(vitalType) {
    if (vitalType.toLowerCase() == 'blood pressure') {
        return 'mm[Hg]';
    } else if (vitalType.toLowerCase().indexOf('glucose') >= 0) {
        return 'mg/dL';
    }
    return null;
}



module.exports = parseVitals;
