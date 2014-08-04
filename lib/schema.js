var fs = require('fs');
var util = require('util');
var componentRouter = require("./parser/router").componentRouter;
var cmsOnlySchema = require("./parser/cms/cmsSpecificSchema"); //do stuff here.

//generateSchema('CMS&CCDA');

function generateSchema(componentTitle) {
    //this code here may be temporary.
    var component;
    var schema;
    if (componentTitle === 'CMS&CCDA') {
        //since the cms blue button model follows the ccda format,
        component = componentRouter('ccda_ccd');
        schema = component.generateSchema();
        //console.log(JSON.stringify(schema, null, 2));
        for (var x in cmsOnlySchema) {
            schema[x] = cmsOnlySchema[x];
        }
        return schema;
    }

    component = componentRouter(componentTitle);
    if (component) {
        schema = component.generateSchema();
        return schema;
    } else {
        return null;
    }
}

module.exports.generateSchema = generateSchema;
