//Byung Joo Shin, Amida Tech


var object = {};
//Reading in the file
var fs = require('fs');
var rawData = fs.readFileSync("sample2.txt").toString();

//might need to convert input ASCII, or have actual strings in the c
//code be converted to utf8 later

var testIndex = rawData.indexOf('Demographic');
console.log(testIndex);

var sectionArray = separateSections(rawData);
console.log(sectionArray);

convertToObject(rawData);
//console.log(rawData);
//console.log(typeof data);
//console.log(data);
//console.log(data.indexOf("JANE"));

function isASCII(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

//Parses string into sections, then returns the array of strings for
//each section
function separateSections(data){

  //Separated match into three pieces
  var headerMatchCode = '(-){9,}[\\S\\s]+?(\\n){2,}(-){9,}';
  var bodyMatchCode = '[\\S\\s]+?';
  var endMatchCode = '(?=((-){9,}))';
  var totalMatchCode = headerMatchCode + bodyMatchCode + endMatchCode;

  /* the regular expression for entire sections, search globally and
  ignore capitalization */
  var totalRegExp = new RegExp(totalMatchCode, 'gi');
  var matchArray = data.match(totalRegExp);
  return matchArray;
}







function convertToObject(data){

  /*I've divided it into three separate regular expressions that will match the
  header, body, and the end
  */
  var headerMatchCode = '(-){9,}[\\S\\s]+?(\\n){2,}(-){9,}';
  var bodyMatchCode = '[\\S\\s]+?';
  var endMatchCode = '(?=((-){9,}))';
  var totalMatchCode = headerMatchCode + bodyMatchCode + endMatchCode;

  /* the regular expression for entire sections, search globally and
  ignore capitalization */
  var totalRegExp = new RegExp(totalMatchCode, 'gi');

console.log(totalRegExp);


  //this code matches all sections - it's what I had originally
	var sectionMatchCode= /(-){9,}[\S\s]+?(-){9,}[\S\s]+?(-){9,}/gi;
  console.log(sectionMatchCode);
  //var bodyMatchCode =
  //this obtains the section header for the code


	var matches = data.match(totalRegExp);
	console.log(matches);
  console.log(matches.length)


	//get the different sections via regular expressions



}



//console.log(isASCII(rawData));

//console.log(rawData);
//console.log(JSON.stringify(rawData));





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
