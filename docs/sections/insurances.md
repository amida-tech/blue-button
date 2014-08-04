#Insurances

###Object Schema:
```
{
    "type": "object",
    "$schema": "http://json-schema.org/draft-04/schema",
    "properties": {
        "address": {
            "type": "string"
        },
        "assigned_person": {
            "type": "string"
        },
        "date": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_date"
            }
        },
        "email ": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_address"
            }
        },
        "group_name": {
            "type": "string"
        },
        "group_number": {
            "type": "string"
        },
        "member_name": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "payer_id_type": {
            "type": "string"
        },
        "payer_id": {
            "type": "string"
        },
        "payer_name": {
            "type": "string"
        },
        "phone ": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_phone"
            }
        },
        "plan_id": {
            "type": "string"
        },
        "plan_information": {
            "type": "string"
        },
        "plan_name": {
            "type": "string"
        },
        "policy_number": {
            "type": "string"
        },
        "type": {
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    }
}
```

[JSON/CMS sample](cmssamples/insurances.md)

####Notes
