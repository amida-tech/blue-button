var shared = require('./shared');
var component = require('./component');
var cleanup = require('./cleanup');

var location = component.define('location');
location.fields([
    ["name", "1:1", "h:playingEntity/h:name"],               // Optional in spec
    ["type", "1..1", "h:code", shared.ConceptDescriptor],
    ["address", "0..1", "h:addr", shared.Address],           // Multiple in spec
    ["telecoms", "0..*", "h:telecoms", shared.Telecom]
]);

var finding = component.define("finding");
finding.templateRoot(['2.16.840.1.113883.10.20.22.4.19']);
finding.fields([
    ["value", "1..1", "h:value", shared.ConceptDescriptor]
]);
finding.cleanupStep(cleanup.extractAllFields(['value']));

// Iff needed add this later by refactoring Problem Observation from Problems.  They should share.
//var diagnosis = component.define("diagnosis");
//finding.templateRoot(['2.16.840.1.113883.10.20.22.4.80']);
//finding.fields([
//  ["code", "1..1", "h:code", shared.ConceptDescriptor]
//]);
//finding.cleanupStep(cleanup.extractAllFields(['code']));

var activity = component.define('activity');
activity.templateRoot(['2.16.840.1.113883.10.20.22.4.49']);
activity.fields([
    ["code", "1..1", "h:code", shared.ConceptDescriptor],
    ["identifiers", "1..*", "h:id", shared.Identifier],
    ["date", "1..1", "h:effectiveTime", shared.EffectiveTime],
    ["performers", "0..*", "h:performer/h:assignedEntity/code", shared.ConceptDescriptor],
    ["locations", "0..*", "h:participant/h:participantRole", location],
    ["findings", "0..*", finding.xpath(), finding] //,
    //["diagnoses", "0..*", diagnosis.xpath(), diagnosis]
]);
activity.cleanupStep(cleanup.extractAllFields(['code']));

var encountersSection = exports.encountersSection = component.define('encountersSection');
encountersSection.templateRoot(['2.16.840.1.113883.10.20.22.2.22', '2.16.840.1.113883.10.20.22.2.22.1']);
encountersSection.fields([
    ["activity","0..*", activity.xpath(), activity]
]);
encountersSection.cleanupStep(cleanup.replaceWithField(["activity"]));
