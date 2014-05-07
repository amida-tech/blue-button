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
    "status": {type:string: required: true},
    "name": {type:string, required: true}
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
    "administration": {
      "route": {
      	"name": {type: string, required: false},
      	"code": {type: string, required: false},
      	"code_system": {type: string, required: false}
      },
      "body_site": {type:string, required: false},
      "quantity": {
      	"value": {type:string, required: false},
      	"units": {type:string, required: false}
      },
      "form": {type:string, required:false}
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
- 'code' may come in, but not on samples and it doesn't define why, so not currently supported.
- statusCode comes in, but doesn't seem to mean anything.  It is 'completed' in all examples.
- series, performer, reaction, and refusal reason all seem to be optional.
- medication series number is either the number administered in a series, or the number to be in pending immunizations; captured as 'sequence_number.'
- Route code should come from one dataset, but is another in all the samples without a translation object.  Will need to support coded entries as such since the standard is contradictory.

####Immunization.date
- 0..2
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/effectiveTime
- Should be handled to account for each type of date.

####Immunization.identifiers
- 1..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/id@root
- Should be handled by common identifier parser.

####Immunization.status
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration@moodCode
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration@negationInd
- Combination of mood code and negation can determine status of either 'pending', 'refused', or 'complete'.

####Immunization.sequence_number
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/repeatNumber@value
- See notes for significance.

####Immunization.administration.route
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/routeCode
- Coded entry, should be treated like the rest.

####Immunization.administration.body_site
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/approachSiteCode/@value
- Always coded to SNOMED-CT if present.
- No demo files, can fake it for now and take displayName.

####Immunization.administration.quantity
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/doseQuantity
- This is a value/units pair, where units aren't required.
- If they do come in, they are picked from '2.16.840.1.113883.1.11.12839'

####Immunization.administration.form
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/administrationUnitCode
- This must be picked from 2.16.840.1.113883.3.88.12.3221.8.11.
- This code set is probably small enough to keep in memory (~200 entries).




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

