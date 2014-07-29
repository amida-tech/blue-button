//CCDA to JSON parser.

"use strict";

var version = {};

var components = {
    ccda_ccd: require("./ccda/ccd").CCD,
    ccda_demographics: require("./ccda/demographics").patient,
    ccda_vitals: require("./ccda/sections" + version["type"] + "/vitals").vitalSignsSection,
    ccda_medications: require("./ccda/sections" + version["type"] + "/medications").medicationsSection,
    ccda_problems: require("./ccda/sections" + version["type"] + "/problems").problemsSection,
    ccda_immunizations: require("./ccda/sections" + version["type"] + "/immunizations").immunizationsSection,
    ccda_results: require("./ccda/sections" + version["type"] + "/results").resultsSection,
    ccda_allergies: require("./ccda/sections" + version["type"] + "/allergies").allergiesSection,
    ccda_encounters: require("./ccda/sections" + version["type"] + "/encounters").encountersSection,
    ccda_procedures: require("./ccda/sections" + version["type"] + "/procedures").proceduresSection,
    ccda_social_history: require("./ccda/sections" + version["type"] + "/social_history").socialHistorySection,
    ccda_plan_of_care: require("./ccda/sections" + version["type"] + "/plan_of_care").plan_of_care_section,
    ccda_payers: require("./ccda/sections" + version["type"] + "/payers").payers_section,

    //exposing individual entries just in case
    ccda_vitals_entry: require("./ccda/sections" + version["type"] + "/vitals").vitalSignsEntry,
    ccda_medications_entry: require("./ccda/sections" + version["type"] + "/medications").medicationsEntry,
    ccda_problems_entry: require("./ccda/sections" + version["type"] + "/problems").problemsEntry,
    ccda_immunizations_entry: require("./ccda/sections" + version["type"] + "/immunizations").immunizationsEntry,
    ccda_results_entry: require("./ccda/sections" + version["type"] + "/results").resultsEntry,
    ccda_allergies_entry: require("./ccda/sections" + version["type"] + "/allergies").allergiesEntry,
    ccda_encounters_entry: require("./ccda/sections" + version["type"] + "/encounters").encountersEntry,
    ccda_procedures_entry: require("./ccda/sections" + version["type"] + "/procedures").proceduresEntry,
    ccda_plan_of_care_entry: require("./ccda/sections" + version["type"] + "/plan_of_care").plan_of_care_entry,
    ccda_payers_entry: require("./ccda/sections" + version["type"] + "/payers").payers_entry,

    //cms_doc: require()
    /*
     */

};

var componentRouter = function (componentName, type) {
    version  = type;
    if (componentName) {
        return components[componentName];
    } else {
        return components.ccda_ccd;
    }
};

module.exports.componentRouter = componentRouter;
