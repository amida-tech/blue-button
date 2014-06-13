
module.exports.parseCMS = parseCMS;
module.exports.getTitles = getTitles;


cmsTxtToIntObj = require('./cmsTxtToIntObj.js')

//Test after refactoring
var fs = require('fs');

//console.log(cmsParser.parseCMS();

//testing purposes here
var fileString = fs.readFileSync('sample2.txt').toString();
var intObj = parseCMS(fileString); //intermediate Object
//var bbModel = convertToBBModel(intObj);

function parseCMS(cmsString){

  var intermediateObj = cmsTxtToIntObj.getIntObj(cmsString);
  return intermediateObj;
}


function getTitles(cmsString){
  return cmsTxtToIntObj.getTitles(cmsString);


}
