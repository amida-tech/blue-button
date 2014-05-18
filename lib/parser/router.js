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
    ccda_socialHistory: require("./ccda/sections/socialHistory").socialHistorySection
};

var componentRouter = function(componentName) {
    if (componentName) {
        return components[componentName];
    } else {
        return components.ccda_ccd;
    }
};

module.exports.componentRouter = componentRouter;
