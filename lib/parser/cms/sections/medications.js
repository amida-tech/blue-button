var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;


function parseMedications(sectionObj) {

    //setup templates for common function
    sharedParser.modelTemplate = getJSON('/Models/medications.json');
    sharedParser.sectionUnfoundKeys = getJSON('/unfoundKeyDict/medicationsDict.json');
    sharedParser.commonModelUnfoundKeys = getJSON('/unfoundKeyDict/commonModelDict.json');
    sharedParser.commonModels = getJSON('/Models/commonModels.json');
    sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
    sharedParser.defaultValues = getJSON('/Models/defaultValues.json');
    sharedParser.setup();

    /*apply special functions to medications, take out the fields from original cms
  parser, store them in an intermediary object.*/


    var specialResult = {};
    var specialIndex = 0;
    var child;
    /*Ultimately, this code is for the sole purpose of rerunning medications
  code on allergies */

    var productKeys = ['drug name', 'comments'];
    for (var key in sectionObj) {
        child = sectionObj[key];
        var childObj = {};
        for (var x in productKeys) {
            var productKey = productKeys[x];
            if (productKey in child && child[productKey].length > 0) {
                var resultType = child[productKey].toLowerCase();
                childObj.product = processProduct(child);
                specialResult[specialIndex] = childObj;
                specialIndex++;
            }
            /*be selective about what sections you want to pass into shared parser
       you don't want to pass a section with a blank entry for comments. */
            if (productKey in child && child[productKey].length <= 0) {
                delete sectionObj[key];
            }


        }
    }

    var result = sharedParser.parseSection(sectionObj);
    //combine the two results together

    for (var rKey in result) {
        child = result[rKey];

        if (Object.keys(child).length === 0) {
            result.splice(rKey, 1);
        }
        var specialChild = specialResult[rKey];
        for (var item in specialChild) {
            child[item] = specialChild[item];
        }
    }

    //extremely crare case when you DON'T want the corresponding field to be included
    return result;
}


function processProduct(childObj) {
    var productObj = {};
    var drugName;
    var parseCodedEntry = commonModelFunctionRouter.getCommonModelFunction(
        'cda_coded_entry', 'special');
    if ('drug name' in childObj) {
        drugName = parseCodedEntry(childObj['drug name']);
        productObj.product = drugName;
        productObj.unencoded_name = childObj['drug name'];
    } else if ('comments' in childObj) {
        //do check to make sure comments has a drug
        drugName = parseCodedEntry(childObj.comments);
        productObj.product = drugName;
        productObj.unencoded_name = childObj.comments;
    }

    return productObj;
}





module.exports = parseMedications;
