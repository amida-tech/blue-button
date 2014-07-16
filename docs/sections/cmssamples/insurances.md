#Insurances Section

Data model description - [Insurances](../insurances.md)

##JSON model sample

```javascript
[
    {
        "plan_id": "H9999/9999",
        "name": "HealthCare Payer",
        "type": [
            "medicare",
            "A Medicare Plan Plus (HMO)",
            "3 - Coordinated Care Plan (HMO, PPO, PSO, SNP)"
        ]
    },
    {
        "plan_id": "S9999/000",
        "name": "Another HealthCare Payer",
        "type": [
            "medicare",
            "A Medicare Rx Plan (PDP)",
            "11 - Medicare Prescription Drug Plan"
        ]
    },
    {
        "name": "STATE HEALTH BENEFITS PROGRAM",
        "type": [
            "employer subsidy"
        ],
        "date": [
            {
                "date": "2011-01-01T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "2011-12-31T00:00:00Z",
                "precision": "day"
            }
        ]
    },
    {
        "type": "medicare msp:End stage Renal Disease (ESRD)",
        "policy_number": "1234567890",
        "payer_name": "Insurer1",
        "date": [
            {
                "date": "2011-01-01T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "2011-09-30T00:00:00Z",
                "precision": "day"
            }
        ],
        "addresses": [
            {
                "use": "primary",
                "streetLines": [
                    "PO BOX 0000"
                ],
                "city": "Anytown",
                "state": "CO",
                "zip": "00002-0000",
                "country": "United States"
            }
        ]
    },
    {
        "type": "medicare msp:End stage Renal Disease (ESRD)",
        "policy_number": "12345678901",
        "payer_name": "Insurer2",
        "date": [
            {
                "date": "2010-01-01T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "2010-12-31T00:00:00Z",
                "precision": "day"
            }
        ],
        "addresses": [
            {
                "use": "primary",
                "streetLines": [
                    "0000 Any ROAD"
                ],
                "city": "ANYWHERE",
                "state": "VA",
                "zip": "00000-0000",
                "country": "United States"
            }
        ]
    },
    {
        "type": "medicare msp",
        "policy_number": "00001",
        "payer_name": "Insurer",
        "date": [
            {
                "date": "1984-10-01T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "2008-11-30T00:00:00Z",
                "precision": "day"
            }
        ],
        "addresses": [
            {
                "use": "primary",
                "streetLines": [
                    "00 Address STREET"
                ],
                "city": "ANYWHERE",
                "state": "PA",
                "zip": "00000",
                "country": "United States"
            }
        ]
    }
]
```

##Original CMS snippet

```text
--------------------------------
Plans

--------------------------------

Source: MyMedicare.gov



Contract ID/Plan ID: H9999/9999

Plan Period: 09/01/2011 - current

Plan Name: A Medicare Plan Plus (HMO)

Marketing Name: HealthCare Payer

Plan Address: 123 Any Road Anytown PA 00003

Plan Type: 3 - Coordinated Care Plan (HMO, PPO, PSO, SNP)



Contract ID/Plan ID: S9999/000

Plan Period: 01/01/2010 - current

Plan Name: A Medicare Rx Plan (PDP)

Marketing Name: Another HealthCare Payer

Plan Address: 123 Any Road Anytown PA 00003

Plan Type: 11 - Medicare Prescription Drug Plan



--------------------------------
Employer Subsidy

--------------------------------

Source: MyMedicare.gov


Employer Plan: STATE HEALTH BENEFITS PROGRAM

Employer Subsidy Start Date: 01/01/2011

Employer Subsidy End Date: 12/31/2011


--------------------------------
Primary Insurance

--------------------------------

Source: MyMedicare.gov



MSP Type: End stage Renal Disease (ESRD)

Policy Number: 1234567890

Insurer Name: Insurer1

Insurer Address: PO BOX 0000 Anytown, CO 00002-0000

Effective Date: 01/01/2011

Termination Date: 09/30/2011



MSP Type: End stage Renal Disease (ESRD)

Policy Number: 12345678901

Insurer Name: Insurer2

Insurer Address: 0000 Any ROAD ANYWHERE, VA 00000-0000

Effective Date: 01/01/2010

Termination Date: 12/31/2010



--------------------------------
Other Insurance

--------------------------------

Source: MyMedicare.gov



MSP Type: 

Policy Number: 00001

Insurer Name: Insurer

Insurer Address: 00 Address STREET ANYWHERE, PA 00000

Effective Date: 10/01/1984

Termination Date: 11/30/2008



```