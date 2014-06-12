


var demographicsModelTemplate = getJSON('./sections/Models/demographics.json');
var demographicsUnfoundKeys = getJSON('./sections/unfoundKeyMaps/demographics.json');
var commonModelUnfoundKeys = getJSON('./sections/unfoundKeyMaps/commonModel.json');

var commonModels = getJSON('./sections/Models/commonModels.json');
var defaultValues = getJSON('./sections/Models/defaultValues.json');
//console.log(defaultValues);
var newDemographicsModel = {};

function parseDemographic(intObj){ //can probably refactor this out
  var unfinishedModels = {};//this keeps track of all objects that not finished yet
  //this template is from a json file that could be easily changed.
  //console.log(intObj.constructor);
  //console.log(intObj instanceof Array);
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
          //console.log("key in original model: "+ key);
          //*******might want to trim keys and values anymore.
          var valueOfIntObj = intObj[intKey]; //CMS value
          var valueModel;
          var unfilledKeys = [];
          if(bbKey in unfinishedValueTemplates){
            valueModel = unfinishedValueTemplates[bbKey]['template'];
            unfilledKeys = unfinishedValueTemplates[bbKey]['unfilledKeys'];
          }
          else{
            valueModel = demographicsModelTemplate[bbKey]; //structure of BB value
          }
          //console.log(valueModel);
          //console.log(valueModelFinder(valueModel));

          var valueTemplate = valueModelFinder(valueModel);
          //console.log(valueTemplate);
          //I could probably wrap this in an object and pass it down.
          var writeValueResult = writeValue(intKey, valueOfIntObj, valueTemplate, unfilledKeys);//this needs to be changed to accomodate different functions later
          var templateComplete = writeValueResult[0];
          var finalValue = writeValueResult[1];
          //console.log(writeValueResult);
          //console.log(templateComplete);
          var valueType = getValueType(valueModel); // the type of BB value, need to fix this later

          //console.log(finalValue);
          if(!templateComplete){
            unfinishedValueTemplates[bbKey] = finalValue;
          }
          else if(valueType instanceof Array){//rewrite the logic here
            if (bbKey in newDemographicsModel){//if there's already an object in the array
              newDemographicsModel[bbKey].push(finalValue['template']);
            }
            else{//otherwise make a new array
              newDemographicsModel[bbKey] = [finalValue['template']];
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
  //console.log(objValue); //convert this all into typeof


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
  //console.log(objValue)
  //console.log(typeof(objValue));
  //console.log(objValue.constructor);
  if(objValue instanceof Array){
    //if it is in array format, then objValue only has one value by default, aka an object
    //console.log("0th index:"+ objValue[0].constructor);
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
      var modelFormat = commonModels[objValue];
      var modelFormatCopy = JSON.parse(JSON.stringify(modelFormat));
      return modelFormatCopy;
      //console.log(modelFormat);
      //get the common model's function
    }
    return null;
  }
  else if(typeof(objValue) == 'object'){
    //console.log("is an object");
    //console.log(objValue);
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
  var templateFinished = false;
  if(unfilledKeys.length == 0){//initial loading of unfilled keys.
    for(var key in valueTemplate){
      if(key in defaultValues){
        valueTemplate[key] = defaultValues[key]; //set default values, i.e. primary to tru
      }
      else{
        unfilledKeys.push(key);//otherwise put this in a list of unaccounted variables
      }
     }
 }
   //console.log(commonModelUnfoundKeys);
   if (intKey in commonModelUnfoundKeys){
      intKey = commonModelUnfoundKeys[intKey];
    }

   if(unfilledKeys.indexOf(intKey) > -1 ){ //this also needs to be put in an object later.
      //console.log(intKey);
      valueTemplate[intKey] = valueOfIntObj;
      var i = unfilledKeys.indexOf(intKey);
      unfilledKeys.splice(i, 1);
      //console.log(unfilledKeys);
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
     valueTemplate[unfilledKeys[0]] = valueOfIntObj;
     templateFinished = true;
     //delete unfilledKeys[0];
  }

 var returnObj = {};
  returnObj['template'] = valueTemplate;
  returnObj['unfilledKeys'] = unfilledKeys;

  //console.log(returnObj);
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


function getJSON(filename){
  var fs = require('fs');
  var rawData = fs.readFileSync(filename).toString();
  var obj = JSON.parse(rawData);
  return cleanKeys(obj);
}
module.exports = parseDemographic;

