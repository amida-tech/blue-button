var testEncounter = {
    "regular": {
        "encounter": {
            "name": "Office outpatient visit 15 minutes",
            "code": "99213",
            "code_system_name": "CPT",
            "translations": [{
                "name": "Ambulatory",
                "code": "AMB",
                "code_system_name": "HL7ActCode"
            }]
        },
        "identifiers": [{
            "identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
        }],
        "date": [{
            "date": "2009-02-27T13:00:00Z",
            "precision": "subsecond"
        }],
        "locations": [{
            "name": "Community Urgent Care Center",
            "loc_type": {
                "name": "Urgent Care Center",
                "code": "1160-1",
                "code_system_name": "HealthcareServiceLocation"
            },
            "addresses": [{
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            }]
        }],
        "findings": [{
            "name": "Pneumonia",
            "code": "233604007",
            "code_system_name": "SNOMED CT"
        }]
    },
    "encounterMissing": {
        "identifiers": [{
            "identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
        }],
        "date": [{
            "date": "2009-02-27T13:00:00Z",
            "precision": "subsecond"
        }],
        "locations": [{
            "name": "Community Urgent Care Center",
            "loc_type": {
                "name": "Urgent Care Center",
                "code": "1160-1",
                "code_system_name": "HealthcareServiceLocation"
            },
            "addresses": [{
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            }]
        }],
        "findings": [{
            "name": "Pneumonia",
            "code": "233604007",
            "code_system_name": "SNOMED CT"
        }]
    },
    "dateIdMissing": {
        "encounter": {
            "name": "Office outpatient visit 15 minutes",
            "code": "99213",
            "code_system_name": "CPT",
            "translations": [{
                "name": "Ambulatory",
                "code": "AMB",
                "code_system_name": "HL7ActCode"
            }]
        },
        "locations": [{
            "name": "Community Urgent Care Center",
            "loc_type": {
                "name": "Urgent Care Center",
                "code": "1160-1",
                "code_system_name": "HealthcareServiceLocation"
            },
            "addresses": [{
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            }]
        }],
        "findings": [{
            "name": "Pneumonia",
            "code": "233604007",
            "code_system_name": "SNOMED CT"
        }]
    },
    "addressBadField": {
        "encounter": {
            "name": "Office outpatient visit 15 minutes",
            "code": "99213",
            "code_system_name": "CPT",
            "translations": [{
                "name": "Ambulatory",
                "code": "AMB",
                "code_system_name": "HL7ActCode"
            }]
        },
        "identifiers": [{
            "identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
        }],
        "date": [{
            "date": "2009-02-27T13:00:00Z",
            "precision": "subsecond"
        }],
        "locations": [{
            "name": "Community Urgent Care Center",
            "loc_type": {
                "name": "Urgent Care Center",
                "code": "1160-1",
                "code_system_name": "HealthcareServiceLocation"
            },
            "addresses": [{
                "streetKill": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            }]
        }],
        "findings": [{
            "name": "Pneumonia",
            "code": "233604007",
            "code_system_name": "SNOMED CT"
        }]
    },
    "findingsMissing": {
        "encounter": {
            "name": "Office outpatient visit 15 minutes",
            "code": "99213",
            "code_system_name": "CPT",
            "translations": [{
                "name": "Ambulatory",
                "code": "AMB",
                "code_system_name": "HL7ActCode"
            }]
        },
        "identifiers": [{
            "identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
        }],
        "date": [{
            "date": "2009-02-27T13:00:00Z",
            "precision": "subsecond"
        }],
        "locations": [{
            "name": "Community Urgent Care Center",
            "loc_type": {
                "name": "Urgent Care Center",
                "code": "1160-1",
                "code_system_name": "HealthcareServiceLocation"
            },
            "addresses": [{
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            }]
        }]
    }
};
module.exports = testEncounter;
