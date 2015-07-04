"use strict";

var includeCleanup = require("../common/cleanup");

var cleanup = module.exports = Object.create(includeCleanup);

cleanup.promoteAllergenNameIfNoAllergen = function (value) {
    if (value && (!value.allergen)) {
        var name = value.allergenName;
        if (name) {
            value.allergen = {
                name: name
            };
        }
    }
    delete value.allergenName;
    return value;
};

cleanup.promoteFreeTextIfNoReaction = function (value) {
    if (value && (!value.reaction)) {
        var name = value.free_text_reaction;
        if (name) {
            value.reaction = {
                name: name
            };
        }
    }
    delete value.free_text_reaction;
    return value;
};
