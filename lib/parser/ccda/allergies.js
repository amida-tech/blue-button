var shared = require('./shared');
var processor = require('./processor');
var component = require("./component");
var cleanup = require("./cleanup");

var severityField = ["severity", "0:1", 
    "*/*/h:templateId[@root='2.16.840.1.113883.10.20.22.4.8']/../h:value/@code", 
    shared.SimpleCode("2.16.840.1.113883.3.88.12.3221.6.8")
 ];

var allergyReaction = component.define('allergyReaction');
allergyReaction.templateRoot(['2.16.840.1.113883.10.20.22.4.9']);
allergyReaction.fields([
    ["code", "1..1", "h:value/@code"],
    ["name", "1..1", "h:value/@displayName"],
    ["codeSystem", "1..1", "h:value/@codeSystem"],
    severityField
]);

var allergyObservation = component.define('allergyObservation');
allergyObservation.templateRoot(['2.16.840.1.113883.10.20.22.4.7']);
allergyObservation.fields([
    ["allergen", "1..1", "h:participant/h:participantRole/h:playingEntity/h:code", shared.ConceptDescriptor],  // Require (optional in spec)
    severityField,
    ["status", "0..1", "*/*/h:templateId[@root='2.16.840.1.113883.10.20.22.4.28']/../h:value/@code", shared.SimpleCode("2.16.840.1.113883.3.88.12.80.68")],
    ["reaction", "0..*", allergyReaction.xpath(), allergyReaction]
]);
allergyObservation.cleanupStep(cleanup.extractAllFields(['allergen']));

var problemAct = component.define('problemAct');
problemAct.templateRoot(['2.16.840.1.113883.10.20.22.4.30']);
problemAct.fields([
    ["dateRange", "1..1", "h:effectiveTime", shared.EffectiveTime],
    ["observation", "1..1", allergyObservation.xpath(), allergyObservation]    // Ignore observation cardinality (in spec can be more than 1)
]);
problemAct.cleanupStep(cleanup.extractAllFields(['observation']));

var allergiesSection = exports.allergiesSection = component.define('allergiesSection');
allergiesSection.templateRoot(['2.16.840.1.113883.10.20.22.2.6', '2.16.840.1.113883.10.20.22.2.6.1']);
allergiesSection.fields([
    ["problemAct","1..*", problemAct.xpath(), problemAct]
]);
allergiesSection.cleanupStep(cleanup.replaceWithField(["problemAct"]));
allergiesSection.cleanupStep(function(){
    if (this.js && this.js.length) {
        for (var i=0; i<this.js.length; ++i) {
            if (this.js[i].js) delete this.js[i].js.system;
        }
    }
}, "paredown");
