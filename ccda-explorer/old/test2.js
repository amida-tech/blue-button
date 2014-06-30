var f="../sample_ccdas/EMERGE/Patient-164.xml";
//f="./test.xml";
//f="../sample_ccdas/Kinsights Samples/kinsights-sample-timmy.xml";

//var bb = require("blue-button");
var bb = require("../../../amida-tech/blue-button/index.js");

var fs=require("fs");


/*

    ccda_ccd: require("./ccda/ccd").CCD,
    ccda_demographics: require("./ccda/demographics").patient,
    ccda_vitals: require("./ccda/sections/vitals").vitalSignsSection,
    ccda_medications: require("./ccda/sections/medications").medicationsSection,
    ccda_problems: require("./ccda/sections/problems").problemsSection,
    ccda_immunizations: require("./ccda/sections/immunizations").immunizationsSection,
    ccda_results: require("./ccda/sections/results").resultsSection,
    ccda_allergies: require("./ccda/sections/allergies").allergiesSection,
    ccda_encounters: require("./ccda/sections/encounters").encountersSection,
    ccda_procedures: require("./ccda/sections/procedures").proceduresSection,
    ccda_socialHistory: require("./ccda/sections/socialHistory").socialHistorySection


*/

var data = fs.readFileSync(f).toString();
//var data = fs.readFileSync("../../amida-tech/blue-button/test/fixtures/file-snippets/CCD_1_Problems.xml").toString();

var r = bb.xml(data);
var j = bb.parseXml(r, {component:"ccda_ccd"});

//var j=bb.parseString(data, {component:"ccda_allergies"});

//var j=bb.parseString(data, {component:"ccda_immunizations"});

//var j=bb.parseString(data, {component:"ccda_allergies"});

//console.log(j);

//console.log(JSON.stringify(j, null, 4));

console.log(j);
