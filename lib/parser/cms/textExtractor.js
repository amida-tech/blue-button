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

for(var key in ziptotals){

    var arr = ziptotals[key];
    console.log(arr);
    var cityAndState = [ziptotals[key][1], ziptotals[key][2]];
    zips[arr[0]] = cityAndState;
}

//console.log(zips);




// result = // {“data”:“JSON model compliant data here…”, “meta”:{“version”:“1.0.0”,“type”:“CCDA”, … some other metadata}}
