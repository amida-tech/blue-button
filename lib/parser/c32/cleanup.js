"use strict";

var includeCleanup = require("../common/cleanup");

var cleanup = module.exports = Object.create(includeCleanup);

cleanup.augmentObservation = function (value) {
    if (value && value.problem_text && value.problem_text) {
        if (!value.code.name) {
            value.code.name = value.problem_text;
        }
    }
    return value;
};
