"use strict";

var includeCleanup = require("../common/cleanup");

var cleanup = module.exports = Object.create(includeCleanup);

cleanup.augmentObservation = function () {

    if (this.js && this.js.problem_text && this.js.problem_text.js) {
        if (!this.js.code.js.name) {
            this.js.code.js.name = this.js.problem_text.js;
        }
    }

};
