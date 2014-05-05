var Component = require("./component");
var Processor = require('./processor');
var Cleanup = require("./cleanup");

var Identifier = exports.Identifier = Component.define("Identifier")
.fields([
  ["root","1..1", "@root"],
  ["extension","0..1", "@extension"],
]);

var TextWithReference = exports.TextWithReference = Component.define("TextWithReference");
TextWithReference.fields([ 
  ["text","0..*", "text()"],
  ["reference","0..1", "./h:reference/@value"],
])
.cleanupStep(Cleanup.resolveReference);

var ConceptDescriptor = exports.ConceptDescriptor = Component.define("ConceptDescriptor");
ConceptDescriptor.fields([ 
  ["label","0..1", "@displayName"],
  ["code","1..1", "@code"],
  ["system","1..1", "@codeSystem"],
  ["systemName","0..1", "@codeSystemName"],
  ["nullFlavor","0..1", "@nullFlavor"],
  ["translations","0..*", "h:translation", ConceptDescriptor],
])
.cleanupStep(Cleanup.validateShalls)
.cleanupStep(Cleanup.augmentConcept)
.cleanupStep(function(){
  if (this.js && this.js.system) delete this.js.system;
}, "paredown");

var SimpleCode = exports.SimpleCode = function(oid){
  return Component.define("SimpleCode."+oid)
  .fields([])
  .cleanupStep(function(){
    if (this.js) {
      this.js = OIDs[oid].table[this.js];
    }
  }, "paredown");
};

var SimplifiedCode = exports.SimplifiedCode = ConceptDescriptor.define("SimpifiedCode")
.cleanupStep(function(){
  if (this.js) {
  // TODO: look up; don't trust the label to be present...
    this.js = this.js.label;
  }
});

var PhysicalQuantity = exports.PhysicalQuantity = Component.define("PhysicalQuantity")
.fields([
  ["value","1..1", "@value", Processor.asFloat], 
  ["unit", "0..1", "@unit"],
]);

var EffectiveTime = exports.EffectiveTime = Component.define("EffectiveTime")
.fields([
  ["point","0..1", "@value", Processor.asTimestamp],
  ["pointResolution","0..1", "@value", Processor.asTimestampResolution],
  ["low","0..1", "h:low/@value", Processor.asTimestamp],
  ["lowResolution","0..1", "h:low/@value", Processor.asTimestampResolution],
  ["high","0..1", "h:high/@value", Processor.asTimestamp],
  ["highResolution","0..1", "h:high/@value", Processor.asTimestampResolution],
  ["operator","0..1", "./@operator"],
  ["xsitype","0..1", "./@xsi:type"],
  ["period","0..1", "./h:period", PhysicalQuantity],
//  ["precise","0..1", "./@institutionSpecified", Processor.asBoolean],
])
.cleanupStep(function(){
  if (this.js) delete this.js.xsitype;
}, "paredown");

