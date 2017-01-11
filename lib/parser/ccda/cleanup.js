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
    delete this.js.free_text_reaction;
};

cleanup.replaceNullWithField = function (nullField, field) {
    // TODO but nF taken off by augmentConcept already
    // can we just do this first?
    // augmentConcept is on CD itself, this will be on the instance.
    // which goes first?
    // trying to specify the order seems very tenuous
    // no, no, no, augmentConcept is on CD, this is on entry, so this
    // will go after
    // so we can either check for vital === { 'code': '' } orrrrr ?
    // Are these truly convolved or should we just block on changes
    // to nullFlavor handling?
    // Let's try it
    return function () {
        if (this.js) {
            if ((!_.has(this, ["js", nullField]) ||
                    _.has(this, ["js", nullField, ".nullFlavor"])) && _.has(this, ["js", field])) {
                this.js[nullField] = this.js[field];
            }
            delete this.js[field];
        }
    };
};
