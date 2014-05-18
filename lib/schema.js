var fs = require('fs');
var util = require('util');
var componentRouter = require("./parser/router").componentRouter;

function generateSchema(options, callback) {
    var component = componentRouter(options.component);
    if (!component) {
        var msg = util.format("Component %s is not supported.", options.component);
        callback(new Error(msg));
        return;
    }
    var schema = component.generateSchema();
    callback(null, schema);
}

module.exports.generateSchema = generateSchema;
