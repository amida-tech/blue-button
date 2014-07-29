//CCDA to JSON parser.

"use strict";

var version;

var componentRouter = function (componentName, type) {
    console.log(type);
    if (componentName) {
        return generateComponents(getVersion(type["type"]))[componentName];
    } else {
        return generateComponents(getVersion(type["type"])).ccda_ccd;
    }
};

var getVersion = function(type) {
    if (type === "ccda" || type === "c32") {
        return "";
    } else if (type === "ccda-r1") {
        return "-ccda-r1";
    } else {
        return "";
    }
}

var generateComponents = function (version) {
    return {
        ccda_ccd: require("./ccda/ccd").CCD,
        ccda_demographics: require("./ccda/demographics").patient,
        ccda_vitals: require("./ccda/sections" + version + "/vitals").vitalSignsSection,
        ccda_medications: require("./ccda/sections" + version + "/medications").medicationsSection,
        ccda_problems: require("./ccda/sections" + version + "/problems").problemsSection,
        ccda_immunizations: require("./ccda/sections" + version + "/immunizations").immunizationsSection,
        ccda_results: require("./ccda/sections" + version + "/results").resultsSection,
        ccda_allergies: require("./ccda/sections" + version + "/allergies").allergiesSection,
        ccda_encounters: require("./ccda/sections" + version + "/encounters").encountersSection,
        ccda_procedures: require("./ccda/sections" + version + "/procedures").proceduresSection,
        ccda_social_history: require("./ccda/sections" + version + "/social_history").socialHistorySection,
        ccda_plan_of_care: require("./ccda/sections" + version + "/plan_of_care").plan_of_care_section,
        ccda_payers: require("./ccda/sections" + version + "/payers").payers_section,
    
        //exposing individual entries just in case
        ccda_vitals_entry: require("./ccda/sections" + version + "/vitals").vitalSignsEntry,
        ccda_medications_entry: require("./ccda/sections" + version + "/medications").medicationsEntry,
        ccda_problems_entry: require("./ccda/sections" + version + "/problems").problemsEntry,
        ccda_immunizations_entry: require("./ccda/sections" + version + "/immunizations").immunizationsEntry,
        ccda_results_entry: require("./ccda/sections" + version + "/results").resultsEntry,
        ccda_allergies_entry: require("./ccda/sections" + version + "/allergies").allergiesEntry,
        ccda_encounters_entry: require("./ccda/sections" + version + "/encounters").encountersEntry,
        ccda_procedures_entry: require("./ccda/sections" + version + "/procedures").proceduresEntry,
        ccda_plan_of_care_entry: require("./ccda/sections" + version + "/plan_of_care").plan_of_care_entry,
        ccda_payers_entry: require("./ccda/sections" + version + "/payers").payers_entry,

    };
}

module.exports.componentRouter = componentRouter;
