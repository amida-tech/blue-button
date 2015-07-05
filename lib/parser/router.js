//CCDA to JSON parser.

"use strict";

var runner = function (component) {
    return function (doc, sourceKey) {
        console.time('build');
        var ret = component.instance();
        var data = ret.run(doc, sourceKey);
        console.timeEnd('build');
        return {
            data: data,
            errors: ret.errors
        };
    };
};

var runnerGenerators = {
    //Base CCD Object.
    cda_ccd: function (version) {
        var c = require("./cda/ccd").CCD(version);
        return runner(c);
    },

    //Base C32 Object.
    c32_ccd: function (version) {
        var c = require("./c32/ccd").C32(version);
        return runner(c);
    },
    c32_demographics: function (version) {
        var c = require("./c32/demographics").patient;
        return runner(c);
    },
    c32_vitals: function (version) {
        var c = require("./c32/sections/vitals").vitalSignsSection;
        return runner(c);
    },
    c32_medications: function (version) {
        var c = require("./c32/sections/medications").medicationsSection;
        return runner(c);
    },
    c32_problems: function (version) {
        var c = require("./c32/sections/problems").problemsSection;
        return runner(c);
    },
    c32_immunizations: function (version) {
        var c = require("./c32/sections/immunizations").immunizationsSection;
        return runner(c);
    },
    c32_results: function (version) {
        var c = require("./c32/sections/results").resultsSection;
        return runner(c);
    },
    c32_allergies: function (version) {
        var c = require("./c32/sections/allergies").allergiesSection;
        return runner(c);
    },
    c32_encounters: function (version) {
        var c = require("./c32/sections/encounters").encountersSection;
        return runner(c);
    },
    c32_procedures: function (version) {
        var c = require("./c32/sections/procedures").proceduresSection;
        return runner(c);
    },

    //exposing individual entries just in case
    c32_vitals_entry: function (version) {
        var c = require("./c32/sections/vitals").vitalSignsEntry;
        return runner(c);
    },
    c32_medications_entry: function (version) {
        var c = require("./c32/sections/medications").medicationsEntry;
        return runner(c);
    },
    c32_problems_entry: function (version) {
        var c = require("./c32/sections/problems").problemsEntry;
        return runner(c);
    },
    c32_immunizations_entry: function (version) {
        var c = require("./c32/sections/immunizations").immunizationsEntry;
        return runner(c);
    },
    c32_results_entry: function (version) {
        var c = require("./c32/sections/results").resultsEntry;
        return runner(c);
    },
    c32_allergies_entry: function (version) {
        var c = require("./c32/sections/allergies").allergiesEntry;
        return runner(c);
    },
    c32_encounters_entry: function (version) {
        var c = require("./c32/sections/encounters").encountersEntry;
        return runner(c);
    },
    c32_procedures_entry: function (version) {
        var c = require("./c32/sections/procedures").proceduresEntry;
        return runner(c);
    },

    //CCDA domains.
    ccda_ccd: function (version) {
        var c = require("./ccda/ccd").CCD(version);
        return runner(c);
    },
    ccda_demographics: function (version) {
        var c = require("./ccda/demographics").patient;
        return runner(c);
    },
    ccda_vitals: function (version) {
        var c = require("./ccda/sections/vitals").vitalSignsSection(version)[0];
        return runner(c);
    },
    ccda_medications: function (version) {
        var c = require("./ccda/sections/medications").medicationsSection(version)[0];
        return runner(c);
    },
    ccda_problems: function (version) {
        var c = require("./ccda/sections/problems").problemsSection(version)[0];
        return runner(c);
    },
    ccda_immunizations: function (version) {
        var c = require("./ccda/sections/immunizations").immunizationsSection(version)[0];
        return runner(c);
    },
    ccda_results: function (version) {
        var c = require("./ccda/sections/results").resultsSection(version)[0];
        return runner(c);
    },
    ccda_allergies: function (version) {
        var c = require("./ccda/sections/allergies").allergiesSection(version)[0];
        return runner(c);
    },
    ccda_encounters: function (version) {
        var c = require("./ccda/sections/encounters").encountersSection(version)[0];
        return runner(c);
    },
    ccda_procedures: function (version) {
        var c = require("./ccda/sections/procedures").proceduresSection(version)[0];
        return runner(c);
    },
    ccda_social_history: function (version) {
        var c = require("./ccda/sections/social_history").socialHistorySection(version)[0];
        return runner(c);
    },
    ccda_plan_of_care: function (version) {
        var c = require("./ccda/sections/plan_of_care").plan_of_care_section(version)[0];
        return runner(c);
    },
    ccda_payers: function (version) {
        var c = require("./ccda/sections/payers").payers_section(version)[0];
        return runner(c);
    },

    //exposing individual entries just in case
    ccda_vitals_entry: function (version) {
        var c = require("./ccda/sections/vitals").vitalSignsEntry(version)[1];
        return runner(c);
    },
    ccda_medications_entry: function (version) {
        var c = require("./ccda/sections/medications").medicationsEntry(version)[1];
        return runner(c);
    },
    ccda_problems_entry: function (version) {
        var c = require("./ccda/sections/problems").problemsEntry(version)[1];
        return runner(c);
    },
    ccda_immunizations_entry: function (version) {
        var c = require("./ccda/sections/immunizations").immunizationsEntry(version)[1];
        return runner(c);
    },
    ccda_results_entry: function (version) {
        var c = require("./ccda/sections/results").resultsEntry(version)[1];
        return runner(c);
    },
    ccda_allergies_entry: function (version) {
        var c = require("./ccda/sections/allergies").allergiesEntry(version)[1];
        return runner(c);
    },
    ccda_encounters_entry: function (version) {
        var c = require("./ccda/sections/encounters").encountersEntry(version)[1];
        return runner(c);
    },
    ccda_procedures_entry: function (version) {
        var c = require("./ccda/sections/procedures").proceduresEntry(version)[1];
        return runner(c);
    },
    ccda_plan_of_care_entry: function (version) {
        var c = require("./ccda/sections/plan_of_care").plan_of_care_entry(version)[1];
        return runner(c);
    },
    ccda_payers_entry: function (version) {
        var c = require("./ccda/sections/payers").payers_entry(version)[1];
        return runner(c);
    }
};

var componentRouter = function (componentName, type) {
    var version = type.type.indexOf("-") > -1 ? "_" + type.type.split("-")[1] : "";
    if (componentName) {
        var runnerGenerator = runnerGenerators[componentName];
        var runner = runnerGenerator(version);
        return runner;
    } else {
        if (type.type === 'c32') {
            return runnerGenerators.c32_ccd(version);
        } else if (type.type === 'cda') {
            return runnerGenerators.cda_ccd(version);
        } else {
            return runnerGenerators.ccda_ccd(version);
        }
    }
};

module.exports.componentRouter = componentRouter;
