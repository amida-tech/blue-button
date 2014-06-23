var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;



function parseInsurances(intObj) {

    //setup templates for common function
    sharedParser.modelTemplate = getJSON('./sections/Models/insurance.json');
    sharedParser.sectionUnfoundKeys = getJSON('./sections/unfoundKeyDict/insuranceDict.json');
    sharedParser.commonModelUnfoundKeys = getJSON('./sections/unfoundKeyDict/commonModelDict.json');
    sharedParser.commonModels = getJSON('./sections/Models/commonModels.json');
    sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
    sharedParser.defaultValues = getJSON('./sections/Models/defaultValues.json');
    sharedParser.setup();

    var result = sharedParser.parseSection(intObj);
    return result;


}

module.exports = parseInsurances;
