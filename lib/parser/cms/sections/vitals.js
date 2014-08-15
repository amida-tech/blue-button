var commonFunctions = require('./commonFunctions');

/*vitals does not need the common parser because it doesn't have a lot of common
elements */

function parseVitals(sectionObj) {

    //setup templates for common function

    //hard coded code database
    /*apply special functions */
    var specialResult = {};
    var specialIndex = 0;
    var result = []; //aka section, results array
    for (var key in sectionObj) {
        var rawChild = sectionObj[key];
        var childObj = {};
        if (Object.keys(rawChild).length > 1) {
            childObj = parseVitalsChild(rawChild);
            /*This is for blood pressure/values separated with slashes and to process numbers
            as values. Parse blood pressure(diastolic and systolic) as two objects, copy duplicate
            */
            if (childObj.value.indexOf('/') >= 0 &&
                childObj.vital.name.toLowerCase().indexOf('blood pressure') >= 0) {
                var numbersArray = childObj.value.split('/');
                var bpSystolic = JSON.parse(JSON.stringify(childObj));
                var bpDiastolic = JSON.parse(JSON.stringify(childObj));

                //extrapolation on code systems
                expandCodeEntry(bpSystolic, 'systolic');
                expandCodeEntry(bpDiastolic, 'diastolic');

                //separate and reassign numerical values
                bpSystolic.value = Number(numbersArray[0]);
                bpDiastolic.value = Number(numbersArray[1]);

                //put vital objects into top level section arry
                result.push(bpSystolic);
                result.push(bpDiastolic);

            } else { //parse it as a single object
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

function expandCodeEntry(childObj, command) {

    /* Notes:
     1 Thought about implementing glucose here, but LOINC has several different fields for it.
     2. codes used from https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=2.16.840.1.113883.3.88.12.80.62#
     seems reasonable for now. More entries can be added, but I haven't seem them in cms files yet.
     */
    var codeDict = {
        "blood pressure diastolic": {
            "code": "8462-4",
            "name": "Intravascular Diastolic",
            "code_system_name": "LOINC"
        },
        "blood pressure systolic": {
            "code": "8480-6",
            "name": "Intravascular Systolic",
            "code_system_name": "LOINC"
        },
        "height": {
            "code": "8302-2",
            "name": "Body Height",
            "code_system_name": "LOINC"
        },
        "weight": {
            "code": "3141-9",
            "name": "Body Weight",
            "code_system_name": "LOINC"
        }
    };

    var rawVitalName = childObj.vital.name; //this is the raw vital object from cms

    if (command === 'systolic') {
        childObj.vital = codeDict["blood pressure systolic"];
    } else if (command === 'diastolic') {
        childObj.vital = codeDict["blood pressure diastolic"];
    } else if (command === 'weight') {
        childObj.vital = codeDict["weight"];
    } else if (command === 'height') {
        childObj.vital = codeDict["height"];
    }

}

function parseVitalsChild(childObj) {
    var vitalChildObj = {};
    var parseDate = commonFunctions.getFunction('cda_date');
    var parseCodedEntry = commonFunctions.getFunction(
        'cda_coded_entry');
    var vitalType = childObj['vital statistic type'];

    vitalChildObj.vital = parseCodedEntry(vitalType); //need to change here

    var date = childObj.date;
    var time = childObj.time;
    var dateTime = date + " " + time;
    vitalChildObj.date_time = {
        "point": parseDate(dateTime)
    };
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
    /*for height and weight, you need some kind of realistic numberical evaluator to
    determine the weight and height units */
    if (vitalType.toLowerCase() == 'blood pressure') {
        return 'mm[Hg]';
    } else if (vitalType.toLowerCase().indexOf('glucose') >= 0) {
        return 'mg/dL';
    } else if (vitalType.toLowerCase().indexOf('height') >= 0) {
        return 'cm';
    } else if (vitalType.toLowerCase().indexOf('weight') >= 0) {
        return 'kg';
    }

    return null;
}

module.exports = parseVitals;
