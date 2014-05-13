#Allergies

###Object Schema:
```
var Allergies = {
        "date": [{cda_date}],
        "identifiers": [{
          "identifier": {type:string, required: true},
        }],
        "name": {type: string, required: true},
        "code": {type: string, required: false},
        "severity": {type: string, required: false},
        "status": {type: string, required: false},
        "reaction": [
          {
             "code": {type: string, required: true},
             "name": {type: string, required: true},
             "code_system_name": {type: string, required: true},
             "severity": {type: string, required: false},
          }
        ]
      }
```


####Notes
- Name and code are optional in the spec.  In this model we assume they are required.
- Allergies can be translated using translation object.
- All fields except date are based on allergy observation.  Date is based on Problem Act.
- Observations can be multiple in the spec.  In this model they are assumed to be unique.
- Observation and reactions have dates independent of problem act in the spec.  They are ignored in this model.
- All text fields are ignored.
- Severities can have interpretation codes.  These are ignored in this model.
- Status comes from observation status.  Problem Act status is ignored.
- Reaction Procedure Activity and Medication Activity relationships are ignored.


####Allergy.date
- 0..2
- //ClinicalDocument/component/structuredBody/component/section/entry/act/effectiveTime

####Allergy.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/id@root
- Should be handled by common identifier parser.

####Allergy.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/participant/participantRole/playingEntity/code@displayName
- Can be be from RXNORM, UNII, or NDF-RT.
- A translation object is possible.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Allergy.code
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/participant/participantRole/playingEntity/code@code
- Can be be from RXNORM, UNII, or NDF-RT.
- A translation object is possible.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Allergy.code_system_name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/participant/participantRole/playingEntity/code@codeSystemName
- Can be be RXNORM, UNII, or NDF-RT.
- A translation object is possible.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Allergy.severity
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@displayName
- OID 2.16.840.1.113883.10.20.22.4.8.
- Uses Problem Severity 2.16.840.1.113883.3.88.12.3221.6.8 for lookup.

####Allergy.status
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@displayName
- OID 2.16.840.1.113883.10.20.22.4.28.
- Uses HITSP Problem Status 2.16.840.1.113883.3.88.12.80.68 for lookup.

###Allergy.reaction
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation
- OID 2.16.840.1.113883.10.20.22.4.9.

###Allergy.reaction.name
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@displayName
- Should always be codified to SNOMED-CT.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

###Allergy.reaction.code
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@code
- Should always be codified to SNOMED-CT.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

###Allergy.reaction.code_system_name
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@codeSystemName
- Should be always 2.16.840.1.113883.6.96.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

