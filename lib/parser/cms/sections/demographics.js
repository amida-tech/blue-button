


var demographicsModelTemplate = getJSON('./sections/Models/demographics.json');
var demographicsUnfoundKeys = getJSON('./sections/unfoundKeyMaps/demographics.json');
var commonModelUnfoundKeys = getJSON('./sections/unfoundKeyMaps/commonModel.json');

var commonModels = getJSON('./sections/Models/commonModels.json');
var commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
var defaultValues = getJSON('./sections/Models/defaultValues.json');
var newDemographicsModel = {};

function parseDemographic(intObj){ //can probably refactor this out
  var unfinishedModels = {};//this keeps track of all objects that not finished yet
  //this template is from a json file that could be easily changed.
  if(intObj instanceof Array){ // start recursing thorugh the array of objects
    for(var x = 0; x < intObj.length; x++){
      parseDemographic(intObj[x]);
  }
  }
  else{
    var unfinishedValueTemplates ={};
    for(var intKey in intObj){
        //overwrite case checking here, so that it's more robust.s\
        //using the backup key mapper
        intKey = intKey.toLowerCase();
        var bbKey = intKey;// blue button key
        if (!(intKey in demographicsModelTemplate) && intKey in demographicsUnfoundKeys){
          bbKey = demographicsUnfoundKeys[intKey];
        }
        bbKey = bbKey.toLowerCase();

        if(bbKey in demographicsModelTemplate){
          //*******might want to trim keys and values anymore.
          var valueOfIntObj = intObj[intKey]; //CMS value
          var valueModel;
          //console.log(valueModel);
          var valueType; //can probably remove this later
          var unfilledKeys = [];
          if(bbKey in unfinishedValueTemplates){
            valueModel = unfinishedValueTemplates[bbKey]['template'];
            unfilledKeys = unfinishedValueTemplates[bbKey]['unfilledKeys'];
            valueType = unfinishedValueTemplates[bbKey]['valueType'];
            valueType  = getValueType(valueModel);
          }
          else{
            valueModel = demographicsModelTemplate[bbKey]; //structure of BB value
            valueType = getValueType(valueModel);
          }
          var valueTemplate = valueModelFinder(valueModel);
          //**AT THIS POINT, if it's a peculiar case, i.e. name, then you need to find a way to somehow make an exception to the rule here.

          //I could probably wrap this in an object and pass it down.
          var writeValueResult = writeValue(intKey, valueOfIntObj, valueTemplate, unfilledKeys);//this needs to be changed to accomodate different functions later
          var templateComplete = writeValueResult[0];
          var finalValue = writeValueResult[1];

          if(!templateComplete){
            finalValue['valueType'] = valueType;
            unfinishedValueTemplates[bbKey] = finalValue;
          }
          else if(valueType instanceof Array){//rewrite the logic here
            if (bbKey in newDemographicsModel){//if there's already an object in the array
              newDemographicsModel[bbKey].push(finalValue['template']);
            }
            else{//otherwise make a new array
              newDemographicsModel[bbKey] = [];
              newDemographicsModel[bbKey].push(finalValue['template']);
            }
            delete unfinishedValueTemplates[bbKey];
          }
          else if(valueType instanceof Object && !(valueType instanceof Array)){
            newDemographicsModel[bbKey] = finalValue['template'];
            delete unfinishedValueTemplates[bbKey];
          }
        }
        else{
          var newError = "Cannot map " + intKey + " to BB.js";
          //errors.push(newError);
        }
      }
  }
  return newDemographicsModel;
}


function getValueType(objValue){

  if(objValue instanceof Array){
    return [];
  }
  else if(typeof(objValue) == 'string'){
    if(objValue.charAt(0) == '['){
      return [];
    }
    if(objValue.charAt(0) == "{"){
      return {};
    }
  }
  else if(typeof(objValue) == 'object' && typeof(objValue) !='array')
    return {};
}

//given a JSON object, this function extracts a model that is required for that key value pair
function valueModelFinder(objValue){
  if(objValue instanceof Array){
    //if it is in array format, then objValue only has one value by default, aka an object
    return valueModelFinder(objValue[0]);
  }
  else if (typeof(objValue) == 'string'){ //might need replacing here.
    var testBrackets1 = /\{[\S\s]+\}/;
    if(testBrackets1.test(objValue)){
      var newObjValue = objValue.slice(1, objValue.length -1 );
      return valueModelFinder(newObjValue);
    }
    else if(objValue in commonModels) //need to do something here for VERY special functions, i.e. names.
    {
      //for an exception like cda_name, you need to return the 'cda_name' instead of giving it a format.
      var commonModelExceptions = commonModelFunctionRouter.sections;
      if(objValue in commonModelExceptions){
        return objValue;
      }
      var modelFormat = commonModels[objValue];
      var modelFormatCopy = JSON.parse(JSON.stringify(modelFormat));
      return modelFormatCopy;
      //get the common model's function
    }
    return null;
  }
  else if(typeof(objValue) == 'object'){
    return objValue;
  }
  else{
    return null;
  }
}

//writes the value onto the given template, returns whether the template is complete and the associated object
function writeValue(intKey, valueOfIntObj, valueTemplate, unfilledKeys){

  /*case 1, the object has a field and a required section. In this case,
   just write the value, ignore required */
   var commonModelExceptions = commonModelFunctionRouter.sections;

    var templateFinished = false;

   if(valueTemplate in commonModelExceptions){
    var commonModelFunction = commonModelFunctionRouter.getCommonModelFunction(valueTemplate);
    valueTemplate = commonModelFunction(valueOfIntObj);
    templateFinished = true;
    console.log("common model function");
   }
  else if(unfilledKeys.length == 0){//initial loading of unfilled keys.
    for(var key in valueTemplate){
      if(key in defaultValues){
        valueTemplate[key] = defaultValues[key]; //set default values, i.e. primary to true
      }
      else{
        unfilledKeys.push(key);//otherwise put this in a list of unaccounted variables
      }
     }
  }
  if(intKey in commonModelUnfoundKeys){
      intKey = commonModelUnfoundKeys[intKey];
  }

  if(unfilledKeys.indexOf(intKey) > -1 ){ //this also needs to be put in an object later.
      /*Code that examines the data type needs to go here
      */
      var value = getValue(valueOfIntObj, valueTemplate[intKey]);
      valueTemplate[intKey] = value;
      var i = unfilledKeys.indexOf(intKey);
      unfilledKeys.splice(i, 1);
      if(unfilledKeys.length == 0){
        templateFinished = true;
      }
      else{
        templateFinished = false;
      }
  }
   /*this means everything in the object was set to default,
    so the only possible value that needs setting is the one that wasn't set.
    */
  else if(unfilledKeys.length == 1){
       //console.log(valueTemplate);
       var value = getValue(valueOfIntObj, valueTemplate[unfilledKeys[0]]);
       valueTemplate[unfilledKeys[0]] = value;
       templateFinished = true;
       unfilledKeys = [];
  }

  var returnObj = {};
  returnObj['template'] = valueTemplate;
  returnObj['unfilledKeys'] = unfilledKeys;
  return [templateFinished, returnObj];

}

function cleanKeys(obj){
  for(var key in obj){
    var tempValue = obj[key];
    var cleanedKey = key.trim();
    if(key != cleanedKey){
      delete obj[key];
      obj[cleanedKey] = tempValue;
    }
  }
  return obj;
}

function getValue(valueOfIntObj, templateValue){//template value specifies the format of the field
  //console.log(valueOfIntObj);
  var cleanString = trimStringEnds(templateValue, ['{', '}', '[', ']']);
  var templateArray= cleanString.split(',');
  var templateDetails = {};
    for(var x in templateArray){
    var keyValueSplit = templateArray[x].split(':');
    templateDetails[keyValueSplit[0].trim()] = keyValueSplit[1].trim();
  }
  //logic of how the original values are processed
  var valueType = templateDetails['type'];
  if(valueType == 'string'){
    return valueOfIntObj;
  }
  if(valueType == 'datetime'){
    var date = new Date(valueOfIntObj);
     return date.toISOString();
  }




}


function getJSON(filename){
  var fs = require('fs');
  var rawData = fs.readFileSync(filename).toString();
  var obj = JSON.parse(rawData);
  return cleanKeys(obj);
}

function trimStringEnds(keyValueString, unwantedCharArray){
  var unwantedBegCharIndex = 0;
  var unwantedEndCharIndex = keyValueString.length - 1;
  var keepGoing = true; //keep traversing the string
  //starting from the beginning of the string
  while(keepGoing)
  {
    var charIsUnwanted = false;
    for(var x = 0; x < unwantedCharArray.length; x++){
      if (keyValueString.charAt(unwantedBegCharIndex) == unwantedCharArray[x]){
        charIsUnwanted = true;
      }
    }
    if(!charIsUnwanted){
      keepGoing = false;
    }
    else
    {
      unwantedBegCharIndex++;
    }
  }
  //now start at the end
  keepGoing = true;
  while(keepGoing)
  {
    var charIsUnwanted = false;
    for(var x = 0; x < unwantedCharArray.length; x++){
      if (keyValueString.charAt(unwantedEndCharIndex) == unwantedCharArray[x]){
        charIsUnwanted = true;
      }
    }
    if(!charIsUnwanted){
      keepGoing = false;
    }
    else
    {
      unwantedEndCharIndex--;
    }
  }
  keyValueString = keyValueString.slice(unwantedBegCharIndex, unwantedEndCharIndex+1);
  return keyValueString;
}

module.exports = parseDemographic;

