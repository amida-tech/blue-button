"use strict";

var includeCleanup = require("../common/cleanup");

var cleanup = module.exports = Object.create(includeCleanup);

var _ = require("lodash");

cleanup.promoteAllergenNameIfNoAllergen = function () {
    if (this.js && (!_.get(this, "js.allergen"))) {
        var name = this.js.allergenName && this.js.allergenName.js;
        if (name) {
            this.js.allergen = {
                name: name
            };
        }
    }
    delete this.js.allergenName;
};

cleanup.promoteFreeTextIfNoReaction = function () {
    if (this.js && (!_.get(this, "js.reaction"))) {
        var name = this.js.free_text_reaction && this.js.free_text_reaction.js;
        if (name) {
            this.js.reaction = {
                name: name
            };
        }
    }
};
