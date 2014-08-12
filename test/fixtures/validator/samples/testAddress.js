var testAddress = {
    "regular": {
        "street_lines": [
            "1357 Amber Drive"
        ],
        "city": "Beaverton",
        "state": "OR",
        "zip": "97867",
        "country": "US",
        "use": "primary home"
    },
    "missingAddr": {
        "street_lines": [],
        "city": "Beaverton",
        "state": "OR",
        "zip": "97867",
        "country": "US",
        "use": "primary home"
    },
    "noCity": {
        "street_lines": [],
        "state": "OR",
        "zip": "97867",
        "country": "US",
        "use": "primary home"
    },
    "noCityAddr": {
        "street_lines": [],
        "state": "OR",
        "zip": "97867",
        "country": "US",
        "use": "primary home"
    },
    "empty": {},

    "onlyCityAddr": {
        "street_lines": [
            "1357 Amber Drive"
        ],
        "city": "Beaverton"
    }
};
module.exports = testAddress;
