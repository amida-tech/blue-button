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

    var keyMap = getJSON('./sections/sectionKeyMapper.json');
    //console.log(keyMap);
    //sectionName = keyMap[sectionName];
    if (sectionName in sections) {
        if(sections[sectionName] != null){
          //console.log(sectionName);
        return sections[sectionName];
      }
    }
    else {
        return null;
    }
};

function getJSON(filename){
  var fs = require('fs');
  var rawData = fs.readFileSync(filename).toString();
  var obj = JSON.parse(rawData);
  return obj;
};

module.exports.sectionRouter = sectionRouter;
