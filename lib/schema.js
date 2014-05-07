var fs = require('fs');
var util = require('util');
var componentRouter = require("./parser/router").componentRouter;

var formatters = {
        stringify: function(json) {
            return JSON.stringify(json, undefined, '\t');
        }
    };

var getFormatter = function(name) {
    if (name) {
        return formatters[name];
    } else {
        return formatters.stringify;
    }
};

function generateSchema(options, callback) {
    var component = componentRouter(options.component);
    if (! component) {
        var msg1 = util.format('Unrecognized component: %s', options.component);
        callback(new Error(msg1));
    }
    var filepath = options.filepath;
    if (! filepath) {
        var msg2 = 'No output file is specified.';
        callback(new Error(msg2));
    }
    var formatter = getFormatter(options.formatter);
    if (! formatter) {
        var msg3 = util.format('Unrecognized formatter: %s', options.formatter);
        callback(new Error(msg3));
    }
    
    var json = component.document();
    var doc = formatter(json);
    fs.writeFileSync(filepath, doc);
    callback();
}

module.exports.generateSchema = generateSchema;