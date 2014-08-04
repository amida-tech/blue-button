#Vitals

###Object Schema:
```
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "identifiers": {
            "type": "array",
            "items": {
            "$ref": "http://local.com/common_models#/properties/cda_id"
        },
        "minItems":1
        },
        "vital": {
            "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
        },
        "status": {
            "type": "string"
        },
        "date": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_date"
            }
        },
        "interpretations": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "value": {
            "type": "integer"
        },
        "unit": {
            "type": "string"
        }
    },
    "additionalProperties":false,
    "required":["vital"]
}
```

- [JSON/XML sample](samples/vitals.md)
- [JSON/CMS sample](cmssamples/vitals.md)


####Notes
- TypeCode always "Cluster".
- Vital Signs are identical to results, however are limited to a specific subset of LOINC codes in set 2.16.840.1.113883.3.88.12.80.62.  Thus coding system will always be LOINC.
- Vitals come in a sub-array; should be inverted so actual result is first class object.
- Inversion means you must loop sub element for each result section, append parent.
- EffectiveTime may come in as TS or IVL-TS, so it is stored as an array to account for possibly 2 values.
- NOT SUPPORTED:  methodCode, targetSiteCode, author.
- Reference Range isn't here, rather observation interpretation.
- Observation interpretation appears to require OID set 2.16.840.1.113883.5.83.
- Interpretation reference code set:  https://phinvads.cdc.gov/vads/ViewCodeSystem.action?id=2.16.840.1.113883.5.83
- Categorization not needed, they are all vitals.

####Vitals.date
- 1..2
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/effectiveTime

####Vitals.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/id

####Vitals.status
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/status
- Should be looked up from set 2.16.840.1.113883.11.20.9.39

####Vitals.vital
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/displayName
- Normalization may re-encode this to standard terminology if coded in a common dataset.
- If not present, and not coded, originalText can be taken from below:
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/originalText

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

