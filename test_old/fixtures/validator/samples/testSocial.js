var testSocial = {
    "regular": {
        "smoking_statuses": [{
            "value": "Former smoker",
            "date_time": {
                "low": {
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                },
                "high": {
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }
            }
        }]
    },
    "noSmokingValue": {
        "smoking_statuses": [{
            "date_time": {
                "low": {
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                },
                "high": {
                    "date": "1999-11-14T00:00:00Z",
                    "precision": "day"
                }
            }
        }]
    },
    "emptySmokingDate": {
        "smoking_statuses": [{
            "value": "Former smoker",
            "date_time": []
        }]
    },
    "noSmokingDate": {
        "smoking_statuses": [{
            "value": "Former smoker"
        }]
    }
};
module.exports = testSocial;
