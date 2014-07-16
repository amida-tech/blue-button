#Allergies Section

Data model description - [Allergies](../allergies.md)

##JSON model sample

```javascript
[
    {
        "allergen": {
            "name": "Antibotic"
        },
        "date": [
            {
                "date": "1926-01-08T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "1955-03-13T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "1949-09-28T00:00:00Z",
                "precision": "day"
            }
        ],
        "reactions": {
            "reaction": {
                "name": "Vomiting"
            },
            "severity": "Severe"
        }
    },
    {
        "allergen": {
            "name": "Grasses"
        },
        "date": [
            {
                "date": "1973-05-13T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "1996-07-20T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "2008-09-27T00:00:00Z",
                "precision": "day"
            }
        ],
        "reactions": {
            "reaction": {
                "name": "Sneezing"
            },
            "severity": "Severe"
        }
    }
]
```

##Original CMS snippet

```text

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