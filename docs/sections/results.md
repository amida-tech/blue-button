#Results

###Object Schema:
```
{
    "type": "object",
    "$schema": "http://json-schema.org/draft-04/schema",
    "properties": {
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_id"
            },
            "minItems": 1
        },
        "result_set": {
            "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
        },
        "results": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "array",
                        "items": {
                            "$ref": "http://local.com/common_models#/properties/cda_date"
                        }
                    },
                    "identifiers": {
                        "type": "array",
                        "items": {
                            "$ref": "http://local.com/common_models#/properties/cda_id"
                        }
                    },
                    "interpretations": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "result": {
                        "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                    },
                    "status": {
                        "type": "string"
                    },
                    "unit": {
                        "type": "string"
                    },
                    "value": {
                        "type": "number"
                    },
                    "text": {
                        "type": "string"
                    },
                    "reference_range": {
                        "type": "object",
                        "properties": {
                            "text": {
                                "type": "string"
                            },
                            "low_value": {
                                "type": "number"
                            },
                            "low_unit": {
                                "type": "string"
                            },
                            "high_value": {
                                "type": "number"
                            },
                            "high_unit": {
                                "type": "string"
                            }
                        }
                    }
                },
                "required": [
                "result",
                "date",
                "status"
            ],
            "additionalProperties":false
            }
            
        }
    },
    "additionalProperties":false,
    "required": [
        "results"
    ]
}
```

- [JSON/XML sample](samples/results.md)
- [JSON/CMS sample](cmssamples/results.md)


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

####Result_set.result_set
- 1..1
- Coded entry describing type of result set.
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/code

####Result_set.results
- 0..*
- Actual result findings.
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component

####Result_set.results.date
- 1..2
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/effectiveTime

####Result_set.results.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/id

####Result_set.results.status
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/statusCode
- Should be looked up from set 2.16.840.1.113883.11.20.9.39

####Result_set.results.result
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/displayName
- Normalization may re-encode this to standard terminology if coded in a common dataset.
- If not present, and not coded, originalText can be taken from below:
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/code/originalText

####Result_set.results.value
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/value@value
- Reference 2.28 of CDA spec for PQ style.  All I've seen so far.
- Optional, but results are largely worthless without it.

####Result_set.results.unit
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/value@unit
- Reference 2.28 of CDA spec for PQ style.  All I've seen so far.
- Optional, but results are largely worthless without it.

####Result_set.results.text
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/text
- Amended as freetext alternative to value/units pairing; this is possible in C32 data.


####Result_set.results.reference_range
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange

####Result_set.results.reference_range.text
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/text

####Result_set.results.reference_range.low_value
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/low@value

####Result_set.results.reference_range.low_unit
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/low@unit

####Result_set.results.reference_range.high_value
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/high@value

####Result_set.results.reference_range.high_unit
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/organizer/component/observation/referenceRange/observationRange/high@unit
