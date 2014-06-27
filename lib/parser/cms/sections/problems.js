
var commonFunctions = require('./commonFunctions');




function parseProblems(intObj) {

    //setup templates for common function
    var result = [];
    for(var key in intObj){
        var obj = processProblemChild(intObj[key]);
        result.push(obj);
    }


    return result;
}


function processProblemChild(rawChildObj){
    var childObj = {};
    var dateArray = [];
    for(var key in rawChildObj){
        var value = rawChildObj[key];
        if(key.indexOf('name') >= 0){
            var processFunction = commonFunctions.getFunction('cda_coded_entry');
            childObj.problem = processFunction(value);
        }
        else if(key.indexOf('date' >=0)){
            var processDate = commonFunctions.getFunction('cda_date');
            var date= processDate(value);
            dateArray.push(date);
        }
    }
    childObj.date = dateArray;
    if( childObj.status === undefined){
        childObj.status == 'resolved';
    }
    return childObj;
}



module.exports = parseProblems;
