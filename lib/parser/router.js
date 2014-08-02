//CCDA to JSON parser.

"use strict";

var componentRouter = function (componentName, type) {
    if (componentName) {
        return generateComponents(type["type"])[componentName];
    } else {
        return generateComponents(type["type"]).ccda_ccd;
    }
};

var generateComponents = function (version) {
    version = version.indexOf("-") > -1 ? "_" + version.split("-")[1] : "";

    return {
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
