#Payers

###Object Schema:
```
{
    "type": "array",
    "$schema": "http://json-schema.org/draft-04/schema",
    "properties": {
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "http://local.com/common_models#/properties/cda_id"
            },
            "minItems": 1
        },
         "policy": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_id"
                    },
                    "minItems": 1
                },
                "code": {
                    "type": "object",
                    "properties": {
                        "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                    }
                },
                "insurance": {
                    "properties": {
                        "code": {
                            "type": "object",
                            "properties": {
                                "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                            }
                        },
                        "performer": {
                            "properties": {
                                "identifiers": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "http://local.com/common_models#/properties/cda_id"
                                    },
                                    "minItems": 1
                                },
                                "address": {
                                    "$ref": "http://local.com/common_models#/properties/cda_address"
                                },
                                "phone": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "http://local.com/common_models#/properties/cda_phone"
                                    }
                                },
                                "organization": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {
                                                "type":"array",
                                                "items": {
                                                    "type": "string"
                                                }
                                            },
                                            "address": {
                                                "$ref": "http://local.com/common_models#/properties/cda_address"
                                            },
                                            "phone": {
                                                "type": "array",
                                                "items": {
                                                    "$ref": "http://local.com/common_models#/properties/cda_phone"
                                                }
                                            }
                                        },
                                        "additionalProperties": false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "guarantor": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "object",
                    "properties": {
                        "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                    }
                },
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_id"
                    },
                    "minItems": 1
                },
                "address": {
                    "$ref": "http://local.com/common_models#/properties/cda_address"
                },
                "phone": {
                    "type": "array",
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_phone"
                    }
                },
                "name": {
                    "type": "array",
                    "items": {
                        "type": "object"
                    }
                }
            }
        },
        "participant": {
            "type": "object",
            "properties": {
                "date_time": {
                    "$ref": "http://local.com/common_models#/properties/cda_date"
                },
                "code": {
                    "type": "object",
                    "properties": {
                        "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                    }
                },
                "performer": {
                    "type": "object",
                    "properties": {
                         "identifiers": {
                            "type": "array",
                            "items": {
                                "$ref": "http://local.com/common_models#/properties/cda_id"
                            },
                            "minItems": 1
                        },
                        "address": {
                            "$ref": "http://local.com/common_models#/properties/cda_address"
                        }
                    }
                },
                "name": {
                    "type": "array",
                    "items": {
                        "type": "object"
                    }
                }
            }
        },
        "policy_holder": {
            "type": "object",
            "properties": {
                "performer": {
                    "type": "object", 
                    "properties": {
                        "identifiers": {
                            "type": "array",
                            "items": {
                                "$ref": "http://local.com/common_models#/properties/cda_id"
                            },
                            "minItems": 1
                        },
                        "address": {
                            "$ref": "http://local.com/common_models#/properties/cda_address"
                        }
                    }
                }
            }
        },
        "authorization": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "http://local.com/common_models#/properties/cda_id"
                    },
                    "minItems": 1
                },
                "procedure": {
                    "code": {
                        "type": "object",
                        "properties": {
                            "$ref": "http://local.com/common_models#/properties/cda_coded_entry"
                        }
                    },
                }
            }
        }
    },
    "required": [
        "policy"
    ],
    "additionalProperties": false
}
```

- [JSON/XML sample](samples/payers.md)
