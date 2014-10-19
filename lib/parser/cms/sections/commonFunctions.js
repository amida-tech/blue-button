//these are common models that must be hardcoded...
//might want to modify later so that HERE it also takes in custom default values.

//later on, this functions might become MUCH more complicated, because
//cities are not necessarily one word entries

var zipDict = require('./addressRefs/zips');
var unitDesignators = require('./addressRefs/suffixes').unitDesignators;
var streetSuffix = require('./addressRefs/suffixes').streetSuffix;

var commonFunctions = function commonFunctions() {
    functions = {
        'cda_name': cda_name,
        'cda_concept': cda_concept,
        'cda_id': cda_id,
        'cda_date': cda_date,
        'cda_coded_entry': cda_coded_entry,
        'cda_phone': cda_phone,
        'cda_email': cda_email,
        'cda_line_address': cda_line_address,
        'cda_physical_quantity': cda_physical_quantity,
        'currency': formatCurrency,
        'ignore': ignoreValue
    };
    this.writeValue = writeValue;
    this.getFunction = getFunction;
    this.getValueType = getValueType;
};

///needs to be refactored later

function cda_line_address(addressString) {
    var addressObj = {
        "use": "primary home",
        "street_lines": [],
        "city": "",
        "state": "",
        "zip": "",
        "country": "United States" //assume U.S. for now
    };
    var addressArray = addressString.trim().split(',');
    var uppCaseAdrStr = addressString.toUpperCase();
    if (addressArray.length === 1) {
        var tempArr = addressArray[0].split(' ');
        //this goes from best method to worse
        var foundWord;

        //check if you can see a number from the last index, which means that's it's likely to be a p.o. box or an address

        // 1. Obtain address from zip code.
        /*
         Also need to consider time complexity here, Notice that it maybe doing
        a retrieval from a rather big object. I think it's okay since documentation
        says that it's better than hashing, which is constant time lookup. May need
        beter method later */

        var fiveDigitZip = tempArr[tempArr.length - 1].substring(0, 5);
        if (fiveDigitZip in zipDict && !isNaN(fiveDigitZip)) {
            var foundCity = zipDict[fiveDigitZip][0].trim();
            var foundCityArr = foundCity.split(' ');
            var foundCityMatch = '';
            var foundCityIndex = -1;
            for (var x = 0; x < foundCityArr.length; x++) {
                var tempCityIndex = addressString.toUpperCase().indexOf(foundCityArr[x]);
                if (tempCityIndex > 0) {
                    if (foundCityIndex == -1) {
                        foundCityIndex = tempCityIndex;
                    }
                    foundCityMatch += foundCityArr[x] + ' ';
                }
            }
            foundCityMatch = foundCityMatch.substring(0, foundCityMatch.length - 1);
            if (foundCityIndex >= 1) {
                var addressLine = addressString.substring(0, foundCityIndex - 1).trim();
                addressObj.street_lines.push(addressLine);
                /*TODO: foundCIty, which is the city name obtained from looking up the
                zip code table, needs to do something like an longest common substring match
                in case there isn't a 1 to 1 match between the city names of the raw string
                and foundCity. For now I'm just going to take the field in the dictionary. However,
                the more correct approach would be running Ukkonen's algorithm for suffix trees
                to find the longest common substring between the raw string and the value from
                lookup. If the lcs algorithm is implemented correctly it should give O(m+n) time. */
                addressObj.city = foundCityMatch.trim();
                addressObj.zip = tempArr[tempArr.length - 1].trim();
                addressObj.state = tempArr[tempArr.length - 2].trim();
                return addressObj;
            }
        }
        //2. try out commonly found suffixes
        for (var x = tempArr.length - 1; x > 0; x--) {
            var word = tempArr[x].toUpperCase();
            if (word in streetSuffix) {
                streetFound = true;
                foundWord = tempArr[x];
                var cityBegIndex = addressString.indexOf(foundWord);
                var cityEndIndex = cityBegIndex + foundWord.length;
                var addressLine = addressString.substring(0, cityEndIndex).trim();
                addressObj.street_lines.push(addressLine);

                //These might not always be the last and second to last, what if there's just state code? need to make changes forthat later.
                addressObj.zip = tempArr[tempArr.length - 1].trim();
                addressObj.state = tempArr[tempArr.length - 2].trim();
                //get city name
                var zipIndex = addressString.indexOf(addressObj.zip);
                var stateIndex = addressString.indexOf(addressObj.state);

                addressObj.city = addressString.substring(cityEndIndex, stateIndex).trim();
                return addressObj;
            }
        }

        for (var x = tempArr.length - 1; x > 0; x--) {
            var word = tempArr[x].toUpperCase();
            if (word in unitDesignators) {
                streetFound = true;
                foundWord = tempArr[x];
                var cityBegIndex = addressString.indexOf(foundWord);
                var cityEndIndex = cityBegIndex + foundWord.length;
                var addressLine = addressString.substring(cityBegIndex, cityEndIndex).trim();
                addressObj.street_lines.push(addressLine);

                //These might not always be the last and second to last
                addressObj.zip = tempArr[tempArr.length - 1].trim();
                addressObj.state = tempArr[tempArr.length - 2].trim();
                //get city name
                var zipIndex = addressString.indexOf(addressObj.zip);

                addressObj.city = addressString.substring(cityEndIndex, zipIndex).trim();
                return addressObj;
            }
        }

        return null;
    }

    /*case when there is only one comma, right after the city , ie. 1111 Address Dr Hoosville, VA 11111*/
    else if (addressArray.length === 2) {
        var streetAndCity = addressArray[0].trim();
        var stateAndZip = addressArray[1].trim();

        var test = false;
        var streetFound = false;
        var street;
        var city;

        //try to figure out street and city, going for fastest computation to slowest

        var streetArray = streetAndCity.split(" ");

        /*the whole point of this code is to find the point where we need to split the
        string */

        //find longest worded us city

        //this is the default breaking point
        var breakPoint = streetAndCity.lastIndexOf(' ');
        var foundWord;

        //check if you can see a number from the last index, which means that's it's likely to be a p.o. box or an address

        //First, check if the beginning token is a word if it's a word, then it's likely to be a PO box
        if (isNaN(streetArray[0])) {
            for (var x = streetArray.length; x > 0; x--) {
                /* NOTE: the > 0 IS NOT A MISTAKE! Address lines usually start with a number so we don't want the loop
                to go all the way through */
                if (!isNaN(streetArray[x])) { //so it is a number
                    streetFound = true;
                    foundWord = streetArray[x];
                    breakPoint = streetAndCity.indexOf(foundWord) + foundWord.length;
                    //console.log(streetAndCity.substring(0, breakPoint));
                }

            }
        }
        //means that we do start with a street number, and need to look for a common suffix
        else {

            /*The stop index is where looping should stop in an address. The reason why
            5 is used is because the longest worded city is 5 words long. */
            //loop only to the 2nd to last word, i.e. 7777 blah blah STOP city, ST 99999
            if (!streetFound) {
                for (var x = 0; x < streetArray.length - 1; x++) {
                    var word = streetArray[x].toUpperCase();
                    if (word in streetSuffix) {
                        streetFound = true;
                        foundWord = streetArray[x];
                        breakPoint = streetAndCity.indexOf(foundWord) + foundWord.length;
                        break;
                    }
                }
            }

            //go through the string and look up usps C2 suffix address, unit designators
            if (!streetFound) {

                for (var x = 0; x > streetArray.length; x++) {
                    var word = streetArray[x].toUpperCase();
                    if (word in unitDesignators) {
                        streetFound = true;
                        foundWord = streetArray[x];
                        breakPoint = streetAndCity.indexOf(foundWord) + foundWord.length;
                        test = true;
                        break;
                    }
                }
            }
            //last major option, lookup the 5 letter zip code, then do a match on the address string
            //with the obtained value.
            if (!streetFound) {
                var stateAndZipArr = stateAndZip.split(' ');
                var zip = stateAndZipArr[1].trim().substring(0, 5);
                if (zip in zipDict && !isNaN(zip)) {
                    var cityRetrieved = zipDict[zip][0].trim();
                    var cityArr = cityRetrieved.split(" ");
                    var capAdrString = addressString.toUpperCase();
                    var possibleBreakPoint = -1;
                    for (var x = 0; x < cityArr.length; x++) {
                        var tempCityIndex = addressString.toUpperCase().indexOf(cityArr[x]);
                        if (tempCityIndex > 0) {
                            if (foundCityIndex == -1) {
                                foundCityIndex = tempCityIndex;
                            }

                        }
                    }
                }

            }

        }

        // this step is taken for all procedures, the above code is to find the right point to split the stirng(breakpoint)
        street = streetAndCity.substring(0, breakPoint);
        city = streetAndCity.substring(breakPoint + 1, streetAndCity.length);
        //state and zip are consistent
        stateAndZip = stateAndZip.split(' ');
        var state = stateAndZip[0];
        var zip = stateAndZip[1];
        addressObj.street_lines.push(street);
        addressObj.city = city;
        addressObj.state = state;
        addressObj.zip = zip;

        return addressObj;
    }
    /*ie. 1111 Address Dr, Hoosville, VA 11111*/
    else if (addressArray.length === 3) {
        addressObj.street_lines[0] = addressArray[0].trim();
        addressObj.city = addressArray[1].trim();
        var stateAndZip = addressArray[2].trim().split(' ');
        addressObj.state = stateAndZip[0];
        addressObj.zip = stateAndZip[1];
        return addressObj;
    }
    return null;
}

function cda_phone(numberString, type) {
    var phoneObj = {};
    phoneObj.number = numberString;
    if (arguments.length > 1) {
        phoneObj.type = type;
    } else {
        phoneObj.type = 'primary home';
    }
    return phoneObj;
}

function cda_email(emailString, type) {
    var emailObj = {};
    emailObj.address = emailString;
    if (arguments.length > 1) {
        emailObj.type = type;
    }
    return emailObj;
}

function cda_concept() {}

function cda_id(id, extension) {
    var obj = {};
    obj.identifier = id;
    if (arguments.length > 1) {
        obj.extension = extension;
    }
    return obj;
}

function cda_date(dateString, precision) {
    var dateObj;
    var date;
    var dateNum;
    if (arguments.length == 2) {
        dateObj = {};
        date = new Date(dateString);
        dateNum = date.getTime() - date.getTimezoneOffset() * 60000;
        date.setTime(dateNum);
        //TODO: don't need milliseconds precision here
        dateObj.date = date.toISOString();
        dateObj.precision = precision;
        return dateObj;
    } else {
        dateObj = {};
        date = new Date(dateString);
        dateNum = date.getTime() - date.getTimezoneOffset() * 60000;
        date.setTime(dateNum);
        dateObj.date = date.toISOString();
        if (dateObj.date.substring(dateObj.date.length - 5)) {
            dateObj.date = dateObj.date.substring(dateObj.date, dateObj.date.length - 5) + "Z";
        }
        dateObj.precision = determineDatePrecision(dateString);
        return dateObj;
    }

}

function cda_physical_quantity(value, unit) {
    var obj = {};
    obj.value = value;
    obj.unit = unit;
    return obj;
}

function determineDatePrecision(dateString) {

    //think about it when it's only a year
    var date;
    var yearMonthDay = dateString.substr(0, dateString.indexOf(' ')); // '72'
    var hourMinutes = dateString.substr(dateString.indexOf(' ') + 1);
    hourMinutes = hourMinutes.trim();
    //start from the order the hour
    //time is not defined
    if (hourMinutes !== undefined && dateString.indexOf(' ') >= 0) {
        //determine month, day, etc
        //splits to hh:mm, (A.M. or P.M.)
        date = new Date(dateString);

        var minutes = date.getMinutes();
        if (minutes > 0) {
            return 'minute';
        } else if (minutes === 0) {
            return 'hour';
        }
        return 'hour';
    } else {
        var yearMonthDayArray = dateString.split('/');
        if (yearMonthDayArray.length === 3) {
            return 'day';
        }
        if (yearMonthDayArray.length === 2) {
            return 'month';
        }
        if (yearMonthDayArray.length === 1) {
            return 'year';
        }
    }
    //if all those cases don't hold, then it's likely that it's a year.
    return 'year';
}

/* Not in use at the moment, may be useful later.
function processMoney(moneyString){

    moneyString = moneyString.trim();
    if(moneyString.indexOf('$') >=0){
        moneyString = moneyString.substring(moneyString.indexOf('$') + 1, moneyString.length);
        console.log(moneyString);
    }
    var dollarAmt = new Number(moneyString);
    console.log(dollarAmt);
    return dollarAmt;
}
*/

function cda_name(name) {
    //this needs to be edited later to include prefixes
    var cdaNameObj = {};
    var nameArray;
    //assuming that string is in last_name, first_name (middle name format)
    if (name.indexOf(",") >= 0) {
        nameArray = name.split(",");
        cdaNameObj.last = nameArray[0].trim();
        var firstAndMiddleArr = nameArray[1].trim().split(" ");

        //assuming first names can be more than one word
        var middleNameArr = [];
        cdaNameObj.first = firstAndMiddleArr[0].trim();
        for (var x = 1; x < firstAndMiddleArr.length; x++) {
            middleNameArr.push(firstAndMiddleArr[x].trim());
        }
        if (middleNameArr.length > 0) {
            cdaNameObj.middle = middleNameArr;
        }
    } else {
        nameArray = name.split(" ");
        if (nameArray.length == 2) {
            cdaNameObj.first = nameArray[0];
            cdaNameObj.last = nameArray[1];
        } else if (nameArray.length > 2) {
            cdaNameObj.first = nameArray[0];
            var middleNameArr = [];
            for (var x = 1; x < nameArray.length - 1; x++) {
                middleNameArr.push(nameArray[x]);
            }
            if (middleNameArr.length > 0) {
                cdaNameObj.middle = middleNameArr;
            }
            cdaNameObj.last = nameArray[nameArray.length - 1];
        }
    }
    return cdaNameObj;
}

function cda_coded_entry(name, code, codeSystem) {
    var cdaCodedEntry = {};

    if (typeof name === 'string' || name instanceof String) {
        if (name.length > 0) {
            cdaCodedEntry.name = name;
        }
    }
    if (typeof codeSystem === 'string' || codeSystem instanceof String) {
        if (codeSystem.length > 0) {
            cdaCodedEntry.codeSystem = codeSystem;
        }
    }
    if (typeof code === 'string' || code instanceof String) {
        if (code.length > 0) {
            cdaCodedEntry.code = code;
        }
    }

    return cdaCodedEntry;
}

function getValueType(objValue) {
    if (objValue instanceof Array) {
        return [];
    } else if (typeof (objValue) == 'string') {
        if (objValue.charAt(0) == '[') {
            return [];
        }
        if (objValue.charAt(0) == "{") {
            return {};
        }
    } else if (typeof (objValue) === 'object' && objValue instanceof Array)
        return {};
}

function writeValue(value, obj, key) {
        var objValue = obj[key];
        if (objValue instanceof Array) {
            objValue.push(value);
        } else if (typeof (objValue) == 'string') {
            obj[key] = value;
        } else if (typeof (objValue) === 'object' && objValue instanceof Array)
            obj[key] = value;
    }
    //this function ignores all not avaliable value fields

function ignoreValue(value) {
    if (value === null || value === undefined || value.length === 0) {
        return true;
    }
    if (value.length === 0) {
        return true;
    }
    if (typeof (value) === 'object') {
        return false;
    }
    value = value.toLowerCase();
    var ignoreValues = ['not available', 'no information'];
    for (var x = 0; x < ignoreValues.length; x++) {
        if (value.indexOf(ignoreValues[x]) >= 0) {
            return true;
        }
    }
    return false;
}

function getFunction(commonModelName) {
    if (commonModelName in functions) {
        if (functions[commonModelName] !== null) {
            return functions[commonModelName];
        }
    }
    return null;
}

//will be implemented later

function formatCurrency(currencyString) {}

commonFunctions.instance = null;

commonFunctions.getInstance = function () {
    if (this.instance === null) {
        this.instance = new commonFunctions();
    }
    return this.instance;
}

module.exports = commonFunctions.getInstance();
