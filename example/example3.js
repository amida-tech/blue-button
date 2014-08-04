var validator = require("../index.js").validator;
//var bb = JSON.parse(fs.readFileSync(__dirname + '/CCD1.json', 'utf8'));
//var data = fs.readFileSync("CCD_1.xml").toString();

var bb = require("../index.js");
var fs = require("fs");

var data = fs.readFileSync("CCD_1.xml").toString();

var result = bb.parseString(data);

fs.writeFileSync("example3.json", JSON.stringify(result, null, 4));

console.log(JSON.stringify(result.data.social_history, null, 4));

var val = validator.validateDocumentModel(result);

console.log(val);
console.log(JSON.stringify(validator.getLastError(),null,4));

//console.log("date type: ",typeof result.data.vitals[3].date[0].date);
//console.log(JSON.stringify(result.data.vitals[3].date[0].date));


data = fs.readFileSync("example3_mod.json").toString();
result = JSON.parse(data);

val = validator.validateDocumentModel(result);

console.log(val);
//console.log(JSON.stringify(validator.getLastError(),null,4));

//console.log("date type: ",typeof result.data.vitals[3].date[0].date);
//console.log(JSON.stringify(result.data.vitals[3].date[0].date));

val = validator.validateSectionObj(result.data.allergies[0], 'allergy');


console.log(val);
//console.log(JSON.stringify(validator.getLastError(),null,4));

