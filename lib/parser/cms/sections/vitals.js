

var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;


/*vitals does not need the common parser because it doesn't have a lot of common
elements */
function parseVitals(sectionObj){


  //setup templates for common function

  /*apply special functions */
  var specialResult = {};
  var specialIndex = 0;
  var result = [];
  //console.log(sectionObj);
  for(var key in sectionObj){
    var child = sectionObj[key];
    var childObj = {};
    if(Object.keys(child).length > 1){
      childObj = parseVitalsChild(child);
      result.push(childObj);
      }
      /*be selective about what sections you want to pass into shared parser
       you don't want to pass a section with a blank entry for comments. */
  }

  //check to make sure that there isn't any bad entries, clean up

  return result;
}


function parseVitalsChild(childObj){
  var vitalChildObj = {};
  var parseDate = commonModelFunctionRouter.getCommonModelFunction('cda_date',
    'special');
  var parseCodedEntry = commonModelFunctionRouter.getCommonModelFunction(
    'cda_coded_entry', 'special');
  var vitalType =childObj['vital statistic type'];

  vitalChildObj.vital = parseCodedEntry(vitalType);
  var date = childObj.date;
  var time = childObj.time;
  var dateTime = date + " " + time;
  vitalChildObj.date = parseDate(dateTime, 'hour');
  vitalChildObj.value = childObj.reading;
  vitalChildObj.units = getVitalUnits(vitalType);
  if(date !== null || date !== undefined){
    vitalChildObj.status = 'completed';
  }

  return vitalChildObj;
}
//this needs to be a more complex function that can correctly analyze what
//type of units it is. Also should be given the value as well later.
function getVitalUnits(vitalType){
  if(vitalType.toLowerCase() == 'blood pressure'){
    return 'mm[Hg]';
  }
  else if(vitalType.toLowerCase().indexOf('glucose') >= 0){
    return 'mg/dL';
  }
  return null;
}



module.exports = parseVitals;
