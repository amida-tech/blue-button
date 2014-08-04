#Claims Section

Data model description - [Claims](../claims.md)

##JSON model sample

```javascript

[
    {
        "payer": [
            "medicare"
        ],
        "number": "1234567890000",
        "start_date": {
            "date": "2012-10-18T00:00:00Z",
            "precision": "day"
        },
        "lines": [
            {
                "line": "1",
                "start_date": {
                    "date": "2012-10-18T00:00:00Z",
                    "precision": "day"
                },
                "end_date": {
                    "date": "2012-10-18T00:00:00Z",
                    "precision": "day"
                },
                "procedure": {
                    "code": "98941",
                    "description": "Chiropractic Manipulative Treatment (Cmt); Spinal, Three To Four Regions"
                },
                "quantity": 1,
                "modifier": [
                    {
                        "code": "98941",
                        "description": "Chiropractic Manipulative Treatment (Cmt); Spinal, Three To Four Regions"
                    }
                ],
                "charges": {
                    "price_billed": "$60.00",
                    "insurance_paid": "$34.00"
                },
                "place": {
                    "code": "11",
                    "name": "Office"
                },
                "type": {
                    "code": "1",
                    "name": "Medical Care"
                },
                "rendering_provider": {
                    "number": "0000001",
                    "npi": "123456789"
                }
            }
        ],
        "charges": {
            "price_billed": "$60.00",
            "provider_paid": "$27.20",
            "patient_responsibility": "$6.80"
        },
        "type": [
            "medicare PartB"
        ],
        "diagnosis": [
            {
                "code": "3534"
            },
            {
                "code": "7393"
            },
            {
                "code": "7392"
            },
            {
                "code": "3533"
            }
        ],
        "provider": {
            "name": "No Information Available"
        }
    },
    {
        "payer": [
            "medicare"
        ],
        "number": "12345678900000VAA",
        "start_date": {
            "date": "2012-09-22T00:00:00Z",
            "precision": "day"
        },
        "lines": [
            {
                "line": "1",
                "start_date": {
                    "date": "2012-09-22T00:00:00Z",
                    "precision": "day"
                },
                "quantity": 1,
                "charges": {
                    "price_billed": "$14.30",
                    "insurance_paid": "$14.30"
                }
            },
            {
                "line": "2",
                "start_date": {
                    "date": "2012-09-22T00:00:00Z",
                    "precision": "day"
                },
                "procedure": {
                    "code": "74020",
                    "description": "Radiologic Examination, Abdomen; Complete, Including Decubitus And/Or Erect Views"
                },
                "quantity": 1,
                "charges": {
                    "price_billed": "$175.50",
                    "insurance_paid": "$175.50"
                }
            },
            {
                "line": "3",
                "start_date": {
                    "date": "2012-09-22T00:00:00Z",
                    "precision": "day"
                },
                "procedure": {
                    "code": "99283",
                    "description": "Emergency Department Visit For The Evaluation And Management Of A Patient, Which Requires Th"
                },
                "quantity": 1,
                "modifier": [
                    {
                        "code": "99283",
                        "description": "Emergency Department Visit For The Evaluation And Management Of A Patient, Which Requires Th"
                    }
                ],
                "charges": {
                    "price_billed": "$315.00",
                    "insurance_paid": "$315.00"
                }
            },
            {
                "line": "4",
                "quantity": 0,
                "charges": {
                    "price_billed": "$504.80",
                    "insurance_paid": "$504.80"
                }
            }
        ],
        "charges": {
            "price_billed": "$504.80",
            "provider_paid": "$126.31",
            "patient_responsibility": "$38.84"
        },
        "type": [
            "medicare Outpatient"
        ],
        "diagnosis": [
            {
                "code": "56400"
            },
            {
                "code": "7245"
            },
            {
                "code": "V1588"
            }
        ],
        "provider": {
            "name": "No Information Available"
        }
    },
    {
        "payer": [
            "medicare"
        ],
        "number": "1234567890123",
        "lines": [
            {
                "line": "1",
                "start_date": {
                    "date": "2012-12-01T00:00:00Z",
                    "precision": "day"
                },
                "end_date": {
                    "date": "2012-12-01T00:00:00Z",
                    "precision": "day"
                },
                "procedure": {
                    "code": "98941",
                    "description": "Chiropractic Manipulative Treatment, 3 To 4 Spinal Regions"
                },
                "quantity": 1,
                "modifier": [
                    {
                        "code": "98941",
                        "description": "Chiropractic Manipulative Treatment, 3 To 4 Spinal Regions"
                    }
                ],
                "charges": {
                    "price_billed": "* Not Available *",
                    "insurance_paid": "* Not Available *"
                },
                "place": {
                    "code": "11",
                    "name": "Office"
                },
                "type": {
                    "code": "1",
                    "name": "Medical Care"
                },
                "rendering_provider": {
                    "number": "123456",
                    "npi": "123456789"
                }
            },
            {
                "line": "2",
                "start_date": {
                    "date": "2012-12-01T00:00:00Z",
                    "precision": "day"
                },
                "end_date": {
                    "date": "2012-12-01T00:00:00Z",
                    "precision": "day"
                },
                "procedure": {
                    "code": "G0283",
                    "description": "Electrical Stimulation (Unattended), To One Or More Areas For Indication(S) Other Than Wound"
                },
                "quantity": 1,
                "modifier": [
                    {
                        "code": "G0283",
                        "description": "Electrical Stimulation (Unattended), To One Or More Areas For Indication(S) Other Than Wound"
                    }
                ],
                "charges": {
                    "price_billed": "* Not Available *",
                    "insurance_paid": "* Not Available *"
                },
                "place": {
                    "code": "11",
                    "name": "Office"
                },
                "type": {
                    "code": "1",
                    "name": "Medical Care"
                },
                "rendering_provider": {
                    "number": "123456",
                    "npi": "123456789"
                }
            }
        ]
    },
    {
        "payer": [
            "medicare"
        ],
        "number": "123456789012",
        "type": [
            "medicare Part D"
        ],
        "provider": {
            "name": "123456789"
        },
        "claimLines": {
            "drug": {
                "code": "00093013505",
                "name": "CARVEDILOL"
            },
            "provider": {
                "provider_id": "123456789",
                "provider_name": "PHARMACY2 #00000"
            },
            "proscriber": {
                "code": "123456789",
                "name": "Jane Doe"
            }
        }
    },
    {
        "payer": [
            "medicare"
        ],
        "number": "123456789011",
        "type": [
            "medicare Part D"
        ],
        "provider": {
            "name": "1234567890"
        },
        "claimLines": {
            "drug": {
                "code": "00781223310",
                "name": "OMEPRAZOLE"
            },
            "provider": {
                "provider_id": "1234567890",
                "provider_name": "PHARMACY3 #00000"
            },
            "proscriber": {
                "code": "123456789",
                "name": "Jane Doe"
            }
        }
    }
]
```

##Original CMS snippet
``` text


--------------------------------
Claim Summary

--------------------------------

Source: MyMedicare.gov



Claim Number: 1234567890000

Provider: No Information Available 
Provider Billing Address:    

Service Start Date: 10/18/2012

Service End Date: 

Amount Charged: $60.00

Medicare Approved: $34.00

Provider Paid: $27.20

You May be Billed: $6.80

Claim Type: PartB

Diagnosis Code 1: 3534
Diagnosis Code 2: 7393
Diagnosis Code 3: 7392
Diagnosis Code 4: 3533 

--------------------------------
Claim Lines for Claim Number: 1234567890000

--------------------------------



Line number:  1

Date of Service From:  10/18/2012

Date of Service To:  10/18/2012

Procedure Code/Description:  98941 - Chiropractic Manipulative Treatment (Cmt); Spinal, Three To Four Regions

Modifier 1/Description:  AT - Acute Treatment (This Modifier Should Be Used When Reporting Service 98940, 98941, 98942)

Modifier 2/Description:  

Modifier 3/Description:  

Modifier 4/Description:  

Quantity Billed/Units:  1

Submitted Amount/Charges:  $60.00

Allowed Amount:  $34.00

Non-Covered:  $26.00

Place of Service/Description:  11 - Office

Type of Service/Description:  1 - Medical Care

Rendering Provider No:  0000001

Rendering Provider NPI:  123456789



--------------------------------



--------------------------------



Claim Number: 12345678900000VAA

Provider: No Information Available
 
Provider Billing Address:    

Service Start Date: 09/22/2012

Service End Date: 

Amount Charged: $504.80

Medicare Approved: $504.80

Provider Paid: $126.31

You May be Billed: $38.84

Claim Type: Outpatient

Diagnosis Code 1: 56400
Diagnosis Code 2: 7245
Diagnosis Code 3: V1588

--------------------------------
Claim Lines for Claim Number: 12345678900000VAA

--------------------------------



Line number:  1

Date of Service From:  09/22/2012

Revenue Code/Description: 0250 - General Classification PHARMACY

Procedure Code/Description:  

Modifier 1/Description:  

Modifier 2/Description:  

Modifier 3/Description:  

Modifier 4/Description:  

Quantity Billed/Units:  1

Submitted Amount/Charges:  $14.30

Allowed Amount:  $14.30

Non-Covered:  $0.00



Line number:  2

Date of Service From:  09/22/2012

Revenue Code/Description: 0320 - General Classification DX X-RAY

Procedure Code/Description:  74020 - Radiologic Examination, Abdomen; Complete, Including Decubitus And/Or Erect Views

Modifier 1/Description:  

Modifier 2/Description:  

Modifier 3/Description:  

Modifier 4/Description:  

Quantity Billed/Units:  1

Submitted Amount/Charges:  $175.50

Allowed Amount:  $175.50

Non-Covered:  $0.00



Line number:  3

Date of Service From:  09/22/2012

Revenue Code/Description: 0450 - General Classification EMERG ROOM

Procedure Code/Description:  99283 - Emergency Department Visit For The Evaluation And Management Of A Patient, Which Requires Th

Modifier 1/Description:  25 - Significant, Separately Identifiable Evaluation And Management Service By The Same Physician On

Modifier 2/Description:  

Modifier 3/Description:  

Modifier 4/Description:  

Quantity Billed/Units:  1

Submitted Amount/Charges:  $315.00

Allowed Amount:  $315.00

Non-Covered:  $0.00



Line number:  4

Date of Service From:  

Revenue Code/Description: 0001 - Total Charges

Procedure Code/Description:  

Modifier 1/Description:  

Modifier 2/Description:  

Modifier 3/Description:  

Modifier 4/Description:  

Quantity Billed/Units:  0

Submitted Amount/Charges:  $504.80

Allowed Amount:  $504.80

Non-Covered:  $0.00

Claim Number: 1234567890123

Provider: No Information Available

Provider Billing Address:    

Service Start Date: 12/01/2012

Service End Date: 

Amount Charged: * Not Available *

Medicare Approved: * Not Available *

Provider Paid: * Not Available *

You May be Billed: * Not Available *

Claim Type: PartB

Diagnosis Code 1: 7392
Diagnosis Code 2: 7241
Diagnosis Code 3: 7393
Diagnosis Code 4: 7391

--------------------------------
Claim Lines for Claim Number: 1234567890123

--------------------------------



Line number:  1

Date of Service From:  12/01/2012

Date of Service To:  12/01/2012

Procedure Code/Description:  98941 - Chiropractic Manipulative Treatment, 3 To 4 Spinal Regions

Modifier 1/Description:  GA - Waiver Of Liability Statement Issued As Required By Payer Policy, Individual Case

Modifier 2/Description:  

Modifier 3/Description:  

Modifier 4/Description:  

Quantity Billed/Units:  1

Submitted Amount/Charges:  * Not Available *

Allowed Amount:  * Not Available *

Non-Covered:  * Not Available *

Place of Service/Description:  11 - Office

Type of Service/Description:  1 - Medical Care

Rendering Provider No:  123456

Rendering Provider NPI:  123456789



Line number:  2

Date of Service From:  12/01/2012

Date of Service To:  12/01/2012

Procedure Code/Description:  G0283 - Electrical Stimulation (Unattended), To One Or More Areas For Indication(S) Other Than Wound

Modifier 1/Description:  GY - Item Or Service Statutorily Excluded, Does Not Meet The Definition Of Any Medicare Benefit Or,

Modifier 2/Description:  

Modifier 3/Description:  

Modifier 4/Description:  

Quantity Billed/Units:  1

Submitted Amount/Charges:  * Not Available *

Allowed Amount:  * Not Available *

Non-Covered:  * Not Available *

Place of Service/Description:  11 - Office

Type of Service/Description:  1 - Medical Care

Rendering Provider No:  123456

Rendering Provider NPI:  123456789



--------------------------------
Claim Lines for Claim Number: 123456789012

--------------------------------



Claim Type: Part D

Claim Number: 123456789012

Claim Service Date: 11/17/2011

Pharmacy / Service Provider: 123456789

Pharmacy Name: PHARMACY2 #00000

Drug Code: 00093013505

Drug Name: CARVEDILOL

Fill Number: 0

Days' Supply: 30

Prescriber Identifer: 123456789

Prescriber Name: Jane Doe



--------------------------------
Claim Lines for Claim Number: 123456789011

--------------------------------



Claim Type: Part D

Claim Number: 123456789011

Claim Service Date: 11/23/2011

Pharmacy / Service Provider: 1234567890

Pharmacy Name: PHARMACY3 #00000

Drug Code: 00781223310

Drug Name: OMEPRAZOLE

Fill Number: 4

Days' Supply: 30

Prescriber Identifer: 123456789

Prescriber Name: Jane Doe



--------------------------------



```