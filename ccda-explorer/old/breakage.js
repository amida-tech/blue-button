amidala:ccda-explorer dkachaev$ node entry_test.js 
{
    "super_": {
        "cleanupSteps": {
            "paredown": [
                null,
                null
            ]
        },
        "componentName": "Component",
        "needsUri": false,
        "_negationStatus": false
    },
    "cleanupSteps": {
        "1": [
            null
        ]
    },
    "componentName": "ResultsOrganizer",
    "needsUri": false,
    "templateRoots": [
        "2.16.840.1.113883.10.20.22.4.1"
    ],
    "parsers": [
        {
            "xpath": "h:id",
            "cardinality": "1..*",
            "required": true,
            "multiple": true,
            "jsPath": "identifiers",
            "component": {
                "super_": {
                    "cleanupSteps": {
                        "paredown": [
                            null,
                            null
                        ]
                    },
                    "componentName": "Component",
                    "needsUri": false,
                    "_negationStatus": false
                },
                "cleanupSteps": {},
                "componentName": "Identifier",
                "needsUri": false,
                "parsers": [
                    {
                        "xpath": "@root",
                        "cardinality": "1..1",
                        "required": true,
                        "multiple": false,
                        "jsPath": "identifier",
                        "component": null
                    },
                    {
                        "xpath": "@extension",
                        "cardinality": "0..1",
                        "required": false,
                        "multiple": false,
                        "jsPath": "identifier_type",
                        "component": null
                    }
                ]
            }
        },
        {
            "xpath": ".//h:templateId[@root='2.16.840.1.113883.10.20.22.4.2']/..",
            "cardinality": "1..*",
            "required": true,
            "multiple": true,
            "jsPath": "results",
            "component": {
                "super_": {
                    "cleanupSteps": {
                        "paredown": [
                            null,
                            null
                        ]
                    },
                    "componentName": "Component",
                    "needsUri": false,
                    "_negationStatus": false
                },
                "cleanupSteps": {
                    "1": [
                        null,
                        null
                    ]
                },
                "componentName": "ResultObservation",
                "needsUri": false,
                "templateRoots": [
                    "2.16.840.1.113883.10.20.22.4.2"
                ],
                "parsers": [
                    {
                        "xpath": "h:id",
                        "cardinality": "1..*",
                        "required": true,
                        "multiple": true,
                        "jsPath": "identifiers",
                        "component": {
                            "super_": {
                                "cleanupSteps": {
                                    "paredown": [
                                        null,
                                        null
                                    ]
                                },
                                "componentName": "Component",
                                "needsUri": false,
                                "_negationStatus": false
                            },
                            "cleanupSteps": {},
                            "componentName": "Identifier",
                            "needsUri": false,
                            "parsers": [
                                {
                                    "xpath": "@root",
                                    "cardinality": "1..1",
                                    "required": true,
                                    "multiple": false,
                                    "jsPath": "identifier",
                                    "component": null
                                },
                                {
                                    "xpath": "@extension",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "identifier_type",
                                    "component": null
                                }
                            ]
                        }
                    },
                    {
                        "xpath": "h:code",
                        "cardinality": "1..1",
                        "required": true,
                        "multiple": false,
                        "jsPath": "resultName",
                        "component": {
                            "super_": {
                                "cleanupSteps": {
                                    "paredown": [
                                        null,
                                        null
                                    ]
                                },
                                "componentName": "Component",
                                "needsUri": false,
                                "_negationStatus": false
                            },
                            "cleanupSteps": {
                                "1": [
                                    null,
                                    null
                                ]
                            },
                            "componentName": "ConceptDescriptor",
                            "needsUri": false,
                            "parsers": [
                                {
                                    "xpath": "@displayName",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "name",
                                    "component": null
                                },
                                {
                                    "xpath": "@code",
                                    "cardinality": "1..1",
                                    "required": true,
                                    "multiple": false,
                                    "jsPath": "code",
                                    "component": null
                                },
                                {
                                    "xpath": "@codeSystem",
                                    "cardinality": "1..1",
                                    "required": true,
                                    "multiple": false,
                                    "jsPath": "system",
                                    "component": null
                                },
                                {
                                    "xpath": "@codeSystemName",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "code_system_name",
                                    "component": null
                                },
                                {
                                    "xpath": "@nullFlavor",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "nullFlavor",
                                    "component": null
                                },
                                {
                                    "xpath": "h:translation",
                                    "cardinality": "0..*",
                                    "required": false,
                                    "multiple": true,
                                    "jsPath": "translations",
                                    "component": {
                                        "super_": {
                                            "cleanupSteps": {
                                                "paredown": [
                                                    null,
                                                    null
                                                ]
                                            },
                                            "componentName": "Component",
                                            "needsUri": false,
                                            "_negationStatus": false
                                        },
                                        "cleanupSteps": {
                                            "1": [
                                                null,
                                                null
                                            ]
                                        },
                                        "componentName": "conceptWoutTranslation",
                                        "needsUri": false,
                                        "parsers": [
                                            {
                                                "xpath": "@displayName",
                                                "cardinality": "0..1",
                                                "required": false,
                                                "multiple": false,
                                                "jsPath": "name",
                                                "component": null
                                            },
                                            {
                                                "xpath": "@code",
                                                "cardinality": "1..1",
                                                "required": true,
                                                "multiple": false,
                                                "jsPath": "code",
                                                "component": null
                                            },
                                            {
                                                "xpath": "@codeSystem",
                                                "cardinality": "1..1",
                                                "required": true,
                                                "multiple": false,
                                                "jsPath": "system",
                                                "component": null
                                            },
                                            {
                                                "xpath": "@codeSystemName",
                                                "cardinality": "0..1",
                                                "required": false,
                                                "multiple": false,
                                                "jsPath": "code_system_name",
                                                "component": null
                                            },
                                            {
                                                "xpath": "@nullFlavor",
                                                "cardinality": "0..1",
                                                "required": false,
                                                "multiple": false,
                                                "jsPath": "nullFlavor",
                                                "component": null
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "xpath": "h:effectiveTime",
                        "cardinality": "1..1",
                        "required": true,
                        "multiple": false,
                        "jsPath": "date",
                        "component": {
                            "super_": {
                                "cleanupSteps": {
                                    "paredown": [
                                        null,
                                        null
                                    ]
                                },
                                "componentName": "Component",
                                "needsUri": false,
                                "_negationStatus": false
                            },
                            "cleanupSteps": {
                                "1": [
                                    null,
                                    null
                                ]
                            },
                            "componentName": "EffectiveTime",
                            "needsUri": false,
                            "parsers": [
                                {
                                    "xpath": "@value",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "point"
                                },
                                {
                                    "xpath": "@value",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "point_resolution"
                                },
                                {
                                    "xpath": "h:low/@value",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "low"
                                },
                                {
                                    "xpath": "h:low/@value",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "low_resolution"
                                },
                                {
                                    "xpath": "h:high/@value",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "high"
                                },
                                {
                                    "xpath": "h:high/@value",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "high_resolution"
                                },
                                {
                                    "xpath": "./@operator",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "operator",
                                    "component": null
                                },
                                {
                                    "xpath": "./@xsi:type",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "xsitype",
                                    "component": null
                                },
                                {
                                    "xpath": "./h:period",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "period",
                                    "component": {
                                        "super_": {
                                            "cleanupSteps": {
                                                "paredown": [
                                                    null,
                                                    null
                                                ]
                                            },
                                            "componentName": "Component",
                                            "needsUri": false,
                                            "_negationStatus": false
                                        },
                                        "cleanupSteps": {},
                                        "componentName": "PhysicalQuantity",
                                        "needsUri": false,
                                        "parsers": [
                                            {
                                                "xpath": "@value",
                                                "cardinality": "1..1",
                                                "required": true,
                                                "multiple": false,
                                                "jsPath": "value"
                                            },
                                            {
                                                "xpath": "@unit",
                                                "cardinality": "0..1",
                                                "required": false,
                                                "multiple": false,
                                                "jsPath": "unit",
                                                "component": null
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "xpath": "h:value[@xsi:type='PQ']",
                        "cardinality": "1..1",
                        "required": true,
                        "multiple": false,
                        "jsPath": "physicalQuantity",
                        "component": {
                            "super_": {
                                "cleanupSteps": {
                                    "paredown": [
                                        null,
                                        null
                                    ]
                                },
                                "componentName": "Component",
                                "needsUri": false,
                                "_negationStatus": false
                            },
                            "cleanupSteps": {},
                            "componentName": "PhysicalQuantity",
                            "needsUri": false,
                            "parsers": [
                                {
                                    "xpath": "@value",
                                    "cardinality": "1..1",
                                    "required": true,
                                    "multiple": false,
                                    "jsPath": "value"
                                },
                                {
                                    "xpath": "@unit",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "unit",
                                    "component": null
                                }
                            ]
                        }
                    },
                    {
                        "xpath": "h:text",
                        "cardinality": "0..1",
                        "required": false,
                        "multiple": false,
                        "jsPath": "freeTextValue",
                        "component": {
                            "super_": {
                                "cleanupSteps": {
                                    "paredown": [
                                        null,
                                        null
                                    ]
                                },
                                "componentName": "Component",
                                "needsUri": false,
                                "_negationStatus": false
                            },
                            "cleanupSteps": {
                                "1": [
                                    null
                                ]
                            },
                            "componentName": "TextWithReference",
                            "needsUri": false,
                            "parsers": [
                                {
                                    "xpath": "text()",
                                    "cardinality": "0..*",
                                    "required": false,
                                    "multiple": true,
                                    "jsPath": "text",
                                    "component": null
                                },
                                {
                                    "xpath": "./h:reference/@value",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "reference",
                                    "component": null
                                }
                            ]
                        }
                    },
                    {
                        "xpath": "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']",
                        "cardinality": "0..*",
                        "required": false,
                        "multiple": true,
                        "jsPath": "interpretations",
                        "component": {
                            "super_": {
                                "super_": {
                                    "cleanupSteps": {
                                        "paredown": [
                                            null,
                                            null
                                        ]
                                    },
                                    "componentName": "Component",
                                    "needsUri": false,
                                    "_negationStatus": false
                                },
                                "cleanupSteps": {
                                    "1": [
                                        null,
                                        null
                                    ]
                                },
                                "componentName": "ConceptDescriptor",
                                "needsUri": false,
                                "parsers": [
                                    {
                                        "xpath": "@displayName",
                                        "cardinality": "0..1",
                                        "required": false,
                                        "multiple": false,
                                        "jsPath": "name",
                                        "component": null
                                    },
                                    {
                                        "xpath": "@code",
                                        "cardinality": "1..1",
                                        "required": true,
                                        "multiple": false,
                                        "jsPath": "code",
                                        "component": null
                                    },
                                    {
                                        "xpath": "@codeSystem",
                                        "cardinality": "1..1",
                                        "required": true,
                                        "multiple": false,
                                        "jsPath": "system",
                                        "component": null
                                    },
                                    {
                                        "xpath": "@codeSystemName",
                                        "cardinality": "0..1",
                                        "required": false,
                                        "multiple": false,
                                        "jsPath": "code_system_name",
                                        "component": null
                                    },
                                    {
                                        "xpath": "@nullFlavor",
                                        "cardinality": "0..1",
                                        "required": false,
                                        "multiple": false,
                                        "jsPath": "nullFlavor",
                                        "component": null
                                    },
                                    {
                                        "xpath": "h:translation",
                                        "cardinality": "0..*",
                                        "required": false,
                                        "multiple": true,
                                        "jsPath": "translations",
                                        "component": {
                                            "super_": {
                                                "cleanupSteps": {
                                                    "paredown": [
                                                        null,
                                                        null
                                                    ]
                                                },
                                                "componentName": "Component",
                                                "needsUri": false,
                                                "_negationStatus": false
                                            },
                                            "cleanupSteps": {
                                                "1": [
                                                    null,
                                                    null
                                                ]
                                            },
                                            "componentName": "conceptWoutTranslation",
                                            "needsUri": false,
                                            "parsers": [
                                                {
                                                    "xpath": "@displayName",
                                                    "cardinality": "0..1",
                                                    "required": false,
                                                    "multiple": false,
                                                    "jsPath": "name",
                                                    "component": null
                                                },
                                                {
                                                    "xpath": "@code",
                                                    "cardinality": "1..1",
                                                    "required": true,
                                                    "multiple": false,
                                                    "jsPath": "code",
                                                    "component": null
                                                },
                                                {
                                                    "xpath": "@codeSystem",
                                                    "cardinality": "1..1",
                                                    "required": true,
                                                    "multiple": false,
                                                    "jsPath": "system",
                                                    "component": null
                                                },
                                                {
                                                    "xpath": "@codeSystemName",
                                                    "cardinality": "0..1",
                                                    "required": false,
                                                    "multiple": false,
                                                    "jsPath": "code_system_name",
                                                    "component": null
                                                },
                                                {
                                                    "xpath": "@nullFlavor",
                                                    "cardinality": "0..1",
                                                    "required": false,
                                                    "multiple": false,
                                                    "jsPath": "nullFlavor",
                                                    "component": null
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            "cleanupSteps": {
                                "1": [
                                    null
                                ]
                            },
                            "componentName": "SimpifiedCode",
                            "needsUri": false
                        }
                    }
                ]
            }
        },
        {
            "xpath": "h:code",
            "cardinality": "0..1",
            "required": false,
            "multiple": false,
            "jsPath": "panelName",
            "component": {
                "super_": {
                    "cleanupSteps": {
                        "paredown": [
                            null,
                            null
                        ]
                    },
                    "componentName": "Component",
                    "needsUri": false,
                    "_negationStatus": false
                },
                "cleanupSteps": {
                    "1": [
                        null,
                        null
                    ]
                },
                "componentName": "ConceptDescriptor",
                "needsUri": false,
                "parsers": [
                    {
                        "xpath": "@displayName",
                        "cardinality": "0..1",
                        "required": false,
                        "multiple": false,
                        "jsPath": "name",
                        "component": null
                    },
                    {
                        "xpath": "@code",
                        "cardinality": "1..1",
                        "required": true,
                        "multiple": false,
                        "jsPath": "code",
                        "component": null
                    },
                    {
                        "xpath": "@codeSystem",
                        "cardinality": "1..1",
                        "required": true,
                        "multiple": false,
                        "jsPath": "system",
                        "component": null
                    },
                    {
                        "xpath": "@codeSystemName",
                        "cardinality": "0..1",
                        "required": false,
                        "multiple": false,
                        "jsPath": "code_system_name",
                        "component": null
                    },
                    {
                        "xpath": "@nullFlavor",
                        "cardinality": "0..1",
                        "required": false,
                        "multiple": false,
                        "jsPath": "nullFlavor",
                        "component": null
                    },
                    {
                        "xpath": "h:translation",
                        "cardinality": "0..*",
                        "required": false,
                        "multiple": true,
                        "jsPath": "translations",
                        "component": {
                            "super_": {
                                "cleanupSteps": {
                                    "paredown": [
                                        null,
                                        null
                                    ]
                                },
                                "componentName": "Component",
                                "needsUri": false,
                                "_negationStatus": false
                            },
                            "cleanupSteps": {
                                "1": [
                                    null,
                                    null
                                ]
                            },
                            "componentName": "conceptWoutTranslation",
                            "needsUri": false,
                            "parsers": [
                                {
                                    "xpath": "@displayName",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "name",
                                    "component": null
                                },
                                {
                                    "xpath": "@code",
                                    "cardinality": "1..1",
                                    "required": true,
                                    "multiple": false,
                                    "jsPath": "code",
                                    "component": null
                                },
                                {
                                    "xpath": "@codeSystem",
                                    "cardinality": "1..1",
                                    "required": true,
                                    "multiple": false,
                                    "jsPath": "system",
                                    "component": null
                                },
                                {
                                    "xpath": "@codeSystemName",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "code_system_name",
                                    "component": null
                                },
                                {
                                    "xpath": "@nullFlavor",
                                    "cardinality": "0..1",
                                    "required": false,
                                    "multiple": false,
                                    "jsPath": "nullFlavor",
                                    "component": null
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}
>>>>

/Users/dkachaev/repos/amida-tech/blue-button/lib/parser/ccda/cleanup.js:167
            if (tmp.js) {
                   ^
TypeError: Cannot read property 'js' of null
    at Object.<anonymous> (/Users/dkachaev/repos/amida-tech/blue-button/lib/parser/ccda/cleanup.js:167:20)
    at Array.forEach (native)
    at Object.r (/Users/dkachaev/repos/amida-tech/blue-button/lib/parser/ccda/cleanup.js:160:15)
    at Object.<anonymous> (/Users/dkachaev/repos/amida-tech/blue-button/lib/parser/ccda/componentInstance.js:46:14)
    at Array.forEach (native)
    at Object.<anonymous> (/Users/dkachaev/repos/amida-tech/blue-button/lib/parser/ccda/componentInstance.js:45:35)
    at Array.forEach (native)
    at Object.ComponentInstance.cleanup (/Users/dkachaev/repos/amida-tech/blue-button/lib/parser/ccda/componentInstance.js:43:10)
    at Object.deepForEach.post (/Users/dkachaev/repos/amida-tech/blue-button/lib/parser/ccda/componentInstance.js:31:29)
    at deepForEach (/Users/dkachaev/repos/amida-tech/blue-button/lib/parser/ccda/common.js:32:15)
amidala:ccda-explorer dkachaev$ 
