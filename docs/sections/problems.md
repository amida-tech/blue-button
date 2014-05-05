#Problems

###Object Schema:
```
var Problems = {
        "date": [{
          "date":{type: datetime, required: true},
          "precision":{type:string, required: true}
        }],
        "identifiers": [{
          "identifier": {type:string, required: true},
          "identifier_type": {type:string, required: true}
        }],
        "status": {type: string, required: true},
        "name": {type: string, required: true},
        "code": {type: string, required: false},
        "code_system": {type: string, required: false},
        "value": {type: string, required: false},
        "unit": {type: string, required: false},
        "interpretation": {type: string, required: false},
        ,
        "category": {
           "name": {type: string, required: true},
           "code": {type: string, required: true},
           "code_system": {type: string, required: true}
        }
      }
```

{
    "date_range": {
      "start": "2010-03-31T04:00:00.000Z",
      "end": null
    },
    "name": "Asthma unspecified",
    "status": "Active",
    "age": null,
    "code": "195979001",
    "code_system": "2.16.840.1.113883.6.96"
  }



####Notes
- Negation indicator saying problem 'wasn't' observed, a rediculous idea but important to watch for.
- Much like labs, section is a list of objects, need to invert model.
- Can come in one of two entry Observation formats.  Either Health Status Observation, or Problem Status.
- Problems can be translated using translation object.
- Observed vs. Onset, both there and probably worth capturing.

####Vitals.date
- 1..2
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/effectiveTime
- Should be handled to account for each type of date.

####Vitals.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/id

####Vitals.status
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/status
- Should be looked up from set 2.16.840.1.113883.11.20.9.39

####Vitals.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/displayName
- Normalization may re-encode this to standard terminology if coded in a common dataset.
- If not present, and not coded, originalText can be taken from below:
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/originalText

####Vitals.code
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/code
- Listed as not required to support uncoded or local datasets.

####Vitals.code_system
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/codeSystemName
- Listed as not required to support uncoded or local datasets.
- If not present, should attempt to lookup OID name from element below:
//ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/codeSystem

####Vitals.value
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/value@value
- Reference 2.28 of CDA spec for PQ style.  All I've seen so far.
- Optional, but results are largely worthless without it.

####Vitals.unit
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/value@unit
- Reference 2.28 of CDA spec for PQ style.  All I've seen so far.
- Optional, but results are largely worthless without it.

####Vitals.interpretation
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/interpretationCode@code
- This is limited to a specific code set.  This should be interpreted into a free text value, rather than just taking the code value.

