 var commonFunctions = require('./sections/commonFunctions');

var sections = {
    'meta': getMeta,
    'demographic': require('./sections/demographics.js'),
    'self reported medical conditions': require('./sections/problems.js'),
    'self reported allergies': require('./sections/allergies.js'),
    'self reported labs and tests': require('./sections/results.js'),
    "drugs": require('./sections/medications.js'),
    "self reported vital statistics": require('./sections/vitals.js'),
    "self reported immunizations": require('./sections/immunizations.js')
};

function getMeta(intObj){
    intObj = intObj[0];
    var processDate = commonFunctions.getFunction('cda_date');
    var dateString = intObj.timestamp;
    var dateObj = processDate(dateString);
    return intObj;
}




var sectionRouter = function(sectionName) {
    if (sectionName in sections) {
        if (sections[sectionName] !== null) {
            return sections[sectionName];
        }
    } else {
        return null;
    }
};

module.exports.sectionRouter = sectionRouter;
