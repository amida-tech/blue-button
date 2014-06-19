CCDA Parser Permutation Design
===============================

This describes how to add vendor specific extensions to the CCDA parser code.

## General Design

Components define parsers for any CCDA XML element of interest
``` javascript
var compA = component.define("compA");
compA.fields([
    ["name", "0..1", "@name"],
    ["element", "1..1", "h:element", element]
]);
```
and can contain other components for xml subelements ('element' above).  CCDA parser generates a JSON object from this 
definition with 'name' and 'element' fields.

Normalization can be added to each component
``` javascript
compA.cleanupStep(compAStep1);
compA.cleanupStep(compAStep2);
```
where 'compAStep1' and 'compAStep2' are functions that can remove or modify existing fields or add new fields
after the primary parsing step.  Normalization steps are executed in order.

## Extending

An existing component can be extended to create a new component with includes all the fields and 
cleanup steps of of the existing component
``` javascript
var compB = compA.define("compB");
compB.fields([
  ["addlElement", "0..*", "h:addlElement",  addlElement]
]);
compB.cleanupStep(compBStep3);
```
CCDA parser generates a JSON object from this definition with 'name', 'element', and 'addlElememt'.  
Normalization steps will include 'compAStep1', 'compAStep2', and 'compBStep3'.

## Vendor Specific Fields

Any field in the component can be redefined for a specific key
``` javascript
var compA = component.define("compA");
compA.fields([
    ["name", "0..1", "@name"],
    ["name", "0..1", "@displayName", undefined, 'vendor'],
    ["vendorField", "0..1", "@vendorField", undefined, 'vendor'],
    ["element", "1..1", "h:element", element]
]);
```
And if 'vendor' key is passed from the API, CCDA parser uses the vendor specific "name" and "vendorField"
``` javascript
var result = bb.parseString(data, {sourceKey: 'vendor'});
```

## Vendor Specific Normalization

Normalization steps can be included only for specific vendors
``` javascript
compA.cleanupStep(compAStep4, ['vendor1', 'vendor2']);
```
and compAStep4 will only be used if 'vendor1' or 'vendor2' is passed from the API as the 'sourceKey'.

Normalization steps can also be excluded for specific vendors
``` javascript
compA.cleanupStep(compAStep5, undefined, ['vendor1', 'vendor2']);
```
and compAStep5 will not be executed if 'vendor1' or 'vendor2' is passed from the API as the 'sourceKey'.  For 
no key or other keys compAStep5 will be executed.



