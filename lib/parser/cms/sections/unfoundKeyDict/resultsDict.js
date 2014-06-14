

var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;


function parseResults(sectionObj){

  //setup templates for common function
  sharedParser.modelTemplate = getJSON('./sections/Models/results.json');
  sharedParser.sectionUnfoundKeys = getJSON('./sections/unfoundKeyDict/resultsDict.json');
  sharedParser.commonModelUnfoundKeys  = getJSON('./sections/unfoundKeyDict/commonModelDict.json');
  sharedParser.commonModels = getJSON('./sections/Models/commonModels.json');
  sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
  sharedParser.defaultValues = getJSON('./sections/Models/defaultValues.json');


  sharedParser.setup();

  /*apply special functions to allergies, take out the fields from original cms
  parser, store them in an intermediary object.*/

  specialResult = {};

  //console.log(sectionObj);
  for (var key in sectionObj)
  {
    var child = sectionObj[key];
    var childObj = {};
    if('reaction' in child){
      childObj['reaction'] = processReactions(child);
      specialResult[key] = childObj;
    }
  }

  var result = sharedParser.parseSection(sectionObj);

  //combine the two results together
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



function processGlucoseLevels(sectionObj){




}



module.exports = parseResults;
