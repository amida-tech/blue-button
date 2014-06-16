

var sharedParser = require('./sharedParser.js');
var getJSON = sharedParser.getJSON;


function parseImmunizations(sectionObj){

  //setup templates for common function

  sharedParser.modelTemplate = getJSON('./sections/Models/medications.json');
  sharedParser.sectionUnfoundKeys = getJSON('./sections/unfoundKeyDict/medicationsDict.json');
  sharedParser.commonModelUnfoundKeys  = getJSON('./sections/unfoundKeyDict/commonModelDict.json');
  sharedParser.commonModels = getJSON('./sections/Models/commonModels.json');
  sharedParser.commonModelFunctionRouter = require('./commonModelFunctionRouter.js');
  sharedParser.defaultValues = getJSON('./sections/Models/defaultValues.json');
  sharedParser.setup();

  /*apply special functions to medications, take out the fields from original cms
  parser, store them in an intermediary object.*/


  var specialResult = {};
  var specialIndex = 0;
  /*Ultimately, this code is for the sole purpose of rerunning medications
  code on allergies */

  var productKeys = ['drug name', 'comments'];
  for(var key in sectionObj){
    var child = sectionObj[key];
    var childObj = {};
    for( var x in productKeys){
      var productKey = productKeys[x];
      if (productKey in child && child[productKey].length > 0){
        var resultType = child[productKey].toLowerCase();
        childObj['product'] = processProduct(child);
        specialResult[specialIndex] = childObj;
        specialIndex++;
        }
      /*be selective about what sections you want to pass into shared parser
       you don't want to pass a section with a blank entry for comments. */
      if(productKey in child && child[productKey].length <=0){
        delete sectionObj[key];
      }


    }
  }

  var result = sharedParser.parseSection(sectionObj);
  //console.log(result);
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

  //check to make sure that there isn't any bad entries, clean up
  console.log(result);




  //delete result['source'];


  //console.log(result);
  //extremely crare case when you DON'T want the corresponding field to be included
  return result;
}




module.exports = parseImmunizations;
