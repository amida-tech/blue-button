#Allergies

###Object Schema:
```
{
    "type": "object",
    "$schema": "http://json-schema.org/draft-04/schema",
    "properties": {
        "date_time": {
            "$ref": "http://local.com/common_models#/properties/cda_date"
        },
        "identifiers": {
            "type": "array",
            "minItems": 1,
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_id"
            }
        },
        "observation": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_id"
                    }
                },

                "negation_indicator": {
                    "type": "boolean"
                },

                "allergen": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },
                "intolerance": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },
                "date_time": {
                    "$ref": "http://local.com/common_models#/properties/cda_date"
                },
                "status": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },

                "reactions": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "properties": {
                            "date_time": {
                                "$ref": "http://local.com/common_models#/properties/cda_date"
                            },
                            "reaction": {
                                "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                            },
                            "severity": {
                                "type": "object",
                                "properties": {
                                    "code": {
                                        "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                                    },
                                    "interpretation": {
                                        "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                                    }
                                },
                                "additionalProperties": false
                            }
                        },
                        "additionalProperties": false


                    }
                },
                "severity": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                        },
                        "interpretation": {
                            "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                        }
                    },
                    "additionalProperties": false
                }
            },
            "additionalProperties": false
        },
        "additionalProperties": false
    },
    "additionalProperties": false
}
```

- [JSON/XML sample](samples/allergies.md)
- [JSON/CMS sample](cmssamples/allergies.md)

####Notes
- Name and code are optional in the spec.  In this model we assume they are required.
- All fields except date are based on allergy observation.  Date is based on Problem Act.
- Observations can be multiple in the spec.  In this model they are assumed to be unique.
- Observation and reactions have dates independent of problem act in the spec.  They are ignored in this model.
- Severities can have interpretation codes.  These are ignored in this model.
- Status comes from observation status.  Problem Act status is ignored.
- Reaction Procedure Activity and Medication Activity relationships are ignored.


####Allergy.date
- 0..2
- //ClinicalDocument/component/structuredBody/component/section/entry/act/effectiveTime

####Allergy.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/id

####Allergy.allergen
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/participant/participantRole/playingEntity/code
- Container object for allergen details.
- Can be be from RXNORM, UNII, or NDF-RT.
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

###Allergy.reactions
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation
- OID 2.16.840.1.113883.10.20.22.4.9.

###Allergy.reactions.reaction
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@displayName
- Should always be codified to SNOMED-CT.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Allergy.reactions.severity
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/act/entryRelationship/observation/entryRelationship/observation/value@displayName
- OID 2.16.840.1.113883.10.20.22.4.8.
- Uses Problem Severity 2.16.840.1.113883.3.88.12.3221.6.8 for lookup.


