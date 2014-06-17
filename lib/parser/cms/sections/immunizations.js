

function parseImmunizations(sectionObj){

  //Again, there's no need to use the shared parser, because immunizations is too
  //specific
  /*apply special functions to medications, take out the fields from original cms
  parser, store them in an intermediary object.*/


  var specialResult = {};
  var specialIndex = 0;
  var result = [];


  //console.log(result);
  //combine the two results together
  for(var x in sectionObj){
    var child = sectionObj[x];
    if(Object.keys(child).length > 1){ //get the dates for each object
      var dates = getDates(child);

      var immObj = {};
      for(var dateKey in dates){
        immObj = getImmunObj(child, dateKey, dates[dateKey]);
        result.push(immObj);
      }
    }
  }

  return result;
}

function getImmunObj(child, dateKey, dateObj){
  var returnObj = {};
  var date = dateObj;
  var administration = getAdministration(child);
  var immunName = child['immunization name'];
  var product = getProduct(immunName, dateKey);
  if(date !== undefined){
    returnObj['date'] = dateObj;
    returnObj['status'] = 'complete';
  }
  if(administration !== undefined){
    returnObj['administration'] = administration;
  }
  if(product !== undefined){
    returnObj['product'] = product;
  }
  return returnObj;
}



function getAdministration(child){
  var adminObj = {};
  var parseCodedEntry = commonModelFunctionRouter.getCommonModelFunction(
    'cda_coded_entry', 'special');

  if('method' in child){
    var name = child['method'];
    adminObj['route'] = parseCodedEntry(name);
  }
  return adminObj;
}


/*
Immunization Name: Varicella/Chicken Pox

Date Administered:04/21/2002

Method: Nasal Spray(mist)

Were you vaccinated in the US:

Comments: congestion

Booster 1 Date: 02/02/1990

Booster 2 Date:

Booster 3 Date:
*/

function getProduct(immunName, dateKey){

   var parseCodedEntry = commonModelFunctionRouter.getCommonModelFunction(
    'cda_coded_entry', 'special');
   if (dateKey.toLowerCase().indexOf('booster') >= 0){
      name = immunName + " (" + dateKey + ")";
   }
   else{
      name = immunName;
   }

   return parseCodedEntry(name);
}


function getDates(child){
    var returnObj = {};
    var parseDate = commonModelFunctionRouter.getCommonModelFunction('cda_date',
    'special');
    if('date administered' in child){
      var dateObj = parseDate(child['date administered'], 'day');
      if(dateObj !== undefined){
        returnObj['administered'] = dateObj;
      }
    }
    var boosterNum = 1;
    for(var key in child){
      if(key.toLowerCase().indexOf('booster') >=0 && child[key].length > 0){
        var dateObj = parseDate(child[key], 'day');
        var boosterKey = 'booster ' + boosterNum;
          returnObj[boosterKey] = dateObj;
      }
    }
    return returnObj;
}

module.exports = parseImmunizations;
