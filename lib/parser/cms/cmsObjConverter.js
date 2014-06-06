//converts CMS Object to the BB.js

cmsParser = require('./cmsParser');
//var intObj = cmsParser.parseCMS('sample2.txt'); //intermediate Object

//take the JavaScript Object Model
var fs = require('fs');
var rawData = fs.readFileSync('commonModels.json').toString();


var obj = JSON.parse(rawData);
console.log(obj);
//var demographics = obj[demographic];

//parseDemographic(obj);
//var commonModels = JSON.parse('');
//console.log(commonModels);


//do I need to go


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




