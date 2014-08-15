var testProcedureList = {
    "regular1": {
        "procedure": {
            "name": "Colonoscopy",
            "code": "73761001",
            "code_system_name": "SNOMED CT"
        },
        "identifiers": [{
            "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
        }],
        "status": "Completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "body_sites": [{
            "name": "colon",
            "code": "appropriate_code",
            "code_system_name": "OID 2.16.840.1.113883.3.88.12.3221.8.9"
        }],
        "performers": [{
            "address": {
                "street_lines": [
                    "1001 Village Avenue"
                ],
                "city": "Portland",
                "state": "OR",
                "zip": "99123",
                "country": "US"
            },
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19.5.9999.456",
                "extension": "2981823"
            }],
            "phone": [{
                "number": "555-555-5000",
                "type": "work place"
            }],
            "organization": {
                "name": "Community Health and Hospitals",
                "address": {
                    "street_lines": [
                        "1001 Village Avenue"
                    ],
                    "city": "Portland",
                    "state": "OR",
                    "zip": "99123",
                    "country": "US"
                },
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5.9999.1393"
                }],
                "phone": [{
                    "number": "555-555-5000",
                    "type": "work place"
                }]
            }
        }],
        "procedure_type": "procedure"
    },
    "regular2": {
        "procedure": {
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        "identifiers": [{
            "identifier": "2.16.840.1.113883.19",
            "extension": "123456789"
        }],
        "status": "Aborted",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "body_sites": [{
            "name": "Abdomen and pelvis",
            "code": "416949008",
            "code_system_name": "SNOMED CT"
        }],
        "performers": [{
            "address": {
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            },
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19.5",
                "extension": "1234"
            }],
            "phone": [{
                "number": "(555)555-555-1234",
                "type": "work place"
            }],
            "organization": {
                "name": "Community Health and Hospitals",
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5"
                }]
            }
        }],
        "locations": [{
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
        }],
        "procedure_type": "observation"
    },
    "regular3": {
        "procedure": {
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        "identifiers": [{
            "identifier": "1.2.3.4.5.6.7.8",
            "extension": "1234567"
        }],
        "status": "Completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "performers": [{
            "address": {
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            },
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19",
                "extension": "1234"
            }],
            "phone": [{
                "number": "(555)555-555-1234",
                "type": "work place"
            }],
            "organization": {
                "name": "Community Health and Hospitals",
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5"
                }]
            }
        }],
        "locations": [{
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
        }],
        "procedure_type": "act"
    },
    "missingStatus": {
        "procedure": {
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        "identifiers": [{
            "identifier": "1.2.3.4.5.6.7.8",
            "extension": "1234567"
        }],
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "performers": [{
            "address": {
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            },
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19",
                "extension": "1234"
            }],
            "phone": [{
                "number": "(555)555-555-1234",
                "type": "work place"
            }],
            "organization": {
                "name": "Community Health and Hospitals",
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5"
                }]
            }
        }],
        "locations": [{
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
        }],
        "procedure_type": "act"
    },
    "missingProcedureField": {
        "identifiers": [{
            "identifier": "1.2.3.4.5.6.7.8",
            "extension": "1234567"
        }],
        "status": "Completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "performers": [{
            "address": {
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            },
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19",
                "extension": "1234"
            }],
            "phone": [{
                "number": "(555)555-555-1234",
                "type": "work place"
            }],
            "organization": {
                "name": "Community Health and Hospitals",
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5"
                }]
            }
        }],
        "locations": [{
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
        }],
        "procedure_type": "act"
    },
    "procedureFieldNameOnly": {
        "procedure": {
            "name": "Colonic polypectomy"
        },
        "identifiers": [{
            "identifier": "1.2.3.4.5.6.7.8",
            "extension": "1234567"
        }],
        "status": "Completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "performers": [{
            "address": {
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            },
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19",
                "extension": "1234"
            }],
            "phone": [{
                "number": "(555)555-555-1234",
                "type": "work place"
            }],
            "organization": {
                "name": "Community Health and Hospitals",
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5"
                }]
            }
        }],
        "locations": [{
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
        }],
        "procedure_type": "act"
    },
    "noOrganizationField": {
        "procedure": {
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        "identifiers": [{
            "identifier": "1.2.3.4.5.6.7.8",
            "extension": "1234567"
        }],
        "status": "Completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "performers": [{
            "address": {
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            },
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19",
                "extension": "1234"
            }],
            "phone": [{
                "number": "(555)555-555-1234",
                "type": "work place"
            }]
        }],
        "locations": [{
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
        }],
        "procedure_type": "act"
    },
    "organizationNoName": {
        "procedure": {
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        "identifiers": [{
            "identifier": "1.2.3.4.5.6.7.8",
            "extension": "1234567"
        }],
        "status": "Completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "performers": [{
            "address": {
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            },
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19",
                "extension": "1234"
            }],
            "phone": [{
                "number": "(555)555-555-1234",
                "type": "work place"
            }],
            "organization": {
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5"
                }]
            }
        }],
        "locations": [{
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
        }],
        "procedure_type": "act"
    },
    "addressBadStreetLine": {
        "procedure": {
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        "identifiers": [{
            "identifier": "1.2.3.4.5.6.7.8",
            "extension": "1234567"
        }],
        "status": "Completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "performers": [{
            "address": {
                "street": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            },
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19",
                "extension": "1234"
            }],
            "phone": [{
                "number": "(555)555-555-1234",
                "type": "work place"
            }],
            "organization": {
                "name": "Community Health and Hospitals",
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5"
                }]
            }
        }],
        "locations": [{
            "name": "Community Gastroenterology Clinic",
            "loc_type": {
                "name": "Gastroenterology Clinic",
                "code": "1118-9",
                "code_system_name": "HealthcareServiceLocation"
            },
            "addresses": [{
                "street": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US"
            }]
        }],
        "procedure_type": "act"
    },
    "missingperformers": {
        "procedure": {
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        "identifiers": [{
            "identifier": "1.2.3.4.5.6.7.8",
            "extension": "1234567"
        }],
        "status": "Completed",
        "date_time": {
            "point": {
                "date": "1999-11-14T00:00:00Z",
                "precision": "day"
            }
        },
        "locations": [{
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
        }],
        "procedure_type": "act"
    }
};

module.exports = testProcedureList;
