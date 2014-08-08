/*This code was was used to extract information for better address parsing, and is currently
not needed for running the parser, but maybe needed later with mods when we get better address data */

var fs = require("fs");
/*
var data = fs.readFileSync("addressEndings.txt").toString();

data = data.split('\n');

//console.log(JSON.stringify(data, null, 4));

var obj = {};
for (var entryKey in data) {
    var newStr = data[entryKey].replace(/\\/g, '');
    newStr = data[entryKey].replace(/"/g, '');
    var newStrArr = newStr.split(" ");
    if (newStrArr.length > 2) {
        obj[newStrArr[0]] = newStrArr[1];
    }
}
*/

//fs.writeFileSync('endingObj.txt', JSON.stringify(obj, null, 4));

//var ss = fs.readFileSync("secondarySuffix.txt").toString();
//ss = ss.split('\n');

//var ssObj = {};
//for (var x = 0; x < ss.length; x++) {
//    if (ss[x] == ss[x].toUpperCase()) {
//        ss[x] = ss[x].replace(/\*/g, '');
//        ssObj[ss[x]] = ss[x - 1];
//    }
//}

//fs.writeFileSync('secondaryUnit.txt', JSON.stringify(ssObj, null, 4));

var ziptotals = fs.readFileSync("ziptotals.txt").toString();
ziptotals = ziptotals.split('\n');

//console.log(JSON.stringify(ziptotals, null, 4));
//console.log(JSON.stringify(ss, null, 4));

var zips = {};
var cities = {};

for (var key in ziptotals) {

    var arr = ziptotals[key];

    var regExp = /"[0-9]{5}",".+?"/g;
    var matchResult = arr.match(regExp);
    if (matchResult !== null) {
        var purifiedString = matchResult[0].replace(/\"/g, '');
        var zipCityStateArr = purifiedString.split(',');

        var zip = zipCityStateArr[0].trim();
        var city = zipCityStateArr[1].trim();
        if (zipCityStateArr[2]) {
            var state = zipCityStateArr[2].trim();
        } else { //zip is unclassified
            state = city;
        }

        zips[zip] = [city, state];
        cities[city] = [zip, state];
    }
}

//console.log(zips);
//JSON.stringify(zips, null, 4);
//fs.writeFile('allZips.txt', JSON.stringify(zips, null, 4);
fs.writeFile('allZips.txt', JSON.stringify(zips, null, 4), function (err) {
    if (err) throw err;
    console.log('zips are saved!');
});

fs.writeFile('allCities.txt', JSON.stringify(cities, null, 4), function (err) {
    if (err) throw err;
    console.log('states are saved!');
});

//fs.writeFileSync('allZips.txt', JSON.stringify(zips, null, 4));
//fs.writeFileSync('allCities.txt', JSON.stringify(cities, null, 4));

var cityAndState = [ziptotals[key][1], ziptotals[key][2]];
zips[arr[0]] = cityAndState;

//console.log(zips);

// result = // {“data”:“JSON model compliant data here…”, “meta”:{“version”:“1.0.0”,“type”:“CCDA”, … some other metadata}}
