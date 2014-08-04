#Problems Section

Data model description - [Problems](../problems.md)

##JSON model sample

```javascript
[
    {
        "problem": {
            "name": "Arthritis"
        },
        "date": [
            {
                "date": "2005-08-09T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "2011-02-28T00:00:00Z",
                "precision": "day"
            }
        ]
    },
    {
        "problem": {
            "name": "Asthma"
        },
        "date": [
            {
                "date": "2008-01-25T00:00:00Z",
                "precision": "day"
            },
            {
                "date": "2010-01-25T00:00:00Z",
                "precision": "day"
            }
        ]
    }
]
```

##Original CMS snippet

```text
--------------------------------
Self Reported Medical Conditions

--------------------------------

Source: Self-Entered



Condition Name: Arthritis

Medical Condition Start Date: 08/09/2005

Medical Condition End Date: 02/28/2011



Condition Name: Asthma

Medical Condition Start Date: 01/25/2008

Medical Condition End Date: 01/25/2010





```