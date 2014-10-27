"use strict";

var _ = require("underscore");

var cleanup = module.exports = {};

cleanup.clearNulls = function () {

    //Purges empty objects from arrays, added to improve phone/email support.
    for (var obj in this.js) {
        if (_.isArray(this.js[obj])) {
            for (var jsobj in this.js[obj]) {
                if (_.isArray(this.js[obj][jsobj].js) === false) {
                    if (_.isEmpty(this.js[obj][jsobj].js) && _.isUndefined(this.js[obj][jsobj].js) === false) {
                        delete this.js[obj][jsobj];
                    }
                }
            }
        }
    }

    if (!this.js || this.js === null) {
        return;
    }

    if ('object' === typeof this.js) {
        Object.keys(this.js).forEach(function (k) {
            if ((this.js[k] === null) ||
                Array.isArray(this.js[k]) && (this.js[k].length === 0 || this.js[k].filter(function (v) {
                    return v && v.js !== null;
                }).length === 0) ||
                this.js[k].js === null) {
                delete this.js[k];
            }
        }, this);

        if (Object.keys(this.js).length === 0) {
            this.js = null;
        }
    }
};

cleanup.renameField = function (oldn, newn) {
    var f = function () {
        if (this.js && this.js[oldn]) {
            this.js[newn] = this.js[oldn];
            delete this.js[oldn];
        }
    };
    return f;
};

cleanup.replaceWithObject = function (field, value) {
    var f = function () {
        if (this.js && this.js[field]) {
            this.js[field] = value;
        }
    };
    return f;
};

cleanup.extractAllFields = function (flist) { // We need cleanup function to become objects
    var r = function () {
        flist.forEach(function (k) {
            var tmp;
            if (this.js !== undefined && this.js !== null) {
                tmp = this.js[k];
                delete this.js[k]
            };
            if (tmp) { //HACK: added this if
                if (tmp.js) {
                    Object.keys(tmp.js).forEach(function (m) {
                        if (this.js[m] === undefined) {
                            this.js[m] = tmp.js[m];
                        }
                    }, this);
                }
            }
        }, this);
    };
    return r;
};

cleanup.replaceWithField = function (field) {
    var r = function () {
        this.js = this.js && this.js[field];
    };
    return r;
};

cleanup.removeField = function (field) {
    var r = function () {
        if (this.js) //HACK: added if
            delete this.js[field];
    }
    return r;
};
