#Vital Signs Section

Data model description - [Vital Signs](../vitals.md)

##JSON model sample

```javascript
[
    {
        "vital": {
            "name": "Blood Pressure"
        },
        "date": [
            {
                "date": "2011-07-22T15:00:00Z",
                "precision": "hour"
            }
        ],
        "value": 120,
        "unit": "mm[Hg]",
        "status": "completed"
    },
    {
        "vital": {
            "name": "Blood Pressure"
        },
        "date": [
            {
                "date": "2011-07-22T15:00:00Z",
                "precision": "hour"
            }
        ],
        "value": 80,
        "unit": "mm[Hg]",
        "status": "completed"
    },
    {
        "vital": {
            "name": "Glucose"
        },
        "date": [
            {
                "date": "2012-03-20T12:00:00Z",
                "precision": "hour"
            }
        ],
        "value": 110,
        "unit": "mg/dL",
        "status": "completed"
    }
]
```

##Original CMS snippet

```text

--------------------------------
Self Reported Vital Statistics

--------------------------------

Source: Self-Entered



Vital Statistic Type: Blood Pressure

Date: 07/22/2011

Time: 3:00 PM

Reading: 120/80

Comments: 



Vital Statistic Type: Glucose

Date: 03/20/2012

Time: 12:00 PM

Reading: 110

Comments: 





```