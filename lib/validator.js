//validation of JSON model (optional)

//This is composite file of all "data model schemas" from documentation converted into proper JS
//Just for reference only, for now

"use strict";

//Shared
var cda_address = {
    "street": [{
        type: "string",
        required: true
    }],
    "city": {
        type: "string",
        required: true
    },
    "state": {
        type: "string",
        required: false
    },
    "postal_code": {
        type: "string",
        required: false
    },
    "country": {
        type: "string",
        required: false
    }
};

var cda_phone = {
    "number": {
        type: "string",
        required: true
    },
    "type": {
        type: "string",
        required: true
    }
};

var cda_telecom = {
    "value": {
        type: "string",
        required: true
    },
    "use": {
        type: "string",
        required: true
    }
};

var cda_concept = {
    "name": {
        type: "string",
        required: true
    },
    "code": {
        type: "string",
        required: true
    },
    "code_system_name": {
        type: "string",
        required: true
    }
};

var cda_location = {
    "name": {
        type: "string",
        required: false
    },
    "type": {
        type: cda_concept
    },
    "addresses": [{
        type: cda_address
    }],
    "phones": [{
        type: cda_phone
    }]
};

var cda_date = {
    "date": {
        type: "datetime",
        required: true
    },
    "precision": {
        type: "string",
        required: true
    }
};

var cda_id = {
    "identifier": {
        type: "string",
        required: true
    },
    "identifier_type": {
        type: "string",
        required: true
    }
};

//Demographics
var cda_usr_address = {
    "type": {
        type: "string",
        required: true
    },
    "primary": {
        type: "boolean",
        required: true
    },
    "street": [{
        type: "string",
        required: true
    }],
    "city": {
        type: "string",
        required: true
    },
    "state": {
        type: "string",
        required: false
    },
    "postal_code": {
        type: "string",
        required: false
    },
    "country": {
        type: "string",
        required: false
    }
};

var cda_name = {
    "prefix": [{
        type: "string",
        required: false
    }],
    "first": {
        type: "string",
        required: true
    },
    "middle": [{
        type: "string",
        required: false
    }],
    "last": {
        type: "string",
        required: true
    },
    "suffix": {
        type: "string",
        required: false
    }
};

var demographics = {
    "name": {
        type: cda_name
    },
    "dob": [{
        type: cda_date
    }],
    "gender": {
        type: "string",
        required: true
    },
    "identifiers": [{
        type: cda_id
    }],
    "marital_status": {
        type: "string",
        required: false
    },
    "address": [{
        type: cda_usr_address
    }],
    "phone": [{
        "number": {
            type: "string",
            required: true
        },
        "type": {
            type: "string",
            required: true
        }
    }],
    "email": [{
        "address": {
            type: "string",
            required: true
        },
        "type": {
            type: "string",
            required: true
        }
    }],
    "race_ethnicity": {
        type: "string",
        required: false
    },
    "religion": {
        type: "string",
        required: false
    },
    "languages": [{
        "language": {
            type: "string",
            required: true
        },
        "preferred": {
            type: "boolean",
            required: false
        },
        "mode": {
            type: "string",
            required: false
        },
        "proficiency": {
            type: "string",
            required: false
        }
    }],
    "birthplace": {
        "state": {
            type: "string",
            required: false
        },
        "postal_code": {
            type: "string",
            required: false
        },
        "country": {
            type: "string",
            required: false
        }
    },
    "guardian": {
        "name": {
            type: cda_name
        },
        "relationship": {
            type: "string",
            required: false
        },
        "address": [{
            type: cda_usr_address
        }],
        "phone": [{
            "number": {
                type: "string",
                required: true
            },
            "type": {
                type: "string",
                required: true
            }
        }],
        "email": [{
            "address": {
                type: "string",
                required: true
            },
            "type": {
                type: "string",
                required: true
            }
        }]
    }
};


//Allergies
var Allergies = {
    "date": [{
        type: cda_date
    }],
    "identifiers": [{
        type: cda_id
    }],
    "name": {
        type: "string",
        required: true
    },
    "code": {
        type: "string",
        required: false
    },
    "severity": {
        type: "string",
        required: false
    },
    "status": {
        type: "string",
        required: false
    },
    "reaction": [{
        "code": {
            type: "string",
            required: true
        },
        "name": {
            type: "string",
            required: true
        },
        "code_system_name": {
            type: "string",
            required: true
        },
        "severity": {
            type: "string",
            required: false
        },
    }]
};


//Immunizations
var Immunizations = {
    "date": [{
        type: cda_date
    }],
    "identifiers": [{
        type: cda_id
    }],
    "status": {
        type: "string",
        required: true
    },
    "sequence_number": {
        type: "string",
        required: false
    },
    "product": {
        "name": {
            type: "string",
            required: true
        },
        "code": {
            type: "string",
            required: true
        },
        "code_system": {
            type: "string",
            required: true
        },

        "translations": [{
            "name": {
                type: "string",
                required: false
            },
            "code": {
                type: "string",
                required: false
            },
            "code_system": {
                type: "string",
                required: false
            },
        }],

        "lot_number": {
            type: "string",
            required: false
        },
        "manufacturer": {
            type: "string",
            required: false
        }
    },
    "administration": {
        "route": {
            "name": {
                type: "string",
                required: false
            },
            "code": {
                type: "string",
                required: false
            },
            "code_system": {
                type: "string",
                required: false
            }
        },
        "body_site": {
            type: "string",
            required: false
        },
        "quantity": {
            "value": {
                type: "string",
                required: false
            },
            "units": {
                type: "string",
                required: false
            }
        },
        "form": {
            type: "string",
            required: false
        }
    },
    "performer": {
        "name": {
            type: cda_name
        },
        "address": {
            type: cda_address
        },
        "phone": [{
            "number": {
                type: "string",
                required: true
            },
            "type": {
                type: "string",
                required: true
            }
        }],

        "email": [{
            "address": {
                type: "string",
                required: true
            },
            "type": {
                type: "string",
                required: true
            }
        }],

        "identifiers": [{
            type: cda_id
        }],

        "organization": [{
            "name": {
                type: "string",
                required: false
            },
            "address": {
                type: cda_address
            },
            "phone": [{
                "number": {
                    type: "string",
                    required: true
                },
                "type": {
                    type: "string",
                    required: true
                }
            }],

            "email": [{
                "address": {
                    type: "string",
                    required: true
                },
                "type": {
                    type: "string",
                    required: true
                }
            }],

            "identifiers": [{
                type: cda_id
            }]
        }],
        "refusal_reason": {
            type: "string",
            required: false
        }
    }
};


var cda_name = {
    "prefix": [{
        type: "string",
        required: false
    }],
    "first": {
        type: "string",
        required: true
    },
    "middle": [{
        type: "string",
        required: false
    }],
    "last": {
        type: "string",
        required: true
    },
    "suffix": {
        type: "string",
        required: false
    }
};

//Medications
var Medication = {
    "date": [{
        type: cda_date
    }],
    "identifiers": [{
        type: cda_id
    }],
    "status": {
        type: "string",
        required: true
    },
    "sig": {
        type: "string",
        required: false
    },
    "product": {
        "name": {
            type: "string",
            required: true
        },
        "code": {
            type: "string",
            required: true
        },
        "code_system": {
            type: "string",
            required: true
        },
        "translations": [{
            "name": {
                type: "string",
                required: false
            },
            "code": {
                type: "string",
                required: false
            },
            "code_system": {
                type: "string",
                required: false
            },
        }],
        "identifiers": [{
            type: cda_id
        }]
    },
    "administration": {
        "route": {
            "name": {
                type: "string",
                required: false
            },
            "code": {
                type: "string",
                required: false
            },
            "code_system": {
                type: "string",
                required: false
            }
        },
        "form": {
            "name": {
                type: "string",
                required: false
            },
            "code": {
                type: "string",
                required: false
            },
            "code_system": {
                type: "string",
                required: false
            }
        },
        "site": {
            "name": {
                type: "string",
                required: false
            },
            "code": {
                type: "string",
                required: false
            },
            "code_system": {
                type: "string",
                required: false
            }
        },
        "dose": {
            "value": {
                type: "string",
                required: false
            },
            "unit": {
                type: "string",
                required: false
            }
        },
        "dose_restriction": {
            "value": {
                type: "string",
                required: false
            },
            "unit": {
                type: "string",
                required: false
            }
        },
        "rate": {
            "value": {
                type: "string",
                required: false
            },
            "unit": {
                type: "string",
                required: false
            }
        },
    },
    "precondition": {
        "code": {
            "name": {
                type: "string",
                required: true
            },
            "code": {
                type: "string",
                required: true
            },
            "code_system": {
                type: "string",
                required: true
            },
        },
        "value": {
            "name": {
                type: "string",
                required: true
            },
            "code": {
                type: "string",
                required: true
            },
            "code_system": {
                type: "string",
                required: true
            },
        }
    }
};

//Encounters
var Encounters = {
    "date": [{
        type: cda_date
    }],
    "identifiers": [{
        type: cda_id
    }],
    "name": {
        type: "string",
        required: true
    },
    "code": {
        type: "string",
        required: true
    },
    "code_system_name": {
        type: "string",
        required: true
    },
    "locations": [{
        type: cda_location
    }],
    "findings": [{
        type: cda_concept
    }]
};

//Problems
var Problems = {
    "date": [{
        type: cda_date
    }],
    "identifiers": [{
        type: cda_id
    }],
    "negation_indicator": {
        type: "boolean",
        required: false
    },
    "name": {
        type: "string",
        required: true
    },
    "code": {
        type: "string",
        required: false
    },
    "code_system_name": {
        type: "string",
        required: false
    },
    "onset_age": {
        type: "string",
        required: false
    },
    "onset_age_unit": {
        type: "string",
        required: false
    },
    "status": {
        type: "string",
        required: false
    },
    "patient_status": {
        type: "string",
        required: false
    },

    "source_list_identifiers": [{
        type: cda_id
    }]
};

//Procedures
var Procedures = {
    "name": {
        type: "string",
        require: true
    },
    "code": {
        type: "string",
        require: true
    },
    "code_system_name": {
        type: "string",
        require: true
    },
    "type": {
        type: "string",
        require: true
    },
    "status": {
        type: "string",
        require: true
    },
    "date": [{
        type: cda_date
    }],
    "identifiers": [{
        type: cda_id
    }],
    "bodysite": [{
        "name": {
            type: "string",
            require: true
        },
        "code": {
            type: "string",
            require: true
        },
        "code_system_name": {
            type: "string",
            require: true
        },
    }],
    "providers": [{
        "address": {
            type: cda_address
        },
        "telecom": {
            type: cda_telecom
        },
        "organization": {
            "name": {
                type: "string",
                require: false
            },
            "address": {
                type: cda_address
            },
            "telecom": {
                type: cda_telecom
            }
        }
    }],
    "locations": [{
        type: cda_location
    }]
};

//Results
var Result = {
    "date": [{
        type: cda_date
    }],
    "identifiers": [{
        type: cda_id
    }],
    "status": {
        type: "string",
        required: true
    },
    "name": {
        type: "string",
        required: true
    },
    "code": {
        type: "string",
        required: false
    },
    "code_system_name": {
        type: "string",
        required: false
    },
    "value": {
        type: "string",
        required: false
    },
    "unit": {
        type: "string",
        required: false
    },
    "reference_range": {
        "text": {
            type: "string",
            required: false
        },
        "low_value": {
            type: "string",
            required: false
        },
        "low_unit": {
            type: "string",
            required: false
        },
        "high_value": {
            type: "string",
            required: false
        },
        "high_unit": {
            type: "string",
            required: false
        }
    },
    "category": {
        "name": {
            type: "string",
            required: true
        },
        "code": {
            type: "string",
            required: true
        },
        "code_system_name": {
            type: "string",
            required: true
        }
    }
};

//Vitals

var Vitals = {
    "date": [{
        type: cda_date
    }],
    "identifiers": [{
        type: cda_id
    }],
    "status": {
        type: "string",
        required: true
    },
    "name": {
        type: "string",
        required: true
    },
    "code": {
        type: "string",
        required: false
    },
    "code_system_name": {
        type: "string",
        required: false
    },
    "value": {
        type: "string",
        required: false
    },
    "unit": {
        type: "string",
        required: false
    },
    "interpretation": {
        type: "string",
        required: false
    }
};

//Social History
var SocialHistory = {
    "smokingStatuses": [{
        value: {
            type: "string",
            required: true
        },
        date: [{
            type: cda_date
        }]
    }]
};
