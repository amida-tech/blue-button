var sections = {
    'meta': (function(intObj){return intObj;}),
    'demographic': require('./sections/demographics.js'),
    'self reported medical conditions': require('./sections/problems.js'),
    'self reported allergies': require('./sections/allergies.js'),
    'self reported labs and tests': require('./sections/results.js'),
    "drugs": require('./sections/medications.js'),
    "self reported vital statistics": require('./sections/vitals.js'),
    "self reported immunizations": require('./sections/immunizations.js')
};



var sectionRouter = function(sectionName) {
    if (sectionName in sections) {
        if (sections[sectionName] !== null) {
            return sections[sectionName];
        }
    } else {
        return null;
    }
};

function getJSON(filename) {
    var fs = require('fs');
    var rawData = fs.readFileSync(__dirname + filename).toString();
    var obj = JSON.parse(rawData);
    return obj;
}


module.exports.sectionRouter = sectionRouter;
