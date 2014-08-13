var testLocations = {
    "regular1": {
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
    },
    "regular2": {
        "name": "Community Gastroenterology Clinic",
        "loc_type": {
            "name": "Gastroenterology Clinic",
            "code": "1118-9",
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
    },
    "emptyLocType": {
        "name": "Community Urgent Care Center",
        "loc_type": {},
        "addresses": [{
            "street_lines": [
                "17 Daws Rd."
            ],
            "city": "Blue Bell",
            "state": "MA",
            "zip": "02368",
            "country": "US"
        }]
    },
    "emptyAddresses": {
        "name": "Community Urgent Care Center",
        "loc_type": {
            "name": "Urgent Care Center",
            "code": "1160-1",
            "code_system_name": "HealthcareServiceLocation"
        },
        "addresses": []
    },
    "noName": {
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
    },
    "badNumber": {
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
        }],
        "phones": [{
            "wrong": "(816)276-6909",
            "type": "primary home"
        }]
    },
    "locTypeUndefined": {
        "name": "Community Urgent Care Center",
        "addresses": [{
            "street_lines": [
                "17 Daws Rd."
            ],
            "city": "Blue Bell",
            "state": "MA",
            "zip": "02368",
            "country": "US"
        }],
        "phones": [{
            "number": "(816)276-6909",
            "type": "primary home"
        }]
    }
};
module.exports = testLocations;
