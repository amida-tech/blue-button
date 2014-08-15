var test_plan_of_care_list = {
    "regular1": [{
        "date_time": {
            "point": {
                "date": "2012-05-12T00:00:00Z",
                "precision": "day"
            }
        },
        "identifiers": [{
            "identifier": "9a6d1bac-17d3-4195-89a4-1121bc809b4a"
        }],
        "plan": {
            "name": "Colonoscopy",
            "code": "73761001",
            "code_system_name": "SNOMED CT"
        },
        "type": "observation"
    }],
    "missing_plan": [{
        "date_time": {
            "point": {
                "date": "2012-05-12T00:00:00Z",
                "precision": "day"
            }
        },
        "identifiers": [{
            "identifier": "9a6d1bac-17d3-4195-89a4-1121bc809b4a"
        }],
        "type": "observation"
    }],
    "missing_type": [{
        "date_time": {
            "point": {
                "date": "2012-05-12T00:00:00Z",
                "precision": "day"
            }
        },
        "identifiers": [{
            "identifier": "9a6d1bac-17d3-4195-89a4-1121bc809b4a"
        }],
        "plan": {
            "name": "Colonoscopy",
            "code": "73761001",
            "code_system_name": "SNOMED CT"
        }
    }]
}

exports.test_plan_of_care_list = test_plan_of_care_list;
