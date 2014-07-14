//main file for CMS parser.

var cmsObjConverter = require('./cmsObjConverter');
var txtToIntObj = require('./cmsTxtToIntObj').getIntObj;

//parses CMS BB text format into BB JSON

function parseCMS(fileString) {
    var intObj = txtToIntObj(fileString);
    var result = cmsObjConverter.convertToBBModel(intObj);

    return result;

}

//return interim object/JSON as well

function parseCMS_2(fileString) {
    var intObj = txtToIntObj(fileString);
    var result = cmsObjConverter.convertToBBModel(intObj);
    result.interim = intObj;

    return result;
}

module.exports = {
    "parseCMS": parseCMS,
    "parseCMS_2": parseCMS_2
};
