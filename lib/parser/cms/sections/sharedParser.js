





function setup(){
  modelTemplate = this.modelTemplate;
  sectionUnfoundKeys = this.sectionUnfoundKeys;
  commonModelUnfoundKeys  = this.commonModelUnfoundKeys;
  commonModels = this.commonModels;
  commonModelFunctionRouter = this.commonModelFunctionRouter;
  defaultValues = this.defaultValues;
  unusedData = {};
}



function parseSection(intObj){ //can probably refactor this out into one section
  var unfinishedModels = {};//this keeps track of all objects that not finished yet
  //this template is from a json file that could be easily changed.
  if(intObj instanceof Array){ // start recursing thorugh the array of objects
    var sectionChildArray = [];
    for(var x = 0; x < intObj.length; x++){
      var newChild = processChild(intObj[x]);
      if ((Object.keys(newChild).length) > 0){
         sectionChildArray.push(newChild);
       }
     }
  }
    return sectionChildArray;
  }






function processChild(childObj){
    var newChildModel = {};
    var unfinishedValueTemplates ={};
    for(var childKey in childObj){
        //overwrite case checking here, so that it's more robust.s\
        //using the backup key mapper
        childKey = childKey.toLowerCase();
        var bbKey = childKey;// blue button key
        if (!(childKey in modelTemplate) && childKey in sectionUnfoundKeys){
          bbKey = sectionUnfoundKeys[childKey];
        }

        bbKey = bbKey.toLowerCase();

        if(bbKey in modelTemplate){
          //*******might want to trim keys and values anymore.
          var valueOfchildObj = childObj[childKey]; //CMS value
          var valueModel;
          var valueType; //can probably remove this later
          var unfilledKeys = [];
          if(bbKey in unfinishedValueTemplates){
            valueModel = unfinishedValueTemplates[bbKey]['template'];
            unfilledKeys = unfinishedValueTemplates[bbKey]['unfilledKeys'];
            valueType = unfinishedValueTemplates[bbKey]['valueType'];
          }
          else{
            valueModel = modelTemplate[bbKey]; //structure of BB value
            valueType = getValueType(valueModel);
          }



          var valueTemplate = valueModelFinder(valueModel, 0);
          //**AT THIS POINT, if it's a peculiar case, i.e. name, then you need to find a way to somehow make an exception to the rule here.
          //I could probably wrap this in an object and pass it down.

          var valueIsArray = false;
          if(valueType instanceof Array){
            valueIsArray = true;
          }
          var writeValueResult = writeValue(childKey, bbKey, valueOfchildObj, valueTemplate, unfilledKeys, valueIsArray);//this needs to be changed to accomodate different functions later
          var templateComplete = writeValueResult[0];
          var finalValue = writeValueResult[1];
          if(!templateComplete){
            finalValue['valueType'] = valueType;
            unfinishedValueTemplates[bbKey] = finalValue;
          }
          else if(valueType instanceof Array){//rewrite the logic here
            if (bbKey in newChildModel){//if there's already an object in the array
              newChildModel[bbKey].push(finalValue['template']);
            }
            else{//otherwise make a new array
              newChildModel[bbKey] = [];
              newChildModel[bbKey].push(finalValue['template']);
            }
            delete unfinishedValueTemplates[bbKey];
          }
          else if(valueType instanceof Object && !(valueType instanceof Array)){
            newChildModel[bbKey] = finalValue['template'];
            delete unfinishedValueTemplates[bbKey];
          }
        }
        else{
          var newError = "Cannot map " + childKey + " to BB.js";
        }
      }
      return newChildModel;
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
function valueModelFinder(objValue, recursionDepth){
  if(objValue instanceof Array){
    //if it is in array format, then objValue only has one value by default, aka an object
    return valueModelFinder(objValue[0], recursionDepth+1);
  }
  else if(recursionDepth == 0 && /^\{[\S\s]+\}$/.test(objValue)){ ///means that this line is a single field type
    var newObjValue = objValue.slice(1, objValue.length - 1);
    if(!(newObjValue in commonModels)){
      return convertStringToJSON(objValue);
    }

  }
  if (typeof(objValue) == 'string'){ //might need replacing here.
    var testBrackets1 = /\{[\S\s]+\}/;
    var testBrackets2 = /\[[\S\s]+\]/;
    if(testBrackets1.test(objValue) || testBrackets2.test(objValue)){
      var newObjValue = objValue.slice(1, objValue.length -1 );
      return valueModelFinder(newObjValue, recursionDepth +1);
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
    return objValue;
  }
  else if(typeof(objValue) == 'object'){
    return objValue;
  }
  else{
    return null;
  }
}



//writes the value onto the given template, returns whether the template is complete and the associated object
function writeValue(intKey, bbKey, valueOfIntObj, valueTemplate, unfilledKeys, valueIsArray){

  /*case 1, the object has a field and a required section. In this case,
   just write the value, ignore required */
   //console.log(valueTemplate);
   var commonModelExceptions = commonModelFunctionRouter.sections;
    var templateFinished = false;
    if(valueTemplate['required']  && valueTemplate['type'] && Object.keys(valueTemplate).length == 2){
      templateFinished = true;
      var returnObj = {};
      if(valueOfIntObj.length > 0){
        returnObj['template'] = valueOfIntObj;
      }
      returnObj['unfilledKeys'] = [];
      return [templateFinished, returnObj];
    }

    //********THIS CODE WAS MADE FOR THE PURPOSE OF OBJECT WITHIN AN OBJECT*********
   if(valueTemplate in commonModelExceptions){

    var commonModelFunction = commonModelFunctionRouter.getCommonModelFunction(valueTemplate);
    valueTemplate = commonModelFunction(valueOfIntObj);
    templateFinished = true;
   }

  else if(unfilledKeys.length == 0){//initial loading of unfilled keys.
    for(var key in valueTemplate){
      if(bbKey in defaultValues && key in defaultValues[bbKey]&& valueIsArray){ ///////////////////NEED TO MODIFY THIS PART TO BECOME MORE ACCOMODATING
          valueTemplate[key] = defaultValues[bbKey][key]; //set default values, i.e. primary to true
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
  var templateDetails = templateValue;
  if(typeof(templateValue) == 'string'){
    templateDetails = convertStringToJSON(templateValue);
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

function convertStringToJSON(templateString){
  var cleanString = trimStringEnds(templateString, ['{', '}', '[', ']']);
  var templateArray= cleanString.split(',');
  var templateDetails = {};
  for(var x in templateArray){
    var keyValueSplit = templateArray[x].split(':');
    templateDetails[keyValueSplit[0].trim()] = keyValueSplit[1].trim();
  }

  return templateDetails;


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

module.exports.parseSection = parseSection;
module.exports.getJSON = getJSON;
module.exports.setup = setup;
