"use strict";

var fs = require("fs");

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
console.log(obj);

fs.writeFileSync('endingObj.txt', JSON.stringify(obj));

var secondarySuffix = fs.readFileSync("secondarySuffix.txt").toString();

// result = // {“data”:“JSON model compliant data here…”, “meta”:{“version”:“1.0.0”,“type”:“CCDA”, … some other metadata}}
