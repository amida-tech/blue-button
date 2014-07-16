#Results Section

Data model description - [Results](../results.md)

##JSON model sample

```javascript
[
    {
        "result_set": {
            "name": "Glucose Level"
        },
        "results": [
            {
                "date": {
                    "date": "2008-03-21T00:00:00Z",
                    "precision": "day"
                },
                "name": "FBS",
                "value": "135",
                "unit": "mg/dL"
            },
            {
                "date": {
                    "date": "2008-03-21T00:00:00Z",
                    "precision": "day"
                },
                "name": "RBS",
                "value": "170",
                "unit": "mg/dL"
            },
            {
                "date": {
                    "date": "2008-03-21T00:00:00Z",
                    "precision": "day"
                },
                "name": "RBS",
                "value": "150",
                "unit": "mg/dL"
            },
            {
                "date": {
                    "date": "2008-03-21T00:00:00Z",
                    "precision": "day"
                },
                "name": "RBS",
                "value": "120",
                "unit": "mg/dL"
            }
        ]
    }
]
```

##Original CMS snippet

``` text
--------------------------------
Self Reported Labs and Tests

--------------------------------

Source: Self-Entered



Test/Lab Type: Glucose Level
Date Taken: 03/21/2008

Administered by: AnyLab

Requesting Doctor: Dr. Smith

Reason Test/Lab Requested: Ongoing elevated glucose

Results: 135, 170, 150, 120

Comments: Fasting, hour 1, hour 2, hour 3

```