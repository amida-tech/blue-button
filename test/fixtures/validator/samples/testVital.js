/*jshint expr: true*/
var testVital = {
    "regular1": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "vital": {
            "name": "Height",
            "code": "8302-2",
            "code_system_name": "LOINC"
        },
        "status": "completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "interpretations": [
            "Normal"
        ],
        "value": 177,
        "unit": "cm"
    },
    "regular2": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "vital": {
            "name": "Patient Body Weight - Measured",
            "code": "3141-9",
            "code_system_name": "LOINC"
        },
        "status": "completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "interpretations": [
            "Normal"
        ],
        "value": 86,
        "unit": "kg"
    },
    "regular3": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "vital": {
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC"
        },
        "status": "completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "interpretations": [
            "Normal"
        ],
        "value": 132,
        "unit": "mm[Hg]"
    },
    "regular4": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "vital": {
            "name": "Height",
            "code": "8302-2",
            "code_system_name": "LOINC"
        },
        "status": "completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "interpretations": [
            "Normal"
        ],
        "value": 177,
        "unit": "cm"
    },
    "regular5": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "vital": {
            "name": "Patient Body Weight - Measured",
            "code": "3141-9",
            "code_system_name": "LOINC"
        },
        "status": "completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "interpretations": [
            "Normal"
        ],
        "value": 88,
        "unit": "kg"
    },
    "regular6": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "vital": {
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC"
        },
        "status": "completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "interpretations": [
            "Normal"
        ],
        "value": 145,
        "unit": "mm[Hg]"
    },
    "missingVitalField": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "status": "completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "interpretations": [
            "Normal"
        ],
        "value": 145,
        "unit": "mm[Hg]"
    },
    "badValue": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "vital": {
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC"
        },
        "status": "completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "interpretations": [
            "Normal"
        ],
        "value": "145",
        "unit": "mm[Hg]"
    },
    "emptyVitals": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "vital": {},
        "status": "completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "interpretations": [
            "Normal"
        ],
        "value": 145,
        "unit": "mm[Hg]"
    },
    "emptyDate": {
        "identifiers": [{
            "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
        }],
        "vital": {
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC"
        },
        "status": "completed",
        "date_time": [],
        "interpretations": [
            "Normal"
        ],
        "value": 145,
        "unit": "mm[Hg]"
    },
    "onlyVitals": {
        "vital": {
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC"
        }
    }
};

module.exports = testVital;
