//converts CMS Object to the BB.js

var txtToIntObj = require('./cmsTxtToIntObj');
var sectionRouter = require('./workingSectionRouter').sectionRouter;
var documentKeyMapper = getJSON('/sections/unfoundKeyDict/documentDict.json');
var fs = require('fs');


//testing purposes here

/*
var fileString = fs.readFileSync('sample2.txt').toString();
var intObj = txtToIntObj.getIntObj(fileString); //intermediate Object
var bbModel = convertToBBModel(intObj);
*/

/*
var outputFilename = __dirname+ '../bbModel.json';
fs.writeFile(outputFilename, JSON.stringify(bbModel, null, 4), function(err
) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
});
*/

function getJSON(filename) {
    var fs = require('fs');
    var rawData = fs.readFileSync(__dirname + filename).toString();
    var obj = JSON.parse(rawData);
    return obj;
}


// Intermediate JSON is the initially converted JSON model from raw data, convert model based on
//

function convertToBBModel(intermediateObj) {

    //load up the entire document model
    // **need to have a function that maps each section of the cms to each section
    // of the bb model
    var bbDocumentModel = getJSON('/sections/Models/documentModel.json');
    //first round of processing, by section
    for (var key in intermediateObj) {
        //console.log(key);
        var sectionProcessFunction = sectionRouter(key);
        if (sectionProcessFunction) {
            var section = intermediateObj[key].data;
            var returnedObj = sectionProcessFunction(section);
            //console.log(returnedObj);
            var parsedSection = returnedObj;
            putDataInBBModel(key, parsedSection, bbDocumentModel);
        }
    }

    /*might want to do some alerting to see which section to process again, based
  on what kind of information there is left. For instance, allergies has
  treatments and one of them has a drug in it. */

    //for now, just process the allergy section.

    var allergiesSection = intermediateObj['self reported allergies'].data;
    var allergiesRerunKey = 'drugs';
    var complexProcessFunction = sectionRouter(allergiesRerunKey);
    var newSection = complexProcessFunction(allergiesSection);
    putDataInBBModel(allergiesRerunKey, newSection, bbDocumentModel);


    return bbDocumentModel;
}

/*
function cleanParsedSetion(parsedSection) {

    for (var x in parsedSection) {
        if (Object.keys(parsedSection[x]).length === 0) {
            parsedSection.splice(x, 1);
        }
    }
    return parsedSection;
}
*/



function putDataInBBModel(key, parsedSection, bbDocumentModel) {
    key = key.toLowerCase();
    if (key in documentKeyMapper) {
        key = documentKeyMapper[key];
    }
    if (key in bbDocumentModel) {
        if (bbDocumentModel[key] instanceof Array) {
            if (parsedSection instanceof Array) {
                for (var x in parsedSection) {
                    bbDocumentModel[key].push(parsedSection[x]);
                }
            } else {
                bbDocumentModel[key].push(parsedSection);
            }
        } else if (typeof bbDocumentModel[key] == 'object') {
            if (parsedSection instanceof Array) {
                for (var y in parsedSection) {
                    bbDocumentModel[key] = parsedSection[y];
                }
            }
        }
    } else if ('data' in bbDocumentModel) {
        putDataInBBModel(key, parsedSection, bbDocumentModel.data);
    }
    return bbDocumentModel;
}



module.exports.convertToBBModel = convertToBBModel;
