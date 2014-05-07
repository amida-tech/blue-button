#Encounters

###Object Schema:
```
var Encounters = {
        "date": [{
          "date":{type: datetime, required: true},
          "precision":{type:string, required: true}
        }],
        "identifiers": [{
          "identifier": {type:string, required: true},
        }],
        "name": {type: string, required: true},
        "code": {type: string, required: true},
        "code_system": {type:string, required: true},
        "locations": [{
            "name": {type: string, required:true},
            "type": {
               "name": {type: string, required: true},
               "code": {type: string, required: true},
               "code_system": {type:string, required: true}
            }
            address: {
               "streetLines": [{type:string, required: true}],
               "city": {type: string, required: true},
               "state": {type: string, required: true},
               "zip": {type: string, required: true},
               "country": {type: string, required: true}
            }
        }],
        findings: [{
            "name": {type: string, required: true},
            "code": {type: string, required: true},
            "code_system": {type:string, required: true}
        }]
     }
```


####Notes
- Root name, code and code_system can be translated using translation objects.
- Location name is optional in the specification but required in this model.
- Specification supports multiple addresses for a single location.  This model does not.
- Finding might have a date range, a timestamp, or an additional coded value.  These are currently are not supported.
- Encounter diagnosis is not yet supported.


####Encounter.date
- 0..2
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/effectiveTime
- Should be handled to account for each type of date.

####Encounter.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/id@root
- Should be handled by common identifier parser.

####Encounter.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/code@displayName
- Must be selected from EncounterTypeCode.
- A translation object is possible.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Encounter.code
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/code@code
- Must be selected from EncounterTypeCode.
- A translation object is possible.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Encounter.code_system
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/code@codeSystemName
- Can be be RXNORM, UNII, or NDF-RT.
- A translation object is possible.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Encounter.locations
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/participant/participantRole

####Encounter.location.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/participant/participantRole/h:playingEntity/name

###Encounter.location.type
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/participant/participantRole/code
- Should always be codified to HealthcareServiceLocation.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system

###Encounter.location.type.code
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/participant/participantRole/code/@code
- See parent node.

###Encounter.location.type.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/participant/participantRole/code/@displayName
- See parent node.

##Encounter.location.type.codeSystem
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/participant/participantRole/code/@displayName
- See parent node.

###Encounter.location.address
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/participant/participantRole/addr
- See demographics section documentation.

###Encounter.location.telecoms
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/participant/participantRole/telecom
- See demographics section documentation.

###Encounter.findings
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/entryRelationShip/observation

###Encounter.finding.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/entryRelationShip/observation/value/@displayName
- Should always be codified to SNOMED-CT.
- A translation object is possible instead of SNOMED.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system

###Encounter.finding.code
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/entryRelationShip/observation/value/@code
- See Encounter.finding.name.

###Encounter.finding.code_system
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/entryRelationShip/observation/value/@codeSystemName
- See Encounter.finding.name.
