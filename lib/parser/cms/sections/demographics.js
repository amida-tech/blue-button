var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;



function parseDemographics(intObj) {

    //setup templates for common function
    sharedParser.modelTemplate = getJSON('/Models/demographics.json');
    sharedParser.sectionUnfoundKeys = getJSON('/unfoundKeyDict/demographicsDict.json');
    sharedParser.commonModelUnfoundKeys = getJSON('/unfoundKeyDict/commonModelDict.json');

    sharedParser.commonModels = getJSON('/Models/commonModels.json');
    sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
    sharedParser.defaultValues = getJSON('/Models/defaultValues.json');
    sharedParser.setup();

    var result = sharedParser.parseSection(intObj);
    return result;
}

module.exports = parseDemographics;
