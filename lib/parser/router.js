//CCDA to JSON parser.

"use strict";

var components = {
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
    ccda_social_history: require("./ccda/sections/social_history").socialHistorySection,
    ccda_plan_of_care: require("./ccda/sections/plan_of_care").plan_of_care_section,

    //exposing individual entries just in case
    ccda_vitals_entry: require("./ccda/sections/vitals").vitalSignsEntry,
    ccda_medications_entry: require("./ccda/sections/medications").medicationsEntry,
    ccda_problems_entry: require("./ccda/sections/problems").problemsEntry,
    ccda_immunizations_entry: require("./ccda/sections/immunizations").immunizationsEntry,
    ccda_results_entry: require("./ccda/sections/results").resultsEntry,
    ccda_allergies_entry: require("./ccda/sections/allergies").allergiesEntry,
    ccda_encounters_entry: require("./ccda/sections/encounters").encountersEntry,
    ccda_procedures_entry: require("./ccda/sections/procedures").proceduresEntry,
    ccda_plan_of_care_entry: require("./ccda/sections/plan_of_care").plan_of_care_entry,

    //cms_doc: require()
    /*
     */

};

var componentRouter = function (componentName) {
    if (componentName) {
        return components[componentName];
    } else {
        return components.ccda_ccd;
    }
};

module.exports.componentRouter = componentRouter;
