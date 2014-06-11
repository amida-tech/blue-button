/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in 
standard XML/CCDA format) back to XML/CCDA format. In order to re-build the CCD accurately, the script determines the 
section template to which the data belongs to by analyzing its value set codes. In other words, if the JSON data contains 
a value set belonging to a certain section, then it must belong to that section since different sections do not have the 
same value sets.

For example, if the JSON data contains an entry with a code of 8302-2 (which belongs to the value set "Height"), then that 
entry must be a descendant of the Vital Signs section template since the Vital Signs section contains such a value set, as 
specified by the CCDA standard (available at http://www.hl7.org/implement/standards/product_brief.cfm?product_id=258).

Once the section template is determined, an XML document is generated using the libxmljs Document API and passing in the 
appropriate XML attributes for the section template determined previously.
*/

var libxmljs = require("libxmljs");
var CCDA = require("blue-button-meta");

var data = [
        {
            "date": [
                {
                    "date": "1999-11-01T00:00:00.000Z",
                    "precision": "month"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "complete",
            "product": {
                "name": "Influenza virus vaccine",
                "code": "88",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Influenza, seasonal, injectable",
                        "code": "141",
                        "code_system_name": "CVX"
                    }
                ],
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc."
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1998-12-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "refused",
            "product": {
                "name": "Influenza virus vaccine",
                "code": "88",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Influenza, seasonal, injectable",
                        "code": "141",
                        "code_system_name": "CVX"
                    }
                ],
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc."
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1998-12-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "complete",
            "product": {
                "name": "Pneumococcal polysaccharide vaccine",
                "code": "33",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Pneumococcal NOS",
                        "code": "109",
                        "code_system_name": "CVX"
                    }
                ],
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc."
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1998-12-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "refused",
            "product": {
                "name": "Tetanus and diphtheria toxoids - preservative free",
                "code": "103",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Tetanus and diphtheria toxoids - preservative free",
                        "code": "09",
                        "code_system_name": "CVX"
                    }
                ],
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc."
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            },
            "refusal_reason": "Patient objection"
        }
    ]



/* 
This data structure delineates the value set codes for each possible section template in a CCD. 
See sectionNumberToSectionName data structure for order. 
*/
var valueSetCodesToSection = [["422587007", "56018004", "247472004"],[],[],[],[],[],[],["9279-1", "8867-4", "2710-2", "8480-6", "8462-4", 
"8310-5", "8302-2", "8306-3", "8287-5", "3141-9", "39156-5", "3140-1"]];

var codeMapSample = {"8310-5":{"Concept Code":"8310-5","Concept Name":"Body Temperature","Preferred Concept Name":"Body temperature:Temp:Pt:^Patient:Qn:","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null},"8462-4":{"Concept Code":"8462-4","Concept Name":"BP Diastolic","Preferred Concept Name":"Intravascular diastolic:Pres:Pt:Arterial system:Qn:","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null},"8480-6":{"Concept Code":"8480-6","Concept Name":"BP Systolic","Preferred Concept Name":"Intravascular systolic:Pres:Pt:Arterial system:Qn:","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null},"8287-5":{"Concept Code":"8287-5","Concept Name":"Head Circumference","Preferred Concept Name":"Circumference.occipital-frontal:Len:Pt:Head:Qn:Tape measure","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null},"8867-4":{"Concept Code":"8867-4","Concept Name":"Heart Rate","Preferred Concept Name":"Heart beat:NRat:Pt:XXX:Qn:","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null},"8302-2":{"Concept Code":"8302-2","Concept Name":"Height","Preferred Concept Name":"Body height:Len:Pt:^Patient:Qn:","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null},"8306-3":{"Concept Code":"8306-3","Concept Name":"Height (Lying)","Preferred Concept Name":"Body height^lying:Len:Pt:^Patient:Qn:","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null},"2710-2":{"Concept Code":"2710-2","Concept Name":"O2 % BldC Oximetry","Preferred Concept Name":"Oxygen saturation:SFr:Pt:BldC:Qn:Oximetry","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null},"9279-1":{"Concept Code":"9279-1","Concept Name":"Respiratory Rate","Preferred Concept Name":"Breaths:NRat:Pt:Respiratory system:Qn:","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null},"3141-9":{"Concept Code":"3141-9","Concept Name":"Weight Measured","Preferred Concept Name":"Body weight:Mass:Pt:^Patient:Qn:Measured","Preferred Alternate Code":null,"Code System OID":"2.16.840.1.113883.6.1","Code System Name":"LOINC","Code System Code":"PH_LOINC","Code System Version":"2.32","HL7 Table 0396 Code":"LN","Value Set Name":"Vital Sign Result Value Set","Value Set Code":"PHVS_VitalSignResult_HITSP","Value Set OID":"2.16.840.1.113883.3.88.12.80.62","Value Set Version":"1","Value Set Definition":"This identifies the vital sign result type","Value Set Status":"Published","VS Last Updated Date":"7/23/09","VS Release Comments":null}}


var valueSetOIDToSection = {
    "2.16.840.1.113883.3.88.12.80.62": ["2.16.840.1.113883.10.20.22.2.4", "2.16.840.1.113883.10.20.22.2.4.1"]
}


// Map section number to section name and specify order for valueSetCodesToSections parallel array
var sectionNames = {
	1: "allergies",
	2: "medications",
	3: "problems",
	4: "results",
	5: "demographics",
	6: "procedures",
	7: "encounters",
	8: "immunizations",
    9: "vitals",
    10: "socialHistory"
}

/*
This data structure maps code system names to code systems identifiers.
*/
var codeSystems = {
	"LOINC": ["2.16.840.1.113883.6.1", "8716-3"], 
	"SNOMED CT": ["2.16.840.1.113883.6.96", "46680005"], 
	"RXNORM": "2.16.840.1.113883.6.88",
	"ActCode": "2.16.840.1.113883.5.4", 
	"CPT-4": "2.16.840.1.113883.6.12", 
	"CVX": "2.16.840.1.113883.12.292", 
	"HL7ActCode": "2.16.840.1.113883.5.4"
}

/*
This function takes JSON data as a parameter, determines its section template, then generates an 
XML document appropriate to that section.

@data the JSON data to be converted to XML/CCDA
*/
function parseJSONToCCDA(data) {
	var sectionNumber = determineSection(data);
    var xml = require('./templates/' + sectionNames[sectionNumber] +'.js')(sectionNumber, data, codeSystems);
    console.log(xml.toString());
}

function determineSection(json) {
    if (json[0] && json[0]["severity"]) // allergies
        sectionNumber = 1
    else if (json[0] && json[0]["sig"]) // medications
        sectionNumber = 2
    else if (json[0] && json[0]["onset_age"]) // problems
        sectionNumber = 3
    else if (json[0] && json[0]["results"] != undefined) // results
        sectionNumber = 4
    else if (json["gender"]) // demographics
        sectionNumber = 5
    else if (json[0] && json[0]["bodysite"]) // procedures
        sectionNumber = 6
    else if (json[0] && json[0]["locations"]) // encounters
        sectionNumber = 7
    else if (json[0] && json[0]["product"]) // immunizations
        sectionNumber = 8
    else if (json[0] && json[0]["freeTextValue"]) // vital signs
        sectionNumber = 9
    else  // social history
        sectionNumber = 10

    return sectionNumber;
}

parseJSONToCCDA(data);




