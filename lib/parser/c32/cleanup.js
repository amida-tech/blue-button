"use strict";

var includeCleanup = require("../common/cleanup");

var cleanup = module.exports = Object.create(includeCleanup);

var _ = require("lodash");

cleanup.augmentObservation = function () {

  if (_.get(this, "js.problem_text") && _.get(this, "js.problem_text.js")) {
    if (!_.get(this, "js.code.js.name")) {
      this.js.code.js.name = this.js.problem_text.js;
    }
  }

};
