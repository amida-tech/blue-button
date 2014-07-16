#Demographics Section

Data model description - [Demographics](../demographics.md)

##JSON Model Sample

```javascript
{
    "name": {
        "first": "JOHN",
        "last": "DOE"
    },
    "dob": [
        {
            "date": "1910-01-01T00:00:00Z",
            "precision": "day"
        }
    ],
    "email": [
        {
            "email": "JOHNDOE@example.com",
            "type": "primary"
        }
    ],
    "phone": [
        {
            "number": "123-456-7890",
            "type": "primary"
        }
    ],
    "addresses": [
        {
            "use": "primary",
            "streetLines": [
                "123 ANY ROAD"
            ],
            "city": "ANYTOWN",
            "state": "VA",
            "zip": "00001",
            "country": "United States"
        }
    ]
}
```

##Original CMS Snippet

```text

--------------------------------
Demographic

--------------------------------

Source: MyMedicare.gov



Name: JOHN DOE

Date of Birth: 01/01/1910

Address Line 1: 123 ANY ROAD

Address Line 2: 

City: ANYTOWN

State: VA

Zip: 00001

Phone Number: 123-456-7890

Email: JOHNDOE@example.com

Part A Effective Date: 01/01/2012

Part B Effective Date: 01/01/2012



```