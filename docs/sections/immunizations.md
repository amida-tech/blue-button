#Immunizations

###Object Schema:
```
  var Immunizations = {
    "date": [{
         "date":{type: datetime, required: true},
         "precision":{type:string, required: true}
     }],
     "identifiers": [{
        "identifier": {type:string, required: true},
        "identifier_type": {type:string, required: true}
     }],
    "product": {
      "name": "Influenza, high dose seasonal",
      "code": "135",
      "code_system": "2.16.840.1.113883.12.292",
      "code_system_name": "CVX",
      "translation": {
        "name": null,
        "code": null,
        "code_system": null,
        "code_system_name": null
      }
    },
    "route": {
      "name": "Intramuscular injection",
      "code": "C28161",
      "code_system": "2.16.840.1.113883.3.26.1.1",
      "code_system_name": "NCI Thesaurus"
    },
    "instructions": null,
    "education_type": {
      "name": null,
      "code": null,
      "code_system": null
    }
  }

```


####Notes
- Mood code event or intent, seems to determine whether or not the doctor thinks they should do it, or whether it is documentation of an event.

####Immunization.date
- 0..2
- //ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/effectiveTime
- Should be handled to account for each type of date.

####Immunization.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/id@root
- Should be handled by common identifier parser.

####Problem.negation_indicator
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation@negationInd
- Should be assumed to be false for safety reasons if not present; true if it is a negation.

####Problem.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/value@displayName
- Should always be codified to SNOMED-CT.
- A translation object is possible instead of SNOMED, to ICD.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Problem.code
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/value@code
- Should always be codified to SNOMED-CT.
- A translation object is possible instead of SNOMED, to ICD.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Problem.code_system
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/value@codeSystem
- Should always be codified to SNOMED-CT.
- A translation object is possible instead of SNOMED, to ICD.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Problem.onset_age
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@value
- Will need to filter by OID so it doesn't accidentally pull other sub components (2.16.840.1.113883.10.20.22.4.31).

####Problem.onset_age_units
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@units
- Will need to filter by OID so it doesn't accidentally pull other sub components (2.16.840.1.113883.10.20.22.4.31).
- May want to recodify the age units into more readable format (2.16.840.1.113883.11.20.9.21).

####Problem.status
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@displayName
- Will need to filter by OID so it doesn't accidentally pull other sub components (2.16.840.1.113883.10.20.22.4.6).
- Problem status uses 2.16.840.1.113883.3.88.12.80.68 for lookup, it is condition status and can be either active, inactive, or resolved.  can use display name, but should be pushed to use lookup.

###Problem.patient_status
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@displayName
- Will need to filter by OID so it doesn't accidentally pull other sub components (2.16.840.1.113883.10.20.22.4.5).
- Health status uses 2.16.840.1.113883.1.11.20.12 for lookup, can use display name, but should be pushed to use lookup.

####Problem.source_list_identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/id@root

