#Medications

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
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_id"
            },
            "minItems": 1
        },
        "sig": {
            "type": "string"
        },
        "status": {
            "type": "string"
        },
        "administration": {
            "type": "object",
            "properties": {
                "dose": {
                    "$ref": "http://local.com/common_models#/properties/cda_physical_quantity"
                },
                "form": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },
                "rate": {
                    "$ref": "http://local.com/common_models#/properties/cda_physical_quantity"
                },
                "route": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },
                "dose_restriction": {
                    "$ref": "http://local.com/common_models#/properties/cda_physical_quantity"
                },
                "site": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },
                "interval": {
                    "type": "object",
                    "properties": {
                        "xsiType": {
                            "type": "string"
                        },
                        "phase": {
                            "$ref": "http://local.com/common_models#/properties/cda_date"
                        },
                        "period": {
                            "$ref": "http://local.com/common_models#/properties/cda_physical_quantity"
                        },
                        "frequency": {
                            "type": "boolean"
                        },
                        "alignment": {
                            "type": "string"
                        },
                        "event": {
                            "type": "string"
                        },
                        "event_offset": {
                            "type": "object",
                            "properties": {
                                "low": {
                                    "$ref": "http://local.com/common_models#/properties/cda_physical_quantity"
                                },
                                "high": {
                                    "$ref": "http://local.com/common_models#/properties/cda_physical_quantity"
                                },
                                "center": {
                                    "$ref": "http://local.com/common_models#/properties/cda_physical_quantity"
                                },
                                "width": {
                                    "$ref": "http://local.com/common_models#/properties/cda_physical_quantity"
                                }

                            },
                            "additionalProperties": false

                        }
                    },
                    "additionalProperties": false
                }

            },
            "additionalProperties": false,
            "minProperties": 1
        },

        "precondition": {
            "type": "object",
            "properties": {
                "code": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },
                "value": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                }
            },
            "additionalProperties": false
        },
        "product": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_id"
                    },
                    "minItems": 1
                },
                "product": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },
                "unencoded_name": {
                    "type": "string"
                },
                "manufacturer": {
                    "type": "string"
                }
            },
            "additionalProperties": false,
            "minProperties": 1,
            "required": [
                "product"
            ]
        },
        "supply": {
            "type": "object",
            "properties": {
                "date_time": {
                    "$ref": "http://local.com/common_models#/properties/cda_date"
                },
                "repeatNumber": {
                    "type": "string"
                },
                "quantity": {
                    "type": "string"
                },
                "author": {
                    "type": "object",
                    "properties": {
                        "identifiers": {
                            "type": "array",
                            "items": {
                                "$ref": "http://local.com/common_models#/properties/cda_id"
                            },
                            "minItems": 1
                        },
                        "date_time": {
                            "$ref": "http://local.com/common_models#/properties/cda_date"
                        },
                        "name": {
                            "$ref": "http://local.com/common_models#/properties/cda_name"
                        },
                        "organization": {
                            "$ref": "http://local.com/common_models#/properties/cda_organization"  
                        }
                    },
                    "additionalProperties": false
                },
                "additionalProperties": false
            },
            "additionalProperties": false
        },
        "indication": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_id"
                    },
                    "minItems": 1
                },
                "code": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },
                "date_time": {
                    "$ref": "http://local.com/common_models#/properties/cda_date"
                },
                "value": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                }
            },
            "additionalProperties": false
        },
        "performer": {
            "$ref": "http://local.com/common_models#/properties/cda_performer"
        },
        "drug_vehicle": {
            "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
        },
        "dispense": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_id"
                    },
                    "minItems": 1
                },
                "performer": {
                    "$ref": "http://local.com/common_models#/properties/cda_performer"
                }
            },
            "additionalProperties": false
        }
    },
    "additionalProperties": false,
    "minProperties": 1,
    "required": [
        "product",
        "status"
    ]
}

```

- [JSON/XML sample](samples/medications.md)
- [JSON/CMS sample](cmssamples/medications.md)


####Notes
- No negation indicator on medications, thus only two states.
- Status coming in again, but doesn't seem to mean anything, as it's probably 'completed' in every one.
- delivery method may come in 'code', but of unspecified set or type, and no reference in files, so not currently supported.
- administrationTiming - PIVL very complex to write; put on backlog for now, and not currently supported.
- Drug manufacturer currently unsupported, cannot find reference structure.
- SHOULD Exception:  Freetext drug name is a randomly structured area pointing to an HTML element.  We currently don't have parsing support for these, so it is tabled for name.
- SHOULD Exception:  Interval not currently supported, parsers aren't written to properly handle this entry.

####Medication.date
- 0..2
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/effectiveTime
- Low is used for medication start, high is used for medication completion

####Medication.identifiers
- 1..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/id@root

####Medication.status
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration@moodCode INT or EVN (int prescribed, evn complete).
- Mood code can determine stateof either "prescribed" or "complete".

####Medication.sig
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/text/reference@value
- Sig is short for 'Signa.'  It's basically the prescription information in shorthand which is written on the label.

####Medication.product
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct
- Must be encoded in RxNorm, but translation may be in another language (e.g. SNOMED).

####Medication.product.product
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code

####Medication.product.unencoded_name
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code@originalText

####Medication.product.identifiers
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/id
- Optional identifiers may come in on the drugs.

####Medication.administration
- 0..1
- No direct XPath mapping; created category.
- All sub elements are optional.

####Medication.administration.route
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/routeCode

####Medication.administration.form
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/administrationUnitCode

####Medication.administration.dose
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/doseQuantity

####Medication.administration.dose_restriction
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/maxDoseQuantity

####Medication.administration.rate
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/rateQuantity

####Medication.administration.site
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/approachSiteCode

####Medication.precondition
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/precondition

####Medication.precondition.code
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/precondition/code

####Medication.precondition.value
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/precondition/value
