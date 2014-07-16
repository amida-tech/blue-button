#SocialHistory

###Object Schema:
```
{
    "type": "object",
    "$schema": "http://json-schema.org/draft-04/schema",
    "properties": {
        "smoking_statuses": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "array",
                        "items": {
                            "$ref": "http://local.com/common_models#/properties/cda_date"
                        }
                    },
                    "value": {
                        "type": "string"
                    }
                },
                "required": [
                "value"
            ]
            }
        }
    },
    "additionalPropertes": true
}
```

- [JSON/XML sample](samples/socialHistory.md)


####Notes
- MAY components Social History Observation, Pregnancy Observation and Tobacca Use are not supported.
- title and text fields are ignored.
- no identifiers since there is none in the spec.

#### smoking_statuses
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/observation

#### smoking_statuses.value
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/value/@code
- normalized to display name from Smoking Status value set (2.16.840.1.113883.11.20.9.38)
- all values in Smoking Status value set comes from SNOMED CT.

#### smoking_statuses.date
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/effectiveTime
- smoking start and end date's for smoker
- either start date or both an be required based on value
