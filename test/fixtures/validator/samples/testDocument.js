var testDocList = {
    "regular": {
        "data": {
            "demographics": {
                "name": {
                    "middle": [
                        "Isa"
                    ],
                    "last": "Jones",
                    "first": "Isabella"
                },
                "dob": [{
                    "date": "fudged",
                    "precision": "day"
                }],
                "gender": "Female",
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5.99999.2",
                    "extension": "998991"
                }, {
                    "identifier": "2.16.840.1.113883.4.1",
                    "extension": "111-00-2330"
                }],
                "marital_status": "Married",
                "addresses": [{
                    "street_lines": [
                        "1357 Amber Drive"
                    ],
                    "city": "Beaverton",
                    "state": "OR",
                    "zip": "97867",
                    "country": "US",
                    "use": "primary home"
                }],
                "phone": [{
                    "number": "(816)276-6909",
                    "type": "primary home"
                }],
                "race_ethnicity": "White",
                "languages": [{
                    "language": "en",
                    "preferred": true,
                    "mode": "Expressed spoken",
                    "proficiency": "Good"
                }],
                "religion": "Christian (non-Catholic, non-specific)",
                "birthplace": {
                    "city": "Beaverton",
                    "state": "OR",
                    "zip": "97867",
                    "country": "US"
                },
                "guardians": [{
                    "relation": "Parent",
                    "addresses": [{
                        "street_lines": [
                            "1357 Amber Drive"
                        ],
                        "city": "Beaverton",
                        "state": "OR",
                        "zip": "97867",
                        "country": "US",
                        "use": "primary home"
                    }],
                    "names": [{
                        "last": "Jones",
                        "first": "Ralph"
                    }],
                    "phone": [{
                        "number": "(816)276-6909",
                        "type": "primary home"
                    }]
                }]
            },
            "vitals": [{
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Height",
                    "code": "8302-2",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 177,
                "unit": "cm"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Patient Body Weight - Measured",
                    "code": "3141-9",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 86,
                "unit": "kg"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Intravascular Systolic",
                    "code": "8480-6",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 132,
                "unit": "mm[Hg]"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Height",
                    "code": "8302-2",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "2000-04-07T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 177,
                "unit": "cm"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Patient Body Weight - Measured",
                    "code": "3141-9",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "2000-04-07T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 88,
                "unit": "kg"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Intravascular Systolic",
                    "code": "8480-6",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "2000-04-07T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 145,
                "unit": "mm[Hg]"
            }],
            "results": [{
                "identifiers": [{
                    "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
                }],
                "result_set": {
                    "name": "CBC WO DIFFERENTIAL",
                    "code": "43789009",
                    "code_system_name": "SNOMED CT"
                },
                "results": [{
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "HGB",
                        "code": "30313-1",
                        "code_system_name": "LOINC"
                    },
                    "date": [{
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }],
                    "status": "completed",
                    "interpretations": [
                        "Normal"
                    ],
                    "value": 13.2,
                    "unit": "g/dl"
                }, {
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "WBC",
                        "code": "33765-9",
                        "code_system_name": "LOINC"
                    },
                    "date": [{
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }],
                    "status": "completed",
                    "interpretations": [
                        "Normal"
                    ],
                    "value": 6.7,
                    "unit": "10+3/ul"
                }, {
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "PLT",
                        "code": "26515-7",
                        "code_system_name": "LOINC"
                    },
                    "date": [{
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }],
                    "status": "completed",
                    "interpretations": [
                        "Low"
                    ],
                    "value": 123,
                    "unit": "10+3/ul"
                }]
            }],
            "medications": [{
                "date": [{
                    "date": "2007-01-03T00:00:00Z",
                    "precision": "day"
                }, {
                    "date": "2012-05-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
                }],
                "status": "Completed",
                "sig": "Proventil HFA ",
                "product": {
                    "identifiers": {
                        "identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
                    },
                    "unencoded_name": "Proventil HFA ",
                    "product": {
                        "name": "Proventil HFA",
                        "code": "219483",
                        "code_system_name": "RXNORM",
                        "translations": [{
                            "name": "Proventil 0.09 MG/ACTUAT inhalant solution",
                            "code": "573621",
                            "code_system_name": "RXNORM"
                        }]
                    }
                },
                "administration": {
                    "route": {
                        "name": "RESPIRATORY (INHALATION)",
                        "code": "C38216",
                        "code_system_name": "Medication Route FDA"
                    },
                    "form": {
                        "name": "INHALANT",
                        "code": "C42944",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 1,
                        "unit": "mg/actuat"
                    },
                    "rate": {
                        "value": 90,
                        "unit": "ml/min"
                    }
                },
                "precondition": {
                    "code": {
                        "code": "ASSERTION",
                        "code_system_name": "HL7ActCode"
                    },
                    "value": {
                        "name": "Wheezing",
                        "code": "56018004",
                        "code_system_name": "SNOMED CT"
                    }
                }
            }],
            "encounters": [{
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
            }],
            "allergies": [{
                "date": [{
                    "date": "2007-05-01T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "ALLERGENIC EXTRACT, PENICILLIN",
                    "code": "314422",
                    "code_system_name": "RXNORM"
                },
                "severity": "Moderate to severe",
                "status": "Inactive",
                "reaction": [{
                    "reaction": {
                        "name": "Nausea",
                        "code": "422587007",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": "Mild"
                }]
            }, {
                "date": [{
                    "date": "2006-05-01T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "Codeine",
                    "code": "2670",
                    "code_system_name": "RXNORM"
                },
                "severity": "Moderate",
                "status": "Active",
                "reaction": [{
                    "reaction": {
                        "name": "Wheezing",
                        "code": "56018004",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": "Mild"
                }]
            }, {
                "date": [{
                    "date": "2008-05-01T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "Aspirin",
                    "code": "1191",
                    "code_system_name": "RXNORM"
                },
                "severity": "Mild to moderate",
                "status": "Active",
                "reaction": [{
                    "reaction": {
                        "name": "Hives",
                        "code": "247472004",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": "Mild to moderate"
                }]
            }],
            "immunizations": [{
                "date": [{
                    "date": "1999-11-01T00:00:00Z",
                    "precision": "month"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "complete",
                "product": {
                    "product": {
                        "name": "Influenza virus vaccine",
                        "code": "88",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Influenza, seasonal, injectable",
                            "code": "141",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": [{
                        "last": "Assigned",
                        "first": "Amanda"
                    }],
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": ["Good Health Clinic"]
                    }]
                }
            }, {
                "date": [{
                    "date": "1998-12-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "refused",
                "product": {
                    "product": {
                        "name": "Influenza virus vaccine",
                        "code": "88",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Influenza, seasonal, injectable",
                            "code": "141",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": [{
                        "last": "Assigned",
                        "first": "Amanda"
                    }],
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": ["Good Health Clinic"]
                    }]
                }
            }, {
                "date": [{
                    "date": "1998-12-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "complete",
                "product": {
                    "product": {
                        "name": "Pneumococcal polysaccharide vaccine",
                        "code": "33",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Pneumococcal NOS",
                            "code": "109",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": [{
                        "last": "Assigned",
                        "first": "Amanda"
                    }],
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": ["Good Health Clinic"]
                    }]
                }
            }, {
                "date": [{
                    "date": "1998-12-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "refused",
                "product": {
                    "product": {
                        "name": "Tetanus and diphtheria toxoids - preservative free",
                        "code": "103",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Tetanus and diphtheria toxoids - preservative free",
                            "code": "09",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": [{
                        "last": "Assigned",
                        "first": "Amanda"
                    }],
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": ["Good Health Clinic"]
                    }]
                },
                "refusal_reason": "Patient objection"
            }],
            "social_history": {
                "smoking_statuses": [{
                    "value": "Former smoker",
                    "date": [{
                        "date": "2005-05-01T00:00:00Z",
                        "precision": "day"
                    }, {
                        "date": "2009-02-27T13:00:00Z",
                        "precision": "subsecond"
                    }]
                }]
            },
            "problems": [{
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
            }, {
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
            }],
            "procedures": [{
                "procedure": {
                    "name": "Colonoscopy",
                    "code": "73761001",
                    "code_system_name": "SNOMED CT"
                },
                "identifiers": [{
                    "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
                }],
                "status": "Completed",
                "date": [{
                    "date": "2012-05-12T00:00:00Z",
                    "precision": "day"
                }],
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
            }, {
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
                "date": [{
                    "date": "2011-02-03T00:00:00Z",
                    "precision": "day"
                }],
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
            }, {
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
                "date": [{
                    "date": "2011-02-03T00:00:00Z",
                    "precision": "day"
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
            }]
        }
    },
    "badDate": {
        "data": {
            "demographics": {
                "name": {
                    "middle": [
                        "Isa"
                    ],
                    "last": "Jones",
                    "first": "Isabella"
                },
                "dob": [{
                    "date": "fudged",
                    "precision": "day"
                }],
                "gender": "Female",
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5.99999.2",
                    "extension": "998991"
                }, {
                    "identifier": "2.16.840.1.113883.4.1",
                    "extension": "111-00-2330"
                }],
                "marital_status": "Married",
                "addresses": [{
                    "street_lines": [
                        "1357 Amber Drive"
                    ],
                    "city": "Beaverton",
                    "state": "OR",
                    "zip": "97867",
                    "country": "US",
                    "use": "primary home"
                }],
                "phone": [{
                    "number": "(816)276-6909",
                    "type": "primary home"
                }],
                "race_ethnicity": "White",
                "languages": [{
                    "language": "en",
                    "preferred": true,
                    "mode": "Expressed spoken",
                    "proficiency": "Good"
                }],
                "religion": "Christian (non-Catholic, non-specific)",
                "birthplace": {
                    "city": "Beaverton",
                    "state": "OR",
                    "zip": "97867",
                    "country": "US"
                },
                "guardians": [{
                    "relation": "Parent",
                    "addresses": [{
                        "street_lines": [
                            "1357 Amber Drive"
                        ],
                        "city": "Beaverton",
                        "state": "OR",
                        "zip": "97867",
                        "country": "US",
                        "use": "primary home"
                    }],
                    "names": [{
                        "last": "Jones",
                        "first": "Ralph"
                    }],
                    "phone": [{
                        "number": "(816)276-6909",
                        "type": "primary home"
                    }]
                }]
            },
            "vitals": [{
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Height",
                    "code": "8302-2",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 177,
                "unit": "cm"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Patient Body Weight - Measured",
                    "code": "3141-9",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 86,
                "unit": "kg"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Intravascular Systolic",
                    "code": "8480-6",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 132,
                "unit": "mm[Hg]"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Height",
                    "code": "8302-2",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "2000-04-07T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 177,
                "unit": "cm"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Patient Body Weight - Measured",
                    "code": "3141-9",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "2000-04-07T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 88,
                "unit": "kg"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Intravascular Systolic",
                    "code": "8480-6",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "2000-04-07T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 145,
                "unit": "mm[Hg]"
            }],
            "results": [{
                "identifiers": [{
                    "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
                }],
                "result_set": {
                    "name": "CBC WO DIFFERENTIAL",
                    "code": "43789009",
                    "code_system_name": "SNOMED CT"
                },
                "results": [{
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "HGB",
                        "code": "30313-1",
                        "code_system_name": "LOINC"
                    },
                    "date": [{
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }],
                    "status": "completed",
                    "interpretations": [
                        "Normal"
                    ],
                    "value": 13.2,
                    "unit": "g/dl"
                }, {
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "WBC",
                        "code": "33765-9",
                        "code_system_name": "LOINC"
                    },
                    "date": [{
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }],
                    "status": "completed",
                    "interpretations": [
                        "Normal"
                    ],
                    "value": 6.7,
                    "unit": "10+3/ul"
                }, {
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "PLT",
                        "code": "26515-7",
                        "code_system_name": "LOINC"
                    },
                    "date": [{
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }],
                    "status": "completed",
                    "interpretations": [
                        "Low"
                    ],
                    "value": 123,
                    "unit": "10+3/ul"
                }]
            }],
            "medications": [{
                "date": [{
                    "date": "2007-01-03T00:00:00Z",
                    "precision": "day"
                }, {
                    "date": "2012-05-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
                }],
                "status": "Completed",
                "sig": "Proventil HFA ",
                "product": {
                    "identifiers": {
                        "identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
                    },
                    "unencoded_name": "Proventil HFA ",
                    "product": {
                        "name": "Proventil HFA",
                        "code": "219483",
                        "code_system_name": "RXNORM",
                        "translations": [{
                            "name": "Proventil 0.09 MG/ACTUAT inhalant solution",
                            "code": "573621",
                            "code_system_name": "RXNORM"
                        }]
                    }
                },
                "administration": {
                    "route": {
                        "name": "RESPIRATORY (INHALATION)",
                        "code": "C38216",
                        "code_system_name": "Medication Route FDA"
                    },
                    "form": {
                        "name": "INHALANT",
                        "code": "C42944",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 1,
                        "unit": "mg/actuat"
                    },
                    "rate": {
                        "value": 90,
                        "unit": "ml/min"
                    }
                },
                "precondition": {
                    "code": {
                        "code": "ASSERTION",
                        "code_system_name": "HL7ActCode"
                    },
                    "value": {
                        "name": "Wheezing",
                        "code": "56018004",
                        "code_system_name": "SNOMED CT"
                    }
                }
            }],
            "encounters": [{
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
            }],
            "allergies": [{
                "date": [{
                    "date": "2007-05-01T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "ALLERGENIC EXTRACT, PENICILLIN",
                    "code": "314422",
                    "code_system_name": "RXNORM"
                },
                "severity": "Moderate to severe",
                "status": "Inactive",
                "reaction": [{
                    "reaction": {
                        "name": "Nausea",
                        "code": "422587007",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": "Mild"
                }]
            }, {
                "date": [{
                    "date": "2006-05-01T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "Codeine",
                    "code": "2670",
                    "code_system_name": "RXNORM"
                },
                "severity": "Moderate",
                "status": "Active",
                "reaction": [{
                    "reaction": {
                        "name": "Wheezing",
                        "code": "56018004",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": "Mild"
                }]
            }, {
                "date": [{
                    "date": "2008-05-01T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "Aspirin",
                    "code": "1191",
                    "code_system_name": "RXNORM"
                },
                "severity": "Mild to moderate",
                "status": "Active",
                "reaction": [{
                    "reaction": {
                        "name": "Hives",
                        "code": "247472004",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": "Mild to moderate"
                }]
            }],
            "immunizations": [{
                "date": [{
                    "date": "1999-11-01T00:00:00Z",
                    "precision": "month"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "complete",
                "product": {
                    "product": {
                        "name": "Influenza virus vaccine",
                        "code": "88",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Influenza, seasonal, injectable",
                            "code": "141",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": {
                        "last": "Assigned",
                        "first": "Amanda"
                    },
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": "Good Health Clinic"
                    }]
                }
            }, {
                "date": [{
                    "date": "1998-12-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "refused",
                "product": {
                    "product": {
                        "name": "Influenza virus vaccine",
                        "code": "88",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Influenza, seasonal, injectable",
                            "code": "141",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": {
                        "last": "Assigned",
                        "first": "Amanda"
                    },
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": "Good Health Clinic"
                    }]
                }
            }, {
                "date": [{
                    "date": "1998-12-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "complete",
                "product": {
                    "product": {
                        "name": "Pneumococcal polysaccharide vaccine",
                        "code": "33",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Pneumococcal NOS",
                            "code": "109",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": {
                        "last": "Assigned",
                        "first": "Amanda"
                    },
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": "Good Health Clinic"
                    }]
                }
            }, {
                "date": [{
                    "date": "1998-12-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "refused",
                "product": {
                    "product": {
                        "name": "Tetanus and diphtheria toxoids - preservative free",
                        "code": "103",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Tetanus and diphtheria toxoids - preservative free",
                            "code": "09",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": {
                        "last": "Assigned",
                        "first": "Amanda"
                    },
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": "Good Health Clinic"
                    }]
                },
                "refusal_reason": "Patient objection"
            }],
            "social_history": {
                "smoking_statuses": [{
                    "value": "Former smoker",
                    "date": [{
                        "date": "2005-05-01T00:00:00Z",
                        "precision": "day"
                    }, {
                        "date": "2009-02-27T13:00:00Z",
                        "precision": "subsecond"
                    }]
                }]
            },
            "problems": [{
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
            }, {
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
            }],
            "procedures": [{
                "procedure": {
                    "name": "Colonoscopy",
                    "code": "73761001",
                    "code_system_name": "SNOMED CT"
                },
                "identifiers": [{
                    "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
                }],
                "status": "Completed",
                "date": [{
                    "date": "2012-05-12T00:00:00Z",
                    "precision": "day"
                }],
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
            }, {
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
                "date": [{
                    "date": "baddate",
                    "precision": "day"
                }],
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
            }, {
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
                "date": [{
                    "date": "2011-02-03T00:00:00Z",
                    "precision": "day"
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
            }]
        }
    },
    "emptySections": {
        "data": {
            "demographics": {},
            "vitals": [
                [],
                [],
                [],
                [],
                [],
                []
            ],
            "results": [
                []
            ],
            "medications": [
                []
            ],
            "encounters": [
                []
            ],
            "allergies": [
                [],
                [],
                []
            ],
            "immunizations": [
                [],
                [],
                [],
                []
            ],
            "socialHistory": [
                []
            ],
            "problems": [
                [],
                []
            ],
            "procedures": [
                [],
                [],
                []
            ]
        },
        meta: {
            version: '0.0.4'
        },
        errors: ['nullFlavor alert:  missing but required street_lines in Address -> Patient -> CCD',
            'nullFlavor alert:  missing but required value in PhysicalQuantity -> MedicationAdministration -> Prescription -> MedicationsSection -> CCD'
        ]
    },
    "findBadEntries": {
        "data": {
            "demographics": {
                "dob": [{
                    "date": "fudged",
                    "precision": "day"
                }],
                "gender": "Female",
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5.99999.2",
                    "extension": "998991"
                }, {
                    "identifier": "2.16.840.1.113883.4.1",
                    "extension": "111-00-2330"
                }],
                "marital_status": "Married",
                "addresses": [{
                    "street_lines": [
                        "1357 Amber Drive"
                    ],
                    "city": "Beaverton",
                    "state": "OR",
                    "zip": "97867",
                    "country": "US",
                    "use": "primary home"
                }],
                "phone": [{
                    "number": "(816)276-6909",
                    "type": "primary home"
                }],
                "race_ethnicity": "White",
                "languages": [{
                    "language": "en",
                    "preferred": true,
                    "mode": "Expressed spoken",
                    "proficiency": "Good"
                }],
                "religion": "Christian (non-Catholic, non-specific)",
                "birthplace": {
                    "city": "Beaverton",
                    "state": "OR",
                    "zip": "97867",
                    "country": "US"
                },
                "guardians": [{
                    "relation": "Parent",
                    "addresses": [{
                        "street_lines": [
                            "1357 Amber Drive"
                        ],
                        "city": "Beaverton",
                        "state": "OR",
                        "zip": "97867",
                        "country": "US",
                        "use": "primary home"
                    }],
                    "names": [{
                        "last": "Jones",
                        "first": "Ralph"
                    }],
                    "phone": [{
                        "number": "(816)276-6909",
                        "type": "primary home"
                    }]
                }]
            },
            "vitals": [{
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Height",
                    "code": "8302-2",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 177,
                "unit": "cm"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Patient Body Weight - Measured",
                    "code": "3141-9",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 86,
                "unit": "kg"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Intravascular Systolic",
                    "code": "8480-6",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 132,
                "unit": "mm[Hg]"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Height",
                    "code": "8302-2",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "2000-04-07T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 177,
                "unit": "cm"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Patient Body Weight - Measured",
                    "code": "3141-9",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "2000-04-07T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 88,
                "unit": "kg"
            }, {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
                "vital": {
                    "name": "Intravascular Systolic",
                    "code": "8480-6",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date": [{
                    "date": "2000-04-07T00:00:00Z",
                    "precision": "day"
                }],
                "interpretations": [
                    "Normal"
                ],
                "value": 145,
                "unit": "mm[Hg]"
            }],
            "results": [{
                "identifiers": [{
                    "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
                }],
                "result_set": {
                    "name": "CBC WO DIFFERENTIAL",
                    "code": "43789009",
                    "code_system_name": "SNOMED CT"
                },
                "results": [{
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "HGB",
                        "code": "30313-1",
                        "code_system_name": "LOINC"
                    },
                    "date": [{
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }],
                    "status": "completed",
                    "interpretations": [
                        "Normal"
                    ],
                    "value": 13.2,
                    "unit": "g/dl"
                }, {
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "WBC",
                        "code": "33765-9",
                        "code_system_name": "LOINC"
                    },
                    "date": [{
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }],
                    "status": "completed",
                    "interpretations": [
                        "Normal"
                    ],
                    "value": 6.7,
                    "unit": "10+3/ul"
                }, {
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "PLT",
                        "code": "26515-7",
                        "code_system_name": "LOINC"
                    },
                    "date": [{
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }],
                    "status": "completed",
                    "interpretations": [
                        "Low"
                    ],
                    "value": 123,
                    "unit": "10+3/ul"
                }]
            }],
            "medications": [{
                "date": [{
                    "date": "2007-01-03T00:00:00Z",
                    "precision": "day"
                }, {
                    "date": "2012-05-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
                }],
                "status": "Completed",
                "sig": "Proventil HFA ",
                "product": {
                    "identifiers": {
                        "identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
                    },
                    "unencoded_name": "Proventil HFA ",
                    "product": {
                        "name": "Proventil HFA",
                        "code": "219483",
                        "code_system_name": "RXNORM",
                        "translations": [{
                            "name": "Proventil 0.09 MG/ACTUAT inhalant solution",
                            "code": "573621",
                            "code_system_name": "RXNORM"
                        }]
                    }
                },
                "administration": {
                    "route": {
                        "name": "RESPIRATORY (INHALATION)",
                        "code": "C38216",
                        "code_system_name": "Medication Route FDA"
                    },
                    "form": {
                        "name": "INHALANT",
                        "code": "C42944",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 1,
                        "unit": "mg/actuat"
                    },
                    "rate": {
                        "value": 90,
                        "unit": "ml/min"
                    }
                },
                "precondition": {
                    "code": {
                        "code": "ASSERTION",
                        "code_system_name": "HL7ActCode"
                    },
                    "value": {
                        "name": "Wheezing",
                        "code": "56018004",
                        "code_system_name": "SNOMED CT"
                    }
                }
            }],
            "encounters": [{
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
            }],
            "allergies": [{
                "date": [{
                    "date": "2007-05-01T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "ALLERGENIC EXTRACT, PENICILLIN",
                    "code": "314422",
                    "code_system_name": "RXNORM"
                },
                "severity": "Moderate to severe",
                "status": "Inactive",
                "reaction": [{
                    "reaction": {
                        "name": "Nausea",
                        "code": "422587007",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": "Mild"
                }]
            }, {
                "date": [{
                    "date": "2006-05-01T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "Codeine",
                    "code": "2670",
                    "code_system_name": "RXNORM"
                },
                "severity": "Moderate",
                "status": "Active",
                "reaction": [{
                    "reaction": {
                        "name": "Wheezing",
                        "code": "56018004",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": "Mild"
                }]
            }, {
                "date": [{
                    "date": "2008-05-01T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "Aspirin",
                    "code": "1191",
                    "code_system_name": "RXNORM"
                },
                "severity": "Mild to moderate",
                "status": "Active",
                "reaction": [{
                    "reaction": {
                        "name": "Hives",
                        "code": "247472004",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": "Mild to moderate"
                }]
            }],
            "immunizations": [{
                "date": [{
                    "date": "1999-11-01T00:00:00Z",
                    "precision": "month"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "complete",
                "product": {
                    "product": {
                        "name": "Influenza virus vaccine",
                        "code": "88",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Influenza, seasonal, injectable",
                            "code": "141",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": {
                        "last": "Assigned",
                        "first": "Amanda"
                    },
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": "Good Health Clinic"
                    }]
                }
            }, {
                "date": [{
                    "date": "1998-12-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "refused",
                "product": {
                    "product": {
                        "name": "Influenza virus vaccine",
                        "code": "88",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Influenza, seasonal, injectable",
                            "code": "141",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": {
                        "last": "Assigned",
                        "first": "Amanda"
                    },
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": "Good Health Clinic"
                    }]
                }
            }, {
                "date": [{
                    "date": "1998-12-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "complete",
                "product": {
                    "product": {
                        "name": "Pneumococcal polysaccharide vaccine",
                        "code": "33",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Pneumococcal NOS",
                            "code": "109",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "extension": "2981824"
                    }],
                    "name": {
                        "last": "Assigned",
                        "first": "Amanda"
                    },
                    "address": [{
                        "street": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": "Good Health Clinic"
                    }]
                }
            }, {
                "date": [{
                    "date": "1998-12-15T00:00:00Z",
                    "precision": "day"
                }],
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "refused",
                "product": {
                    "product": {
                        "name": "Tetanus and diphtheria toxoids - preservative free",
                        "code": "103",
                        "code_system_name": "CVX",
                        "translations": [{}]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": {
                        "last": "Assigned",
                        "first": "Amanda"
                    },
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": "Good Health Clinic"
                    }]
                },
                "refusal_reason": "Patient objection"
            }],
            "social_history": {
                "smoking_statuses": [{
                    "value": "Former smoker",
                    "date": [{
                        "date": "2005-05-01T00:00:00Z",
                        "precision": "day"
                    }, {
                        "date": "2009-02-27T13:00:00Z",
                        "precision": "subsecond"
                    }]
                }]
            },
            "problems": [{
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
            }, {
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
            }],
            "procedures": [{
                "procedure": {
                    "name": "Colonoscopy",
                    "code": "73761001",
                    "code_system_name": "SNOMED CT"
                },
                "identifiers": [{
                    "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
                }],
                "status": "Completed",
                "date": [{
                    "date": "2012-05-12T00:00:00Z",
                    "precision": "day"
                }],
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
            }, {
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
                "date": [{
                    "date": "2011-02-03T00:00:00Z",
                    "precision": "day"
                }],
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
            }, {
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
                "date": [{
                    "date": "2011-02-03T00:00:00Z",
                    "precision": "day"
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
            }]
        }
    }

};

module.exports = testDocList;
