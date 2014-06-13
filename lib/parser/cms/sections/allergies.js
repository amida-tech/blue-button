

var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;






function parseAllergies(intObj){

  //setup templates for common function
  sharedParser.modelTemplate = getJSON('./sections/Models/allergies.json');
  sharedParser.sectionUnfoundKeys = getJSON('./sections/unfoundKeyDict/allergiesDict.json');
  sharedParser.commonModelUnfoundKeys  = getJSON('./sections/unfoundKeyDict/commonModelDict.json');
  sharedParser.commonModels = getJSON('./sections/Models/commonModels.json');
  sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
  sharedParser.defaultValues = getJSON('./sections/Models/defaultValues.json');


  sharedParser.setup();

  var result = sharedParser.parseSection(intObj);
  return result;
}



module.exports = parseAllergies;
