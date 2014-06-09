//converts CMS Object to the BB.js

cmsParser = require('./cmsParser');
//var intObj = cmsParser.parseCMS('sample2.txt'); //intermediate Object

//take the JavaScript Object Model
var fs = require('fs');

jsonGetter('./Models/documentModel.json');



function jsonGetter(filename){

  var rawData = fs.readFileSync(filename).toString();


  var obj = JSON.parse(rawData);
  //var demographics = obj[demographic];

  //parseDemographic(obj);
  //var commonModels = JSON.parse('');
  console.log(obj);


}



// Intermediate JSON is the initially converted JSON model from raw data, convert model based on
//
function convertToBBModel(intermediateJSON, sectionObjectModels){

  //load up the entire document model
  // **need to have a function that maps each section of the cms to each section
  // of the bb model



  for(var key in intermediateJSON){
    if( key in sectionObjectModels){
      //call that particular function in sectionObjectModels
    var intermediateJSONValue = intermediateJSONValue[key];
    sectionObjectModels[key](intermediateJSONValue);
    }
  }
}





function parseDemographic(intObj){
  /* Object that contains fields as keys that point to functions that process
  the value of that key. For example if there is a field called 'address' in
  demoFieldFunctions, then the value form demoFieldFunctions point to a
  specific function that processes the address.  */

  var demoFieldFunctions = {};
  for(var key in intObj)
  {
    if(typeof intObj[key] == 'object' ){// if the value is an object, then
      //you should go in depth one more level, aka recurse
      parseDemographic(intObj);
    }
    else{
      if(key in demoFieldFunctions) {
        var fieldValue = intObj[key];
        demoFieldFunctions[key](fieldValue);

      }
    }
  }
}



function parseDemographic(intObj){
  for(var key in intObj)
  {
    if(typeof intObj[key] == 'object' ){// if the value is an object, then
      //you should go in depth one more level
      parseDemographic(intObj);
    }
    else{

      /*think about how you want to do this part.
        Approaches:
          Hard coding? -> nah. It's not a good idea. Too many lines.
          1. Load a list of keys from a file in another place.
            check if object has certain set of properties, in order. Go from most likely to least likely.
              IF there is a match, then start processsing the object.
                use some kind of Object or something to  CMS keys to CCDA keys. This mapping should have

            if it has a certain property,
*/

    }
  }
}

// get the object that maps a field to a function that processes that field.
function defineDemoFieldFunctions(){
  var demoFieldFunctions = {};







}




function getCDANameObject(nameStrng)
{





  }








