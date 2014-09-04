//c32 to JSON parser.

"use strict";

var components = {
    c32_ccd: require("./c32/ccd").CCD,
    c32_demographics: require("./c32/demographics").patient,
    c32_vitals: require("./c32/sections/vitals").vitalSignsSection,
    c32_medications: require("./c32/sections/medications").medicationsSection,
    c32_problems: require("./c32/sections/problems").problemsSection,
    c32_immunizations: require("./c32/sections/immunizations").immunizationsSection,
    c32_results: require("./c32/sections/results").resultsSection,
    c32_allergies: require("./c32/sections/allergies").allergiesSection,
    c32_encounters: require("./c32/sections/encounters").encountersSection,
    c32_procedures: require("./c32/sections/procedures").proceduresSection,
    c32_social_history: require("./c32/sections/social_history").socialHistorySection,

    //exposing individual entries just in case
    c32_vitals_entry: require("./c32/sections/vitals").vitalSignsEntry,
    c32_medications_entry: require("./c32/sections/medications").medicationsEntry,
    c32_problems_entry: require("./c32/sections/problems").problemsEntry,
    c32_immunizations_entry: require("./c32/sections/immunizations").immunizationsEntry,
    c32_results_entry: require("./c32/sections/results").resultsEntry,
    c32_allergies_entry: require("./c32/sections/allergies").allergiesEntry,
    c32_encounters_entry: require("./c32/sections/encounters").encountersEntry,
    c32_procedures_entry: require("./c32/sections/procedures").proceduresEntry,

    //cms_doc: require()
    /*
     */

};

var componentRouter = function (componentName) {
    if (componentName) {
        return components[componentName];
    } else {
        return components.c32_ccd;
    }
};

module.exports.componentRouter = componentRouter;
