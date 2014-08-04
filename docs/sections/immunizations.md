#Immunizations

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
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_id"
            }
        },
        "status": {
            "type": "string"
        },
        "sequence_number": {
            "type": "string"
        },
        "administration": {
            "type": "object",
            "properties": {
                "dose": {
                    "$ref": "http://local.com/common_models#/properties/cda_physical_quantity"
                },
                "route": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                },
                "body_site": {
                    "type": "string"
                },
                "form": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        },
        "product": {
            "type": "object",
            "properties": {
                "lot_number": {
                    "type": "string"
                },
                "manufacturer": {
                    "type": "string"
                },
                "product": {
                    "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                }
            },
            "required": [
                "product"
            ],
            "additionalProperties": false
        },
        "performer": {
            "type": "object",
            "properties": {
                "address": {
                    "type": "array",
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_address"
                    }
                },
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_id"
                    }
                },
                "name": {
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
                "organization": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "identifiers": {
                                "type": "array",
                                "items": {
                                    "$ref": "http://local.com/common_models#/properties/cda_id"
                                }
                            },
                            "name": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "address": {
                                "$ref": "http://local.com/common_models#/properties/cda_address"
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
                            }
                        },
                        "additionalProperties": false
                    }
                }
            },
            "additionalProperties": false
        },
        "refusal_reason": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "status",
        "product"
    ]
}
```

- [JSON/XML sample](samples/immunizations.md)
- [JSON/CMS sample](cmssamples/immunizations.md)


####Notes
- 'code' may come in, but not on samples and it doesn't define why, so not currently supported.
- statusCode comes in, but doesn't seem to mean anything.  It is 'completed' in all examples.
- series, performer, reaction, and refusal reason all seem to be optional.
- medication series number is either the number administered in a series, or the number to be in pending immunizations; captured as 'sequence_number.'
- Route code should come from one dataset, but is another in all the samples without a translation object.  Will need to support coded entries as such since the standard is contradictory.
- Only supporting manufacturer name for now.  I believe this can have more information attached.
- Performer just a wrapper for assignedEntity.
- Not supported: patient instructions, precondition, medication supply order, medication dispense, reaction.

####Immunization.date
- 0..2
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/effectiveTime
- Should be handled to account for each type of date.

####Immunization.identifiers
- 1..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/id

####Immunization.status
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration@moodCode
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration@negationInd
- Combination of mood code and negation can determine status of either 'pending', 'refused', or 'complete'.

####Immunization.sequence_number
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/repeatNumber@value
- See notes for significance.

####Immunizations.product
- 1..1
- Container object for product information.

####Immuinzations.product.product
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code
- All of these should be coming in as CVX coded, so no need for code system.  Might want to normalize them.

####Immunizations.product.lot_number
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/lotNumberText

####Immunizations.product.manufacturer
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturerOrganization/name
- May support more than just a name element, not sure.  However, just supporting name for now.

####Immunization.administration
- 0..1
- No direct mapping
- This is a catch all for every non-primary attribute of the product's delivery.  All elements herein are optional at this point.

####Immunization.administration.route
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/routeCode
- Coded entry, should be treated like the rest.

####Immunization.administration.body_site
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/approachSiteCode/@value
- Always coded to SNOMED-CT if present.
- No demo files, can fake it for now and take displayName.

####Immunization.administration.dose
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/doseQuantity
- This is a value/units pair, where units aren't required.
- If they do come in, they are picked from '2.16.840.1.113883.1.11.12839'

####Immunization.administration.form
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/administrationUnitCode
- This must be picked from 2.16.840.1.113883.3.88.12.3221.8.11.
- This code set is probably small enough to keep in memory (~200 entries).

####Immunization.performer
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity
- http://www.cdapro.com/know/26953 <-- helpful link.
- This object is impossible; there is practically no information on it's structure in the standard.
- assignedEntity seems to be the defacto element within, which is also poorly documented.
- Will attempt to parse what I can based on demo files.  Everything under here is highly speculative.

####Immunization.performer.identifiers
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/id

####Immunization.performer.address
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/addr
- Need to write a standard address parser for this element, should be used in demographics, etc. as well.
- Lack of spec makes assumption, one address for this performer.

####Immunization.performer.phone
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/telecom

####Immunization.performer.email
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/telecom

####Immunization.performer.name
- 0..1?
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/assignedPerson/name
- Need to write a standard address parser for this element, should be used in demographics, etc. as well.
- Lack of spec makes assumption, one name for this performer.

####Immunization.performer.organization
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization
- Inferred from standard only.

####Immunization.performer.organization.name
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/name
- Should just be name value, no need for structured name.

####Immunization.performer.organization.phone
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/telecom

####Immunization.performer.organization.email
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/telecom

####Immunization.performer.organization.address
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/addr

####Immunization.performer.organization.identifiers
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/id

####Immunization.refusal_reason
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/entryRelationship/observation/code@displayName
- Should probably be recoded, set small enough.  2.16.840.1.113883.5.8