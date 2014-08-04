var testProb = {
    "regular1": {
        "date": [{
            "date": "2008-01-03T00:00:00Z",
            "precision": "day"
        }, {
            "date": "2008-01-03T00:00:00Z",
            "precision": "day"
        }],
        "identifiers": [{
            "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
        }],
        "negation_indicator": false,
        "problem": {
            "name": "Pneumonia",
            "code": "233604007",
            "code_system_name": "SNOMED CT"
        },
        "onset_age": "57",
        "onset_age_unit": "Year",
        "status": "Resolved",
        "patient_status": "Alive and well",
        "source_list_identifiers": [{
            "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
        }]
    },
    "regular2": {
        "date": [{
            "date": "2007-01-03T00:00:00Z",
            "precision": "day"
        }, {
            "date": "2008-01-03T00:00:00Z",
            "precision": "day"
        }],
        "identifiers": [{
            "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
        }],
        "negation_indicator": false,
        "problem": {
            "name": "Asthma",
            "code": "195967001",
            "code_system_name": "SNOMED CT"
        },
        "onset_age": "57",
        "onset_age_unit": "Year",
        "status": "Active",
        "patient_status": "Alive and well",
        "source_list_identifiers": [{
            "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
        }]
    },
    "badDate": {
        "date": [{
            "date": "badday",
            "precision": "day"
        }],
        "identifiers": [{
            "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
        }],
        "negation_indicator": false,
        "problem": {
            "name": "Pneumonia",
            "code": "233604007",
            "code_system_name": "SNOMED CT"
        },
        "onset_age": "57",
        "onset_age_unit": "Year",
        "status": "Resolved",
        "patient_status": "Alive and well",
        "source_list_identifiers": [{
            "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
        }]
    },
    "emptyProblem": {
        "date": [{
            "date": "2007-01-03T00:00:00Z",
            "precision": "day"
        }, {
            "date": "2008-01-03T00:00:00Z",
            "precision": "day"
        }],
        "identifiers": [{
            "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
        }],
        "negation_indicator": false,
        "problem": {

        },
        "onset_age": "57",
        "onset_age_unit": "Year",
        "status": "Active",
        "patient_status": "Alive and well",
        "source_list_identifiers": [{
            "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
        }]
    },
    "undefinedProblem": {
        "date": [{
            "date": "2007-01-03T00:00:00Z",
            "precision": "day"
        }, {
            "date": "2008-01-03T00:00:00Z",
            "precision": "day"
        }],
        "identifiers": [{
            "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
        }],
        "negation_indicator": false,
        "problem": {

        },
        "onset_age": "57",
        "onset_age_unit": "Year",
        "status": "Active",
        "patient_status": "Alive and well",
        "source_list_identifiers": [{
            "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
        }]
    }
};
module.exports = testProb;
