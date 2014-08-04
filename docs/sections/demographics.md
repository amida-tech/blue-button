#Demographics

###Object Schema:

```
{
    "type": "object",
    "$schema": "http://json-schema.org/draft-04/schema",
    "properties": {
        "name": {
            "$ref": "http://local.com/common_models#/properties/cda_name"
        },
        "dob": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "$ref": "http://local.com/common_models#/properties/cda_date"
                },
                "minItems": 1
            }
        },
        "gender": {
            "type": "string"
        },
        "identifiers": {
            "type": "array",
            "minItems": 1,
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_id"
            }
        },
        "marital_status": {
            "type": "string"
        },
        "addresses": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_address"
            },
            "minItems": 1
        },
        "phone": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_phone"
            }
        },
        "email": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_email"
            }
        },
        "race_ethnicity": {
            "type": "string"
        },
        "religion": {
            "type": "string"
        },
        "birthplace": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "state": {
                    "type": "string"
                },
                "zip": {
                    "type": "string"
                }
            },
            "additionalProperties": false,
            "minProperties": 1,
            "required": [
                "city",
                "country"
            ]
        },
        "guardians": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "addresses": {
                        "type": "array",
                        "items": {
                            "$ref": "http://local.com/common_models#/properties/cda_address"
                        }
                    },
                    "names": {
                        "type": "array",
                        "items": {
                            "$ref": "http://local.com/common_models#/properties/cda_name"
                        }
                    },
                    "phone": {
                        "type": "array",
                        "items": {
                            "$ref": "http://local.com/common_models#/properties/cda_phone"
                        }
                    },
                    "relation": {
                        "type": "string"
                    }
                },
                "required": [
                    "names"
                ],
                "additionalProperties": false,
                "minProperties": 1
            },
            "minItems": 1
        },
        "languages": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "language": {
                        "type": "string"
                    },
                    "mode": {
                        "type": "string"
                    },
                    "preferred": {
                        "type": "boolean"
                    },
                    "proficiency": {
                        "type": "string"
                    }
                },
                "additionaLProperties": 1,
                "required": [
                    "language"
                ]
            },
            "minItems": 1
        }
    },
    "additionalProperties": false,
    "required": [
        "name"
    ]
}
```

- [JSON/XML sample](samples/demographics.md)
- [JSON/CMS sample](cmssamples/demographics.md)

####General Notes
* Assumption:  Each record can have more than one recordTarget.  This seems inaccurate, as it would result in duplicative patient information, so it is ignored.

#####Changes
* Added identifier.
* Refactored address to have indicators.
* Extended name object.
* Added DOB precision.
* Redefined "zip" to "postal_code", now a string.
* Changed phones to be array, no rule against multiple home or work numbers.
* Added "other" to phone, to support "vacation phone."
* Changed email to an array.
* Language 'en-US' implied record language, not spoken language.  Removed.
* Merged race and ethnicity fields (see notes below).
* Rewired guardian to use common objects.
* Added NPI, changed provider to use common objects.

####name
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/name
* OID: 2.16.840.1.113883.10.20.22.5
* Not supported:  Optional "@use" element.

####dob
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/birthTime
* This must be precise to at least year.
* Currently an array of length one to match other time fields.  Need to be changed.

####gender
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/administrativeGenderCode@code
* must equal either 'M', 'F', or 'UN'.

####identifiers
* 0..*
* //ClinicalDocument/recordTarget/patientRole/id
* Technically, this is required.  However, nullFlavor is acceptable.  If nullFlavor is found, the identifier should be rejected.

####marital_status
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/maritalStatusCode@code
* Code should be translated to text against HL7 Marital Status 2.16.840.1.113883.1.11.12212 DYNAMIC.

####address

* 1..*
* //ClinicalDocument/recordTarget/patientRole/addr
* Addresses must conform to US Realm Address (AD.US.FIELDED).

####address.type
* 1..1
* //ClinicalDocument/recordTarget/patientRole/addr@use
* This is derivative of PostalAddressUse 2.16.840.1.113883.1.11.10637 STATIC.
* If this field is in ('HP'(primary home), 'H'(home address), or 'HV'(vacation home), should be 'home'.
* If this field is 'WP'(work place), should be 'work'.
* If not home or work, should be 'other'.

####address.primary
* 1..1
* //ClinicalDocument/recordTarget/patientRole/addr@use
* If this field is 'HP'(primary home), this should be set to true.  Otherwise, it should be false.

####address.street
* 1..4
* //ClinicalDocument/recordTarget/patientRole/street[0-3]
* Note: Should be stored sequentially, array order important.

####address.city
* 1..1
* //ClinicalDocument/recordTarget/patientRole/city

####address.state
* 0..1
* //ClinicalDocument/recordTarget/patientRole/state
* State is required for all US-based addresses only.

####address.postal_code
* 0..1
* //ClinicalDocument/recordTarget/patientRole/postalCode
* Postal Code is required for all US-based addresses only.

####address.country
* 0..1
* //ClinicalDocument/recordTarget/patientRole/country
* If no country is present, it is assumed to be US.

####phone
* 1..*
* //ClinicalDocument/recordTarget/patientRole/phone
* Each record must have at least one phone or email entry.
* Each phone record should be checked for 'tel:' lead of value.

####email
* 0..*
* //ClinicalDocument/recordTarget/patientRole/telecom
* Each phone record should be checked for 'mailto:' lead of value.

####race_ethnicity
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/raceCode@code
* //ClinicalDocument/recordTarget/patientRole/patient/ethnicGroupCode@code
* Ethnicity only exists because race's source set doesn't account for hispanics.
* If ethnicity is "2135-2", take ethnicity field.  Otherwise, take this field.
* Should be looked up against a code set.

####religion
* 0..1
* /ClinicalDocument/recordTarget/patientRole/patient/religiousAffiliationCode@code
* Should be looked up against a code set.

####languages
* 0..*
* /ClinicalDocument/recordTarget/patientRole/patient/languageCommunication

####languages.language
* 1..1
* /ClinicalDocument/recordTarget/patientRole/patient/languageCommunication/code

####languages.preferred
* 0..*
* /ClinicalDocument/recordTarget/patientRole/patient/languageCommunication/preferred

####languages.mode
* 0..*
* * /ClinicalDocument/recordTarget/patientRole/patient/languageCommunication/mode

####languages.proficiency
* 0..*
* /ClinicalDocument/recordTarget/patientRole/patient/languageCommunication/proficiency

####birthplace
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/birthPlace/place
* Is a subset of a standard address components, including possibly postalCode, state, and country.

####guardian
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian

####guardian.relation
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/code@code
* Should be looked up against reference table OID 2.16.840.1.113883.1.11.19563 DYNAMIC.

####guardian.address
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/address
* Uses the same model and requirements as the patient address.

####guardian.phone
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/telecom
* Each phone record should be checked for 'tel:' lead of value.

####guardian.email
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/telecom
* Each phone record should be checked for 'mailto:' lead of value.

####guardian.name
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/name
* OID: 2.16.840.1.113883.10.20.22.5
* Not supported:  Optional "@use" element.