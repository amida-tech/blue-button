//CCDA to JSON parser.

"use strict";

var componentRouter = function (componentName, type) {

    console.log(type);

    if (componentName) {
        return generateComponents(type["type"])[componentName];
    } else {

        if (type["type"] === 'c32') {
            return generateComponents(type["type"]).c32_ccd;
<<<<<<< HEAD
        } else if (type["type"] === 'cda') {
=======
        } else if (type["type"] === 'cda-ccd') {
>>>>>>> FETCH_HEAD
            return generateComponents(type["type"]).cda_ccd;
        } else {
            return generateComponents(type["type"]).ccda_ccd;
        }
    }
};

var generateComponents = function (version) {

    version = version.indexOf("-") > -1 ? "_" + version.split("-")[1] : "";

    return {

        //Base CCD Object.
        cda_ccd: require("./cda/ccd").CCD(version),

        //Base C32 Object.
        c32_ccd: require("./c32/ccd").C32(version),
        c32_demographics: require("./c32/demographics").patient,
        c32_vitals: require("./c32/sections/vitals").vitalSignsSection,
        c32_medications: require("./c32/sections/medications").medicationsSection,
        c32_problems: require("./c32/sections/problems").problemsSection,
        c32_immunizations: require("./c32/sections/immunizations").immunizationsSection,
        c32_results: require("./c32/sections/results").resultsSection,
        c32_allergies: require("./c32/sections/allergies").allergiesSection,
        c32_encounters: require("./c32/sections/encounters").encountersSection,
        c32_procedures: require("./c32/sections/procedures").proceduresSection,

        //exposing individual entries just in case
        c32_vitals_entry: require("./c32/sections/vitals").vitalSignsEntry,
        c32_medications_entry: require("./c32/sections/medications").medicationsEntry,
        c32_problems_entry: require("./c32/sections/problems").problemsEntry,
        c32_immunizations_entry: require("./c32/sections/immunizations").immunizationsEntry,
        c32_results_entry: require("./c32/sections/results").resultsEntry,
        c32_allergies_entry: require("./c32/sections/allergies").allergiesEntry,
        c32_encounters_entry: require("./c32/sections/encounters").encountersEntry,
        c32_procedures_entry: require("./c32/sections/procedures").proceduresEntry,

        //CCDA domains.
        ccda_ccd: require("./ccda/ccd").CCD(version),
        ccda_demographics: require("./ccda/demographics").patient,
        ccda_vitals: require("./ccda/sections/vitals").vitalSignsSection(version)[0],
        ccda_medications: require("./ccda/sections/medications").medicationsSection(version)[0],
        ccda_problems: require("./ccda/sections/problems").problemsSection(version)[0],
        ccda_immunizations: require("./ccda/sections/immunizations").immunizationsSection(version)[0],
        ccda_results: require("./ccda/sections/results").resultsSection(version)[0],
        ccda_allergies: require("./ccda/sections/allergies").allergiesSection(version)[0],
        ccda_encounters: require("./ccda/sections/encounters").encountersSection(version)[0],
        ccda_procedures: require("./ccda/sections/procedures").proceduresSection(version)[0],
        ccda_social_history: require("./ccda/sections/social_history").socialHistorySection(version)[0],
        ccda_plan_of_care: require("./ccda/sections/plan_of_care").plan_of_care_section(version)[0],
        ccda_payers: require("./ccda/sections/payers").payers_section(version)[0],

        //exposing individual entries just in case
        ccda_vitals_entry: require("./ccda/sections/vitals").vitalSignsEntry(version)[1],
        ccda_medications_entry: require("./ccda/sections/medications").medicationsEntry(version)[1],
        ccda_problems_entry: require("./ccda/sections/problems").problemsEntry(version)[1],
        ccda_immunizations_entry: require("./ccda/sections/immunizations").immunizationsEntry(version)[1],
        ccda_results_entry: require("./ccda/sections/results").resultsEntry(version)[1],
        ccda_allergies_entry: require("./ccda/sections/allergies").allergiesEntry(version)[1],
        ccda_encounters_entry: require("./ccda/sections/encounters").encountersEntry(version)[1],
        ccda_procedures_entry: require("./ccda/sections/procedures").proceduresEntry(version)[1],
        ccda_plan_of_care_entry: require("./ccda/sections/plan_of_care").plan_of_care_entry(version)[1],
        ccda_payers_entry: require("./ccda/sections/payers").payers_entry(version)[1],

    };
}

module.exports.componentRouter = componentRouter;
