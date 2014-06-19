

var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;

function parseAllergies(sectionObj){

  //setup templates for common function
  sharedParser.modelTemplate = getJSON('/Models/allergies.json');
  sharedParser.sectionUnfoundKeys = getJSON('/unfoundKeyDict/allergiesDict.json');
  sharedParser.commonModelUnfoundKeys  = getJSON('/unfoundKeyDict/commonModelDict.json');
  sharedParser.commonModels = getJSON('/Models/commonModels.json');
  sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
  sharedParser.defaultValues = getJSON('/Models/defaultValues.json');


  sharedParser.setup();

  /*apply special functions to allergies, take out the fields from original cms
  parser, store them in an intermediary object.*/

  specialResult = {};
  var child;
  var specialIndex = 0;
  //complex functions applied here first
  for (var key in sectionObj)
  {

    child = sectionObj[key];
    var childObj = {};
    if('reaction' in child){
      childObj.reaction = processReactions(child);
      specialResult[specialIndex] = childObj;
      specialIndex++;
    }
  }
  //regular parser applied here
  var result = sharedParser.parseSection(sectionObj);

  //join results together
  for (var rKey in result){
    child = result[rKey];
    if(Object.keys(child).length === 0){
      result.splice(rKey, 1);
    }
    var specialChild = specialResult[rKey];
    for (var item in specialChild){
      child[item] = specialChild[item];
    }
  }

  return result;
}



function processReactions(childObj){
  var reactionObj = {};
  var parseCodedEntry = commonModelFunctionRouter.getCommonModelFunction(
    'cda_coded_entry', 'special');
  //need to add in codes and stuff later.
  if('reaction' in childObj){
    var reactionName = childObj.reaction;
    reactionObj.reaction = parseCodedEntry(reactionName);
    delete childObj.reaction;
  }
  if('severity' in childObj){
    reactionObj.severity = childObj.severity;
    delete childObj.severity;
  }
  return reactionObj;


}



module.exports = parseAllergies;
