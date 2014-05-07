var componentRouter = require("./parser/router").componentRouter;
var xmlParser = require("./xml");
var Component = require("./parser/ccda/component").Component;
var Cleanup = require("./parser/ccda/cleanup");
var util = require('util');

function parse(doc, options, callback) {
    if (arguments.length === 2){
        callback = options;
        options = {};
    }

    if (options.hideFields){
        Component.cleanupStep(Cleanup.hideFields(options.hideFields), "paredown");
    }
    
    var patientId = options.patientId || 0;
    var xml = xmlParser.parse(doc);
    
    var componentParser = componentRouter(options.component);
    if (! componentParser) {
        var msg = util.format("Component %s is not supported.", options.component);
        callback(new Error(msg));
        return;
    }
    var ret = componentParser.instance();
    ret.patientId = patientId;

    //TODO can we leverage external terminology services
    //explicitly here, to support browser- and server-side JS?
    ret.codes = []; // skip code resoution for now
    
    ret.src = doc;
    ret.errors = [];
    ret.run(xml);

    ret.cleanupTree(); // first build the data objects up 
    ret.cleanupTree("paredown"); // then pare down to essentials
    callback(null, ret);
    return ret;
}

module.exports.parse = parse;