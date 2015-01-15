"use strict";

var includeCleanup = require("../common/cleanup");

var cleanup = module.exports = Object.create(includeCleanup);

cleanup.allergiesProblemStatusToHITSP = (function () {
    var dict = {};
    dict.active = {
        "name": "Active",
        "code": "55561003",
        "code_system_name": "SNOMED CT"
    };
    dict.suspended = dict.aborted = {
        "name": "Inactive",
        "code": "73425007",
        "code_system_name": "SNOMED CT"
    };
    dict.completed = {
        "name": "Resolved",
        "code": "413322009",
        "code_system_name": "SNOMED CT"
    };

    return function () {
        var status = this.js && this.js.problemStatus;
        if (status) {
            var value = dict[status];
            if (value) {
                var observation = this.js.observation;
                if (!observation) {
                    this.js.observation = {
                        status: value
                    };
                } else if (!observation.js) {
                    observation.js = {
                        status: value
                    };
                } else if (!observation.js.status) {
                    observation.js.status = value;
                }
            }
            delete this.js.problemStatus;
        }
    };
})();
