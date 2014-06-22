var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;



function parseProblems(intObj) {

    //setup templates for common function
    sharedParser.modelTemplate = getJSON('/Models/problems.json');
    sharedParser.sectionUnfoundKeys = getJSON('/unfoundKeyDict/problemsDict.json');
    sharedParser.commonModelUnfoundKeys = getJSON('/unfoundKeyDict/commonModelDict.json');
    sharedParser.commonModels = getJSON('/Models/commonModels.json');
    sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
    sharedParser.defaultValues = getJSON('/Models/defaultValues.json');

    sharedParser.setup();

    var result = sharedParser.parseSection(intObj);
    //need to add codes and different stuff here, next level parsing.
    return result;
}



module.exports = parseProblems;
