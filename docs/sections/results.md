#Results

###Object Schema:
```
var Result = {
        "date": [{cda_date}],
        "identifiers": [{cda_id}],
        "status": {type: string, required: true},
        "name": {type: string, required: true},
        "code": {type: string, required: false},
        "code_system_name": {type: string, required: false},
        "value": {type: string, required: false},
        "unit": {type: string, required: false},
        "reference_range": {
          "text": {type: string, required: false},
          "low_value": {type: string, required: false},
          "low_unit": {type: string, required: false},
          "high_value": {type: string, required: false},
          "high_unit": {type: string, required: false}
        },
        "category": {
           "name": {type: string, required: true},
           "code": {type: string, required: true},
           "code_system_name": {type: string, required: true}
        }
      }
```

[JSON/XML sample](samples/results.md)


####Notes
- TypeCode "Cluster" vs. "Battery" seems extraneous.
- LOINC, SNOMED or CPT-4 acceptable coding systems.
- If not an accepted code set, should be set in the translation component.
- Results come in a sub-array; should be inverted so actual result is first class object.
- Inversion means you must loop sub element for each result section, append parent.
- Results may come un-encoded, or coded to localized system.
- EffectiveTime may come in as TS or IVL-TS, so it is stored as an array to account for possibly 2 values.
- TODO:  Afsin thinks the second structuredBody/component are optional.  Need to check it out.
- NOT SUPPORTED:  methodCode, targetSiteCode, author.
- Reference Range is poorly designed, but appears to be either in text, or IVL_PQ format, so implementing both.
- Reference Range low is technically the only one required if using IVL_PQ.

####Result.date
- 1..2
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/effectiveTime

####Result.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/id

####Result.status
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/status
- Should be looked up from set 2.16.840.1.113883.11.20.9.39

####Result.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/displayName
- Normalization may re-encode this to standard terminology if coded in a common dataset.
- If not present, and not coded, originalText can be taken from below:
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/originalText

####Result.code
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/code
- Listed as not required to support uncoded or local datasets.

####Result.code_system_name
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/codeSystemName
- Listed as not required to support uncoded or local datasets.
- If not present, should attempt to lookup OID name from element below:
//ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/codeSystem

####Result.value
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/value@value
- Reference 2.28 of CDA spec for PQ style.  All I've seen so far.
- Optional, but results are largely worthless without it.

####Result.unit
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/value@unit
- Reference 2.28 of CDA spec for PQ style.  All I've seen so far.
- Optional, but results are largely worthless without it.

####Result.reference_range
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange

####Result.reference_range.text
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/text

####Result.reference_range.low_value
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/low@value

####Result.reference_range.low_unit
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/low@unit

####Result.reference_range.high_value
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/high@value

####Result.reference_range.high_unit
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/high@unit

####Result.category.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/code@displayName
- Can be overwritten based on coding system during normalization.

####Result.category.code
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/code@code

####Result.category.code_system_name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/code@codeSystemName
- Can be overwritten based on coding system during normalization.
