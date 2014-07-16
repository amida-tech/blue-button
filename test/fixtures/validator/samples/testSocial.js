var testSocial = {
    "regular": {
        "smoking_statuses": [{
            "value": "Former smoker",
            "date": [{
                "date": "2005-05-01T00:00:00Z",
                "precision": "day"
            }, {
                "date": "2009-02-27T13:00:00Z",
                "precision": "subsecond"
            }]
        }]
    },
    "noSmokingValue": {
        "smoking_statuses": [{
            "date": [{
                "date": "2005-05-01T00:00:00Z",
                "precision": "day"
            }, {
                "date": "2009-02-27T13:00:00Z",
                "precision": "subsecond"
            }]
        }]
    },
    "emptySmokingDate": {
        "smoking_statuses": [{
            "value": "Former smoker",
            "date": []
        }]
    },
    "noSmokingDate": {
        "smoking_statuses": [{
            "value": "Former smoker"
        }]
    }
};
module.exports = testSocial;
