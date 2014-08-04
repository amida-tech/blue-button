#Encounters

###Object Schema:
```
{
    "type": "object",
    "$schema": "http://json-schema.org/draft-04/schema",
    "properties": {
        "date": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_date"
            }
        },
        "encounter": {
            "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
        },
        "findings": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
            }
        },
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_id"
            }
        },
        "locations": {
            "type": "array",
            "items": {
                 "$ref": "http://local.com/common_models#/properties/cda_location"
            }
        }
    },
    "additionalProperties":false,
    "required":["encounter"]
}
```

[JSON/XML sample](samples/encounters.md)


####Notes
- Root name, code and code_system_name can be translated using translation objects.
- Finding might have a date range, a timestamp, or an additional coded value.  These are currently are not supported.
- Encounter diagnosis is not yet supported.

####Encounter.date
- 0..2
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/effectiveTime

####Encounter.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/id

####Encounter.encounter
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/code
- Must be selected from EncounterTypeCode.
- A translation object is possible.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system.

####Encounter.locations
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/participant/participantRole

###Encounter.findings
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/encounter/entryRelationShip/observation
- Should always be codified to SNOMED-CT.
- A translation object is possible instead of SNOMED.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system

