#Problems

###Object Schema:
```
var Problems = {
        "date": [{cda_date}],
        "identifiers": [{cda_id}],
        "negation_indicator": {type: boolean, required: false},
        "problem": {cda_coded_entry},
        "onset_age": {type: string, required: false},
        "onset_age_unit": {type: string, required: false},
        "status": {type: string, required: false}, 
        "patient_status": {type: string, required: false},
        ,
        "source_list_identifiers": [{cda_id}]
      }
```

[JSON/XML sample](samples/problems.md)


####Notes
- Negation indicator saying problem 'wasn't' observed, seems crazy, but important to watch for.
- Problems can be translated using translation object.
- Must account for each sub-format and normalize into common model.
- Need to flip this object so it is granular to the observation level.  The only observation header element which is valuable is an identifier, and a date; the id may be valuable later for matching, and the date represents the time during which the observations were on the problem list.  It's more 'source' data than clinically relevant.
- Problem type being ignored; seems extraneous for now and semantically subjective.
- Wrapper 'list' data can be sub object for attribution as source_list.
- Ignoring text for now, only html reference.


####Problem.date
- 0..2
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/effectiveTime

####Problem.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/id@root

####Problem.negation_indicator
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation@negationInd
- Should be assumed to be false for safety reasons if not present; true if it is a negation.

####Problem.problem
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/value
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
- //ClinicalDocument/component/structuredBody/component/section/entry/act/id

