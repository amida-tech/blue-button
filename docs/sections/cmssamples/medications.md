#Medications Section

Data model description - [Medications](../medications.md)

##JSON model sample

```javascript
[
    {
        "product": {
            "product": {
                "name": "Aspirin"
            },
            "unencoded_name": "Aspirin"
        },
        "sig": "aspirin",
        "status": "Completed"
    },
    {
        "date": [
            {
                "date": "1949-09-28T00:00:00Z",
                "precision": "day"
            }
        ],
        "product": {
            "product": {
                "name": "Erythromycin"
            },
            "unencoded_name": "Erythromycin"
        },
        "sig": "erythromycin",
        "status": "Completed"
    }
]
```

##Original CMS snippet

```text
--------------------------------
Drugs

--------------------------------

Source: Self-Entered



Drug Name: Aspirin

Supply: Daily

Orig Drug Entry: Aspirin

--------------------------------
Self Reported Allergies

--------------------------------

Source: Self-Entered



Allergy Name: Antibotic

Type: Drugs

Reaction: Vomiting

Severity: Severe

Diagnosed: Yes

Treatment: Allergy Shots

First Episode Date: 01/08/1926

Last Episode Date: 03/13/1955

Last Treatment Date: 09/28/1949

Comments: Erythromycin 



Allergy Name: Grasses

Type: Environmental

Reaction: Sneezing

Severity: Severe

Diagnosed: Yes

Treatment: Avoidance

First Episode Date: 05/13/1973

Last Episode Date: 07/20/1996

Last Treatment Date: 09/27/2008

Comments: 




```