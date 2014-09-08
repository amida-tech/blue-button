#Shared Components

## cda_name

```
{
    "type": "object",
    "properties": {
        "prefix": {
            "type": "string"
        },
        "first": {
            "type": "string"
        },
        "last": {
            "type": "string"
        },
        "middle": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "suffix": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "last"
    ]
}
```




## cda_address

```
{
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
        "streetLines": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "minItems": 1
        },
        "use": {
            "type": "string"
        },
        "zip": {
            "type": "string"
        }
    },
    "required": [
        "streetLines",
        "city"
    ]
}
```
#### street
- 1..*
- streetAddressLine

#### city
- 1..1
- city

#### postal_code
- 0..1
- postalCode

#### country
- 0..1
- country

## cda_phone

```
{
    "type": "object",
    "properties": {
        "number": {
            "type": "string"
        },
        "type": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "number"
    ]
}
```

####number
- 1..1
- @value
- Each phone record should be checked for 'tel:' lead of value.

####type
- 1..1
- @use
- From table AdressUse 2.16.840.1.113883.5.1119

## cda_email

```
{
    "type": "object",
    "properties": {
        "email": {
            "type": "string"
        },
        "type": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "email"
    ]
}
```

####address
- 1..1
- @value
- Each email record should be checked for 'mailto:' lead of value.

####type
- 1..1
- @use
- From table AdressUse 2.16.840.1.113883.5.1119


## cda_location

```
{
    "type": "object",
    "properties": {
        "addresses": {
            "type": "array",
            "items": {
                "$ref": "#/properties/cda_address"
            },
            "minItems": 1
        },
        "loc_type": {
            "$ref": "#/properties/cda_coded_entry"
        },
        "name": {
            "type": "string"
        },
        "phones": {
            "type": "array",
            "items": {
                "$ref": "#/properties/cda_phone"
            }
        }
    },
    "required": [
        "name"
    ],
    "additionalProperties": false
}
```

#### name
- 0..1
- playingEntity/name

#### type
- 1..1
- code
- Should always be codified to HealthcareServiceLocation.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system

#### addresses
- 0..*
- addr

#### phones
- 0..*
- telecom

## cda_date

```
{
    "type": "object",
    "properties": {
        "date": {
            "type": "string",
            "format": "date-time"
        },
        "precision": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "date"
    ]
}
```

#### date
- 1..1
- @value, low/@value, high/@value
- should be handled to account for each type of date
- nullFlavor is not supported

#### precision
- 1..1
- @value, low/@value, high/@value
- records precision in the @values since that information is lost in date (javascript datetime)
- can be 'year', 'month', 'day', 'hour', 'minute', 'second', 'subsecond'

## cda_id

```
"cda_id": {
    "type": "object",
    "properties": {
        "identifier": {
            "type": "string"
        },
        "identifier_type": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "identifier"
    ]
}
```

#### identifier
- 1..1
- @root

#### identifier_type
- 1..1
- @extension

## cda_coded_entry
```
{
    "type": "object",
    "properties": {
        "code_system_name": {
            "type": "string"
        },
        "code": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "translations": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "code_system_name": {
                        "type": "string"
                    },
                    "code": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "additionalProperties": false,
                "minProperties": 1
            },
            "minItems": 1
        }
    },
    "minProperties": 1,
    "additionalProperties": false
}
```
#### name
- 1..1
- @displayName
- TODO:  Add handlers for lookup if displayName not present.

#### code
- 0..1
- @code

#### code_system
- 0..1
- @codeSystemName
- TODO:  Add OID based code system name lookup.

#### translations
- 0..*
- /translation
- Optional translations of coded entry.

#### translations.name
- 1..1
- @displayName
- TODO:  Add handlers for lookup if displayName not present.

#### translations.code
- 0..1
- @code

#### translations.code_system
- 0..1
- @codeSystemName
- TODO:  Add OID based code system name lookup.

##cda_physical_quantity

```
{
    "type": "object",
    "properties": {
        "unit": {
            "type": "string"
        },
        "value": {
            "type": "number"
        }
    },
    "additionalProperties": false,
    "required": [
        "unit",
        "value"
    ]
}
```

## cda_performer
- Many sections use this performer element, and as previously mentioned, this section is badly documented. Quantity specifications from CCDA specs are listed below.
- Currently in shared.js in ccda, the all fields are 0..*, which means that they are arrays. From a design perspective, this is optimal as some CCDAs may have flaws in their system and may not follow the specs exactly, i.e. have more addresses than they are supposed to have.
- 0..1 in plan_of_care, medication(dispense), medication activity, immunizations, 
- 0..* encounters, Procedure Activity Observation, Procedure Activity Procedure,
- 1..1 Procedure Activity Act

- 0..1 Address
- 0..1 Code

## cda_organization
- 0..1 (representedOrganization, providerOrganization), the top level elements containing this element must always have either 0 or 1.
- This element is commonly used, and varied throughout other sections, so it is warrented that the fields that have organizations can be classified as arrays. I've scanned through the documentation and noticed that most of the sections seemed to have telecom and address as 0..1, but the <providerOrganization> specifies 0..* for all fields. 
- 0..* id
- 0..* name
- 0..* telecom
- 0..* address
