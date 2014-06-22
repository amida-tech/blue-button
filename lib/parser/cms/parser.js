//main file for CMS parser.


cmsObjConverter = require('./cmsObjConverter');
txtToIntObj = require('./cmsTxtToIntObj').getIntObj;



function parseCMS(fileString){
  var intObj = txtToIntObj(fileString);
  return cmsObjConverter.convertToBBModel(intObj);

}

module.exports.parseCMS = parseCMS;

