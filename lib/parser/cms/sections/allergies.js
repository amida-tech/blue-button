

var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;






function parseAllergies(sectionObj){

  //setup templates for common function
  sharedParser.modelTemplate = getJSON('./sections/Models/allergies.json');
  sharedParser.sectionUnfoundKeys = getJSON('./sections/unfoundKeyDict/allergiesDict.json');
  sharedParser.commonModelUnfoundKeys  = getJSON('./sections/unfoundKeyDict/commonModelDict.json');
  sharedParser.commonModels = getJSON('./sections/Models/commonModels.json');
  sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
  sharedParser.defaultValues = getJSON('./sections/Models/defaultValues.json');


  sharedParser.setup();

  /*apply special functions to allergies, take out the fields from original cms
  parser, store them in an intermediary object.*/

  specialResult = {};

  var specialIndex = 0;
  for (var key in sectionObj)
  {

    var child = sectionObj[key];
    var childObj = {};
    if('reaction' in child){
      childObj['reaction'] = processReactions(child);
      specialResult[specialIndex] = childObj;
      specialIndex++;
    }
  }
  var result = sharedParser.parseSection(sectionObj);


  for (var key in result){
    var child = result[key];
    if(Object.keys(child).length == 0){
      result.splice(key, 1);
    }
    var specialChild = specialResult[key];
    for (var item in specialChild){
      child[item] = specialChild[item];
    }
  }



  //delete result['source'];


  //console.log(result);
  //extremely crare case when you DON'T want the corresponding field to be included



  return result;
}



function processReactions(childObj){
  var reactionObj = {};
  var parseCodedEntry = commonModelFunctionRouter.getCommonModelFunction(
    'cda_coded_entry', 'special');
  //need to add in codes and stuff later.
  if('reaction' in childObj){
    var reactionName = childObj['reaction'];
    reactionObj['reaction'] = parseCodedEntry(reactionName);
    delete childObj['reaction'];
  }
  if('severity' in childObj){
    reactionObj['severity'] = childObj['severity'];
    delete childObj['severity'];
  }
  return reactionObj;




}



module.exports = parseAllergies;
