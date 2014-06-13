
var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;



function parseDemographics(intObj){



  sharedParser.modelTemplate = getJSON('./sections/Models/problems.json');
  sharedParser.sectionUnfoundKeys = getJSON('./sections/unfoundKeyDict/problemsDict.json');
  sharedParser.commonModelUnfoundKeys = getJSON('./sections/unfoundKeyDict/commonModelDict.json');
  sharedParser.commonModels = getJSON('./sections/Models/commonModels.json');
  sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
  sharedParser.defaultValues = getJSON('./sections/Models/defaultValues.json');


  //setup templates for common function
  sharedParser.modelTemplate  = getJSON('./sections/Models/demographics.json');
  sharedParser.sectionUnfoundKeys= getJSON('./sections/unfoundKeyDict/demographicsDict.json');
  sharedParser.commonModelUnfoundKeys = getJSON('./sections/unfoundKeyDict/commonModelDict.json');

  sharedParser.commonModels  = getJSON('./sections/Models/commonModels.json');
  sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
  sharedParser.defaultValues = getJSON('./sections/Models/defaultValues.json');
  sharedParser.setup();

  var result = sharedParser.parseSection(intObj);
  return result;
}

module.exports = parseDemographics;
