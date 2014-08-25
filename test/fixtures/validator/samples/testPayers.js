var test_payers_list = {
    "regular1": [{
        "identifiers": [{
            "identifier": "1fe2cdd0-7aad-11db-9fe1-0800200c9a66"
        }],
        "policy": {
            "identifiers": [{
                "identifier": "3e676a50-7aac-11db-9fe1-0800200c9a66"
            }],
            "code": {
                "code": "SELF",
                "code_system_name": "OID 2.16.840.1.113883.5.110"
            },
            "insurance": {
                "code": {
                    "code": "PAYOR",
                    "code_system_name": "OID 2.16.840.1.113883.5.110"
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19"
                    }],
                    "address": [{
                        "street_lines": [
                            "123 Insurance Road"
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US",
                        "use": "work place"
                    }],
                    "phone": [{
                        "number": "(781)555-1515",
                        "type": "work place"
                    }],
                    "organization": [{
                        "name": [
                            "Good Health Insurance"
                        ],
                        "address": [{
                            "street_lines": [
                                "123 Insurance Road"
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US",
                            "use": "work place"
                        }],
                        "phone": [{
                            "number": "(781)555-1515",
                            "type": "work place"
                        }]
                    }]
                }
            }
        },
        "guarantor": {
            "code": {
                "code": "GUAR",
                "code_system_name": "HL7 Role"
            },
            "identifiers": [{
                "identifier": "329fcdf0-7ab3-11db-9fe1-0800200c9a66"
            }],
            "address": [{
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US",
                "use": "primary home"
            }],
            "phone": [{
                "number": "(781)555-1212",
                "type": "primary home"
            }],
            "name": [{
                "prefix": "Mr.",
                "middle": [
                    "Frankie"
                ],
                "last": "Everyman",
                "first": "Adam"
            }]
        },
        "participant": {
            "date_time": {},
            "code": {
                "name": "Self",
                "code": "SELF",
                "code_system_name": "HL7 Role"
            },
            "performer": {
                "identifiers": [{
                    "identifier": "14d4a520-7aae-11db-9fe1-0800200c9a66",
                    "extension": "1138345"
                }],
                "address": [{
                    "street_lines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US",
                    "use": "primary home"
                }]
            },
            "name": [{
                "prefix": "Mr.",
                "middle": [
                    "A."
                ],
                "last": "Everyman",
                "first": "Frank"
            }]
        },
        "policy_holder": {
            "performer": {
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19",
                    "extension": "1138345"
                }],
                "address": [{
                    "street_lines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US",
                    "use": "primary home"
                }]
            }
        },
        "authorization": {
            "identifiers": [{
                "identifier": "f4dce790-8328-11db-9fe1-0800200c9a66"
            }],
            "procedure": {
                "code": {
                    "name": "Colonoscopy",
                    "code": "73761001",
                    "code_system_name": "SNOMED CT"
                }
            }
        }
    }],
    "missing_policy_holder": [{
        "identifiers": [{
            "identifier": "1fe2cdd0-7aad-11db-9fe1-0800200c9a66"
        }],
        "policy": {
            "identifiers": [{
                "identifier": "3e676a50-7aac-11db-9fe1-0800200c9a66"
            }],
            "code": {
                "code": "SELF",
                "code_system_name": "OID 2.16.840.1.113883.5.110"
            },
            "insurance": {
                "code": {
                    "code": "PAYOR",
                    "code_system_name": "OID 2.16.840.1.113883.5.110"
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19"
                    }],
                    "address": [{
                        "street_lines": [
                            "123 Insurance Road"
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US",
                        "use": "work place"
                    }],
                    "phone": [{
                        "number": "(781)555-1515",
                        "type": "work place"
                    }],
                    "organization": [{
                        "name": [
                            "Good Health Insurance"
                        ],
                        "address": [{
                            "street_lines": [
                                "123 Insurance Road"
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US",
                            "use": "work place"
                        }],
                        "phone": [{
                            "number": "(781)555-1515",
                            "type": "work place"
                        }]
                    }]
                }
            }
        },
        "guarantor": {
            "code": {
                "code": "GUAR",
                "code_system_name": "HL7 Role"
            },
            "identifiers": [{
                "identifier": "329fcdf0-7ab3-11db-9fe1-0800200c9a66"
            }],
            "address": [{
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US",
                "use": "primary home"
            }],
            "phone": [{
                "number": "(781)555-1212",
                "type": "primary home"
            }],
            "name": [{
                "prefix": "Mr.",
                "middle": [
                    "Frankie"
                ],
                "last": "Everyman",
                "first": "Adam"
            }]
        },
        "participant": {
            "date_time": {},
            "code": {
                "name": "Self",
                "code": "SELF",
                "code_system_name": "HL7 Role"
            },
            "performer": {
                "identifiers": [{
                    "identifier": "14d4a520-7aae-11db-9fe1-0800200c9a66",
                    "extension": "1138345"
                }],
                "address": [{
                    "street_lines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US",
                    "use": "primary home"
                }]
            },
            "name": [{
                "prefix": "Mr.",
                "middle": [
                    "A."
                ],
                "last": "Everyman",
                "first": "Frank"
            }]
        },
        "authorization": {
            "identifiers": [{
                "identifier": "f4dce790-8328-11db-9fe1-0800200c9a66"
            }],
            "procedure": {
                "code": {
                    "name": "Colonoscopy",
                    "code": "73761001",
                    "code_system_name": "SNOMED CT"
                }
            }
        }
    }],
    "missing_guarantor": [{
        "identifiers": [{
            "identifier": "1fe2cdd0-7aad-11db-9fe1-0800200c9a66"
        }],
        "policy": {
            "identifiers": [{
                "identifier": "3e676a50-7aac-11db-9fe1-0800200c9a66"
            }],
            "code": {
                "code": "SELF",
                "code_system_name": "OID 2.16.840.1.113883.5.110"
            },
            "insurance": {
                "code": {
                    "code": "PAYOR",
                    "code_system_name": "OID 2.16.840.1.113883.5.110"
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19"
                    }],
                    "address": [{
                        "street_lines": [
                            "123 Insurance Road"
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US",
                        "use": "work place"
                    }],
                    "phone": [{
                        "number": "(781)555-1515",
                        "type": "work place"
                    }],
                    "organization": [{
                        "name": [
                            "Good Health Insurance"
                        ],
                        "address": [{
                            "street_lines": [
                                "123 Insurance Road"
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US",
                            "use": "work place"
                        }],
                        "phone": [{
                            "number": "(781)555-1515",
                            "type": "work place"
                        }]
                    }]
                }
            }
        },
        "participant": {
            "date_time": {},
            "code": {
                "name": "Self",
                "code": "SELF",
                "code_system_name": "HL7 Role"
            },
            "performer": {
                "identifiers": [{
                    "identifier": "14d4a520-7aae-11db-9fe1-0800200c9a66",
                    "extension": "1138345"
                }],
                "address": [{
                    "street_lines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US",
                    "use": "primary home"
                }]
            },
            "name": [{
                "prefix": "Mr.",
                "middle": [
                    "A."
                ],
                "last": "Everyman",
                "first": "Frank"
            }]
        },
        "policy_holder": {
            "performer": {
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19",
                    "extension": "1138345"
                }],
                "address": [{
                    "street_lines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US",
                    "use": "primary home"
                }]
            }
        },
        "authorization": {
            "identifiers": [{
                "identifier": "f4dce790-8328-11db-9fe1-0800200c9a66"
            }],
            "procedure": {
                "code": {
                    "name": "Colonoscopy",
                    "code": "73761001",
                    "code_system_name": "SNOMED CT"
                }
            }
        }
    }],
    "missing_policy": [{
        "identifiers": [{
            "identifier": "1fe2cdd0-7aad-11db-9fe1-0800200c9a66"
        }],
        "guarantor": {
            "code": {
                "code": "GUAR",
                "code_system_name": "HL7 Role"
            },
            "identifiers": [{
                "identifier": "329fcdf0-7ab3-11db-9fe1-0800200c9a66"
            }],
            "address": [{
                "street_lines": [
                    "17 Daws Rd."
                ],
                "city": "Blue Bell",
                "state": "MA",
                "zip": "02368",
                "country": "US",
                "use": "primary home"
            }],
            "phone": [{
                "number": "(781)555-1212",
                "type": "primary home"
            }],
            "name": [{
                "prefix": "Mr.",
                "middle": [
                    "Frankie"
                ],
                "last": "Everyman",
                "first": "Adam"
            }]
        },
        "participant": {
            "date_time": {},
            "code": {
                "name": "Self",
                "code": "SELF",
                "code_system_name": "HL7 Role"
            },
            "performer": {
                "identifiers": [{
                    "identifier": "14d4a520-7aae-11db-9fe1-0800200c9a66",
                    "extension": "1138345"
                }],
                "address": [{
                    "street_lines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US",
                    "use": "primary home"
                }]
            },
            "name": [{
                "prefix": "Mr.",
                "middle": [
                    "A."
                ],
                "last": "Everyman",
                "first": "Frank"
            }]
        },
        "policy_holder": {
            "performer": {
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19",
                    "extension": "1138345"
                }],
                "address": [{
                    "street_lines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US",
                    "use": "primary home"
                }]
            }
        },
        "authorization": {
            "identifiers": [{
                "identifier": "f4dce790-8328-11db-9fe1-0800200c9a66"
            }],
            "procedure": {
                "code": {
                    "name": "Colonoscopy",
                    "code": "73761001",
                    "code_system_name": "SNOMED CT"
                }
            }
        }
    }]
}

exports.test_payers_list = test_payers_list;
