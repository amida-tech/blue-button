#Claims

###Object Schema:
```
{
    "type": "object",
    "$schema": "http://json-schema.org/draft-04/schema",
    "properties": {
        "charges": {
            "type": "object",
            "properties": {
                "insurance_paid": {
                    "type": "string"
                },
                "negotiated_price": {
                    "type": "string"
                },
                "patient_responsibility": {
                    "type": "string"
                },
                "price_billed": {
                    "type": "string"
                },
                "provider_paid": {
                    "type": "string"
                }
            }
        },
        "date": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "diagnoses": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "lines": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "charges": {
                        "type": "object",
                        "properties": {
                            "insurance_paid": {
                                "type": "string"
                            },
                            "negotiated_price": {
                                "type": "string"
                            },
                            "patient_responsibility": {
                                "type": "string"
                            },
                            "price_billed": {
                                "type": "string"
                            },
                            "provider_paid": {
                                "type": "string"
                            }
                        }
                    },
                    "drug": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            }
                        }
                    },
                    "end_date": {
                        "type": "string"
                    },
                    "modifiers": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            }
                        }
                    },
                    "number": {
                        "type": "string"
                    },
                    "place_of_service": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            }
                        }
                    },
                    "prescriber": {
                        "type": {
                            "type": "string"
                        },
                        "properties": {
                            "type": "string"
                        },
                        "name": {
                            "type": "string"
                        }
                    }
                },
                "procedure": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "description": {
                            "type": "string"
                        },
                        "name": {
                            "type": "string"
                        }
                    }
                },
                "quantity": {
                    "type": "string"
                },
                "rendering provider": {
                    "type": "object",
                    "properties": {
                        "npi": {
                            "type": "string"
                        },
                        "number": {
                            "type": "string"
                        }
                    }
                },
                "revenue": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "description": {
                            "type": "string"
                        },
                        "name": {
                            "type": "string"
                        }
                    }
                },
                "service date": {
                    "type": "string"
                },
                "start_date": {
                    "type": "string"
                },
                "type_of_service_code": {
                    "type": "string"
                },
                "type_of_service": {
                    "type": "string"
                }
            }
        },
        "name": {
            "type": "string"
        },
        "number": {
            "type": "string"
        },
        "payer": {
            "type": "string"
        },
        "provider": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "provider_billing_address": {
                    "type": "string"
                },
                "provider_id": {
                    "type": "string"
                },
                "provider_type": {
                    "type": "string"
                }
            }
        },
        "service": {
            "type": "string"
        },
        "type": {
            "type": "string"
        }
    }
}
```

[JSON/CMS sample](cmssamples/claims.md)


####Notes
