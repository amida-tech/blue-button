#Immunizations Section

Data model description - [Immunizations](../immunizations.md)

##JSON model sample

```javascript
[
    {
        "status": "complete",
        "administration": {
            "route": {
                "name": "Nasal Spray(mist)"
            }
        },
        "product": {
            "product": {
                "name": "Varicella/Chicken Pox"
            }
        },
        "date": [
            {
                "date": "2002-04-21T00:00:00Z",
                "precision": "day"
            }
        ]
    },
    {
        "status": "complete",
        "administration": {
            "route": {
                "name": "Nasal Spray(mist)"
            }
        },
        "product": {
            "product": {
                "name": "Varicella/Chicken Pox (booster 1)"
            }
        },
        "date": [
            {
                "date": "1990-02-02T00:00:00Z",
                "precision": "day"
            }
        ]
    },
    {
        "status": "complete",
        "administration": {
            "route": {
                "name": "Injection"
            }
        },
        "product": {
            "product": {
                "name": "typhoid"
            }
        },
        "date": [
            {
                "date": "2009-01-02T00:00:00Z",
                "precision": "day"
            }
        ]
    }
]
```

##Original CMS snippet

```text
--------------------------------
Self Reported Immunizations

--------------------------------

Source: Self-Entered



Immunization Name: Varicella/Chicken Pox

Date Administered:04/21/2002

Method: Nasal Spray(mist)

Were you vaccinated in the US: 

Comments: congestion

Booster 1 Date: 02/02/1990

Booster 2 Date: 

Booster 3 Date: 



Immunization Name: typhoid

Date Administered:01/02/2009

Method: Injection

Were you vaccinated in the US: 

Comments: 

Booster 1 Date: 

Booster 2 Date: 

Booster 3 Date: 








```