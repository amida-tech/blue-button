var testAddress = {
  "regular":{
              "streetLines": [
                  "1357 Amber Drive"
              ],
              "city": "Beaverton",
              "state": "OR",
              "zip": "97867",
              "country": "US",
              "use": "primary home"
            },
  "missingAddr":{
              "streetLines": [
              ],
              "city": "Beaverton",
              "state": "OR",
              "zip": "97867",
              "country": "US",
              "use": "primary home"
            },
  "noCity":{
              "streetLines": [
              ],
              "state": "OR",
              "zip": "97867",
              "country": "US",
              "use": "primary home"
            },
  "noCityAddr":{
              "streetLines": [
              ],
              "state": "OR",
              "zip": "97867",
              "country": "US",
              "use": "primary home"
            },
  "empty":{ },

  "onlyCityAddr": {
              "streetLines": [
                  "1357 Amber Drive"
              ],
              "city": "Beaverton"
  }
};
module.exports = testAddress;




