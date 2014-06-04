
var object = {};
var fs = require('fs');

var rawData = fs.readFileSync("sample2.txt").toString();
var convertedData = new Buffer(rawData);

var testIndex = data.indexOf("ANYTOWN");
console.log(testIndex);

//console.log(typeof data);
//console.log(data);
//console.log(data.indexOf("JANE"));

function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

console.log(isASCII(data));


//console.log(JSON.stringify(data));

//Notes: 

/* I tried
	renaming source file
	switching the source file with a shorter name
	So I would think that it's something wrong with the data format 
	of the file or the method fs.readFileSync 

*/



//Everything below was me trying to get regex to work/debug, so please ignore


//var string = "blue whale";
//var parsed = JSON.parse(data);
//console.log(parsed);
//console.log(data);
//parse the data into a JS Object
/*
var testCode = new RegEXp(' [\s\S]*--------------------------------
         [\s\S]*');


var testCode2 = new RegExp('[\s\S]*[\s\S]* ');
var newlines = new RegExp("/\d/");
var test3 = /^(?!.*JOHN).*$/;
//this regular expression returns the array of all matches
/*var sectionMatchCode = new RegExp('--------------------------------*(\n)*

	\w+\n\w*--------------------------------*');

//var match = sectionMatchCode.match(data);

var re = /Another/m;

var testmatch = data.match(test3);
//console.log(testmatch);
//console.log(testmatch.length);
/*
for (var x in testmatch)
{
	console.log(testmatch[x]);
}*/
//console.log(testmatch);
//console.log(data.indexOf('VA'));
