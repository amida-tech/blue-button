"use strict";

var oids = require("./oids");

var codeSystem = {};

codeSystem.getName = function (code) {
    return this.cs.table && this.cs.table[code];
};

codeSystem.getSystemName = function () {
    return this.cs.name;
};

exports.getCodeSystem = function (oid) {
    var cs = oids[oid];
    if (cs) {
        var result = Object.create(codeSystem);
        result.oid = oid;
        result.cs = cs;
        return result;
    } else {
        return null;
    }
};
