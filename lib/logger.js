"use strict";
var winston = require('winston');

var logger = new(winston.Logger)({
    "exitOnError": true,
    "transports": [
        new(winston.transports.Console)({
            "colorize": true,
            "handleExceptions": true,
            "timestamp": true,
        }),
    ]
});

logger.log = function () {
    var args = Array.prototype.slice.call(arguments);
    args.splice(1, 0, '[BB]');
    winston.Logger.prototype.log.apply(this, args);
};

module.exports = logger;
