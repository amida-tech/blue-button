//Byung Joo Shin, Amida Tech


parseCMS('sample2.txt');

function parseCMS(filename)
{


//Reading in the file
var fs = require('fs');
var rawData = fs.readFileSync(filename).toString();

//might need to convert input ASCII, or have actual strings in the c
//code be converted to utf8 later

var documentObj = {};
var sectionArray = separateSections(rawData);

/*Could make this part asynchoronous or parallelize it instead of
doing it sequentially
*/
for (var section in sectionArray){
  var sectionObj = convertToObject(sectionArray[section]);

}


}






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







function convertToObject(sectionString){

  //get the section name, by regular expression match
  //console.log(JSON.stringify(sectionString));
  var sectionTitleRegExp = /(-){9,}([\S\s]+?)(-){9,}/;
  var sectionRawTitle = sectionString.match(sectionTitleRegExp)[0];
  cleanUpTitle(sectionRawTitle);



  /*get each section line, using \n\n and \n\n look ahead and look
  behind */



}

//cleans up the title string obtained from the regular expression
function cleanUpTitle(rawTitleString){
  /*dashChar is most commonly the dash of the title string, or a
  the first repeating character surrounding the title */
  var dashChar = rawTitleString.charAt(0);
  //beginning and ending index of the dash
  var dashBegIndex = 0;
  var dashEndIndex = rawTitleString.lastIndexOf(dashChar);

  while(rawTitleString.charAt(dashBegIndex) == (dashChar || '\\n') ){
    dashBegIndex++;
  }
  while(rawTitleString.charAt(dashEndIndex) == (dashChar || '\\n') ){
    dashEndIndex--;
  }


  var titleString = rawTitleString.slice(dashBegIndex+1, dashEndIndex-1);
  console.log(JSON.stringify(titleString));
  return titleString;





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
