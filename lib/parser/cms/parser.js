//Byung Joo Shin, Amida Tech



module.exports = parseCMS;

//main function that will be used to parseCMS
function parseCMS(filename){
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
    var sectionObjTitle = sectionObj['sectionTitle'];
    var sectionObjBody = sectionObj['sectionBody'];
    documentObj[sectionObjTitle] = sectionObjBody;
}
  //console.log(documentObj);
}






function isASCII(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

//Parses string into sections, then returns the array of strings for
//each section
function separateSections(data){
  //Separated regular expression  into three pieces
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



//converts each section to an intermediate object representation
function convertToObject(sectionString){
  //get the section name, by regular expression match
  //console.log(JSON.stringify(sectionString));
  var sectionObj = {};

  var sectionTitleRegExp = /(-){9,}([\S\s]+?)(-){9,}/;
  var sectionRawTitle = sectionString.match(sectionTitleRegExp)[0];
  var sectionTitle = cleanUpTitle(sectionRawTitle);
  var sectionBody = getSectionBody(sectionString);

  sectionObj["sectionTitle"] = sectionTitle;
  sectionObj["sectionBody"] = sectionBody;

  return sectionObj;

}

//cleans up the title string obtained from the regular expression
function cleanUpTitle(rawTitleString){
  /*dashChar is most commonly the dash of the title string, or a
  the first repeating character surrounding the title */
  var dashChar = rawTitleString.charAt(0);

  //beginning and ending index of the dash
  var dashBegIndex = 0;
  var dashEndIndex = rawTitleString.lastIndexOf(dashChar);

  //loop through to find indicies without continous dashes
  while(rawTitleString.charAt(dashBegIndex) == (dashChar || '\n') ){
    dashBegIndex++;
  }
  while(rawTitleString.charAt(dashEndIndex) == (dashChar || '\n') ){
    dashEndIndex--;
  }

  var titleString = rawTitleString.slice(dashBegIndex+1, dashEndIndex-1);
  return titleString;
}

//parses the section body into an object
function getSectionBody(sectionString){
  /*first, use regular expressions to parse the section body into different
  objects */
  var sectionBody = {};
  var objectFromBodyRegExp = /(\n){2,}(?!-{9,})[\S\s,]+?((?=((\n){3,}?))|\n\n$)/gi
  //or go to the end of the string.
  console.log(JSON.stringify(sectionString));
  var objectStrings = sectionString.match(objectFromBodyRegExp);
    console.log(JSON.stringify(sectionString));
  //process each section object (from string to an actual object)
  for (var obj in objectStrings){
    sectionBody[obj] = processSectionChild(objectStrings[obj]);
  }
  return sectionBody;

}

/*processes objects with keys and values in each section((i.e. drug 1 of
demographics */
function processSectionChild(objectString){
  //regular expression that matches key value pairs
  var obj = {};
  //console.log(JSON.stringify(objectString));
  var keyValuePairRegExp = /(\n){2,}[\S\s,]+?(:)[\S\s]+?(?=((\n){1,})|$)/gi
  var keyValuePairArray = objectString.match(keyValuePairRegExp);
  for (var s in keyValuePairArray){
    //clean up the key pair
    //console.log(JSON.stringify(keyValuePairArray[s]));
    keyValuePairString = cleanUpKeyValuePair(keyValuePairArray[s], '\n');

    //split each string by the :, the result is an array of size two
    keyValuePair = keyValuePairString.split(':');
    //console.log(keyValuePair);
    obj[keyValuePair[0].trim()] = keyValuePair[1].trim();
  }

  return obj;
}

//cleans up keys and vlues
function cleanUpKeyValuePair(keyValueString, unwantedChar){
  var unwantedCharIndex = 0;
  while(keyValueString.charAt(unwantedCharIndex) == unwantedChar){
    unwantedCharIndex++;
  }
  return keyValueString.slice(unwantedCharIndex);

}

