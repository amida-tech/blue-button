/*this schema generator has no use other than to supplement generateSchema in the
main parsing directory. */

/* Will also need to discuss whether insurances needs to be generated/included into
ccda */
"use strict";

var schema = {
    "insurance": {
        "addresses": [{
            "streetLines": [
                "string"
            ],
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "use": "string"
        }],
        "date": [{
            "date": "datetime",
            "precision": "string"
        }],
        "plan_id": {
            "identifier": "string",
            "identifier_type": "string"
        },
        "plan_information": "string",
        "plan_name": "string",
        "policy_number": "string",
        "type": [
            "string"
        ],
        "group_name": "string",
        "group_number": "string",
        "member_name": {
            "prefix": "string",
            "middle": [
                "string"
            ],
            "last": "string",
            "suffix": "string",
            "first": "string"
        },
        "member_id": {
            "identifier": "string",
            "identifier_type": "string"
        },
        "payer_name": "string",
        "payer_id": {
            "identifier": "string",
            "identifier_type": "string"
        },
        "email": [{
            "address": "string",
            "type": "string"
        }],
        "phone": [{
            "number": "string",
            "type": "string"
        }]
    },
    "claims": {
        "charges": {
            "insurance_paid": "string",
            "negotiated_price": "string",
            "patient_responsibility": "string",
            "price_billed": "string",
            "provider_paid": "string"
        },
        "diagnosis": [{
            "name": "string",
            "code": "string",
            "code_system_name": "string",
            "nullFlavor": "string",
            "translations": [{
                "name": "string",
                "code": "string",
                "code_system_name": "string",
                "nullFlavor": "string"
            }]
        }],
        "lines": [{
            "charges": {
                "insurance_paid": "string",
                "negotiated_price": "string",
                "patient_responsibility": "string",
                "price_billed": "string",
                "provider_paid": "string"
            },
            "drug": {
                "code": "string",
                "description": "string",
                "name": "string"
            },
            "end_date": {
                "date": "datetime",
                "precision": "string"
            },
            "modifier": [{
                "code": "string",
                "description": "string",
                "name": "string"
            }],
            "number": "string",
            "place_of_service": {
                "code": "string",
                "description": "string",
                "name": "string"
            },
            "proscriber": {
                "id": {
                    "identifier": "string",
                    "identifier_type": "string"
                },
                "description": "string",
                "name": "string"
            },
            "procedure": {
                "code": "string",
                "description": "string",
                "name": "string"
            },
            "quantity": {
                "value": "number",
                "unit": "string"
            },
            "rendering provider": {
                "npi": "string",
                "number": "string"
            },
            "revenue": {
                "code": "string",
                "description": "string",
                "name": "string"
            },
            "service_date": {
                "date": "datetime",
                "precision": "string"
            },
            "start_date": {
                "date": "datetime",
                "precision": "string"
            },
            "provider": {
                "provider_id": "string",
                "provider_name": "string"
            },
            "type": {
                "code": "string",
                "name": "string"
            },
            "rendering_provider": {
                "number": "string",
                "npi": "string"
            }
        }],
        "name": "string",
        "start_date": {
            "date": "datetime",
            "precision": "string"
        },
        "end_date": {
            "date": "datetime",
            "precision": "string"
        },
        "number": "string",
        "payer": ["string"],
        "provider": {
            "name": "string",
            "address": {
                "streetLines": [
                    "string"
                ],
                "city": "string",
                "state": "string",
                "zip": "string",
                "country": "string",
                "use": "string"
            },
            "identifiers": [{
                "identifier": "string",
                "identifier_type": "string"
            }],
            "organization": {
                "address": {
                    "streetLines": [
                        "string"
                    ],
                    "city": "string",
                    "state": "string",
                    "zip": "string",
                    "country": "string",
                    "use": "string"
                },
                "name": "string",
                "phone": [{
                    "number": "string",
                    "type": "string"
                }],
                "email": [{
                    "address": "string",
                    "type": "string"
                }],
                "provider_id": {
                    "identifier": "string",
                    "identifier_type": "string"
                }
            }
        },
        "service": "string",
        "type": [
            "string"
        ]
    }
};

module.exports = schema;
