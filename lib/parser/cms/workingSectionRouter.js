var sections = {
  'Demographic': require('./sections/demographics.js'),
'Self Reported Medical Conditions':require('./sections/problems.js'),
'Self Reported Allergies':require('./sections/allergies.js'),
'Self Reported Labs and Tests': require('./sections/results.js'),
"Drugs": require('./sections/medications.js'),
"Self Reported Vital Statistics": require('./sections/vitals.js'),
"Self Reported Immunizations": require('./sections/immunizations.js')
};

var sectionRouter = function(sectionName) {
    var keyMap = getJSON('/sections/sectionKeyMapper.json');
    if (sectionName in sections) {
        if(sections[sectionName] !== null){
        return sections[sectionName];
      }
    }
    else {
        return null;
    }
};

function getJSON(filename){
  var fs = require('fs');
  var rawData = fs.readFileSync(__dirname +filename).toString();
  var obj = JSON.parse(rawData);
  return obj;
}


module.exports.sectionRouter = sectionRouter;
