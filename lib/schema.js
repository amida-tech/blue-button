var fs = require('fs');
var util = require('util');
var componentRouter = require("./parser/router").componentRouter;

function generateSchema(componentTitle) {
    var component = componentRouter(componentTitle);
    if (component) {
        var schema = component.generateSchema();
        return schema;
    } else {
        return null;
    }
}

module.exports.generateSchema = generateSchema;
