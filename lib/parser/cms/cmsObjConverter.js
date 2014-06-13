//converts CMS Object to the BB.js

var cmsParser = require('./cmsParser');
var sectionRouter = require('./workingSectionRouter').sectionRouter;
var documentKeyMapper = getJSON('./sections/unfoundKeyDict/documentDict.json');
var fs = require('fs');

//console.log(cmsParser.parseCMS();

//testing purposes here
var fileString = fs.readFileSync('sample2.txt').toString();
var intObj = cmsParser.parseCMS(fileString); //intermediate Object
var bbModel = convertToBBModel(intObj);


  var outputFilename = './result.JSON';

fs.writeFile(outputFilename, JSON.stringify(bbModel, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
});
//console.log("entire model");
//console.log(bbModel);
function getJSON(filename){
  var fs = require('fs');
  var rawData = fs.readFileSync(filename).toString();
  var obj = JSON.parse(rawData);
  return obj;
}


// Intermediate JSON is the initially converted JSON model from raw data, convert model based on
//
function convertToBBModel(intermediateObj){

  //load up the entire document model
  // **need to have a function that maps each section of the cms to each section
  // of the bb model
  var bbDocumentModel = getJSON('./Sections/Models/documentModel.json');
  for(var key in intermediateObj){

    var sectionProcessFunction = sectionRouter(key);

    if(sectionProcessFunction){
      //console.log(intermediateObj[key]);
      var section = intermediateObj[key];
      var parsedSection = sectionProcessFunction(section);
      console.log(parsedSection);
      putDataInBBModel(key, parsedSection, bbDocumentModel);
    }

  }
  return bbDocumentModel;
}

function putDataInBBModel(key, parsedSection, bbDocumentModel){
  key = key.toLowerCase();
  if (key in documentKeyMapper){
    key = documentKeyMapper[key];
  }
  if(key in bbDocumentModel)
  {
    if(typeof bbDocumentModel[key] =='object'){
      bbDocumentModel[key] = parsedSection;
    }
    else{
      bbDocumentModel[key].push(parsedSection);
    }
  }
  else if('data' in bbDocumentModel)
  {
    putDataInBBModel(key,parsedSection, bbDocumentModel['data']);
  }
  return bbDocumentModel;
}











