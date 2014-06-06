//Byung Joo Shin, Amida Tech


parseCMS('sample2.txt');



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

  console.log(documentObj);
}


//Parses string into sections, then returns the array of strings for
//each section
function separateSections(data){
  //Separated regular expression into many distinct pieces

  //specical metaMatchCode goes first.

  // 1st regular expression for meta, need to do
  var metaMatchCode = '^(-).[\\S\\s]+?(\\n){2,}';


  /* 2nd regular expression for claims, because the structure of claims is
  unique */
  var claimsHeaderMatchCode = '(-){9,}(\\n)*Claim Summary(\\n){2,}(-){9,}';
  var claimsBodyMatchCode = '([\\S\\s]+Claim[\\S\\s]+)+';
  var claimsEndMatchCode = '(?=((-){9,}))';
  var claimsMatchCode = claimsHeaderMatchCode +
    claimsBodyMatchCode + claimsEndMatchCode;

  //this match code is for all other sections
  var headerMatchCode = '(-){9,}[\\S\\s]+?(\\n){2,}(-){9,}';
  var bodyMatchCode = '[\\S\\s]+?';
  var endMatchCode = '(?=((-){9,}))';
  var sectionMatchCode = headerMatchCode + bodyMatchCode + endMatchCode;


   /* The regular expression for everything, search globally and
  ignore capitalization */
  var totalMatchCode = claimsMatchCode+ "|"+sectionMatchCode;
  var totalRegExp = new RegExp(totalMatchCode, 'gi');
  var matchArray = data.match(totalRegExp);
    return matchArray;
}

//converts each section to an  object representation
function convertToObject(sectionString){

  var sectionObj = {};
  //get the section title(get it raw, clean it)
  var sectionTitleRegExp = /(-){9,}([\S\s]+?)(-){9,}/;
  var sectionRawTitle = sectionString.match(sectionTitleRegExp)[0];
  var sectionTitle = cleanUpTitle(sectionRawTitle);


  //get the section body
  var sectionBody;
  sectionObj["sectionTitle"] = sectionTitle;
    //these are very special "edge" cases

    //meta data/information about document in the beginning of the doc
  if(sectionTitle.toLowerCase().indexOf("personal health information") >= 0){
    sectionBody = getMetaBody(sectionString);
    console.log(JSON.stringify(sectionBody));
    //sectionBody = getMetaBody(sectionString);
  }
  else if(sectionTitle.toLowerCase().indexOf("claim") >= 0){
    sectionBody = getClaimsBody(sectionString);
  }
  else{
    sectionBody = getSectionBody(sectionString);
  }
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
  var sectionBody = [];
  var objectFromBodyRegExp = /-*(\n){2,}(?!-{9,})[\S\s,]+?((?=((\n){3,}?))|\n\n$)/gi
  //or go to the end of the string.
    var objectStrings = sectionString.match(objectFromBodyRegExp);
      //process each section object (from string to an actual object)
  for (var obj in objectStrings){
    var sectionChild = processSectionChild(objectStrings[obj]);
    if(!isEmpty(sectionChild))
      sectionBody.push(sectionChild);
  }
  return sectionBody;

}

function getClaimsBody(sectionString){
  var sectionBody = {};
  //this is for claim lines of only one type

  //this is for the claim lines with dashes in between
  var claimLineMatchCode = '(?:\\n*)(Claim Lines for Claim Number)[\\S\\s]+?\\n*-{9,}'
  +'[\\S\\s]+?(?:\\n*-{9,})';
  //this regular expression is for the regular claims with spaces.
  var claimMatchCode = '(?:(\\n{3,}))(Claim Number)[\\S\\s]+?(?:\\n*-{9,})';

  var sourceMatchCode = '-*(\\n){2,}(?!-{9,})[\\S\\s,]+?((?=((\\n){3,}?))|\\n\\n$)'

  var totalClaimMatchCode = claimLineMatchCode + '|' + claimMatchCode + '|' + sourceMatchCode;

  var totalClaimsRegExp = new RegExp(totalClaimMatchCode, 'gi');
    //or go to the end of the string
  var objectStrings = sectionString.match(totalClaimsRegExp);
        //process each section object (from string to an actual object)
  for (var obj in objectStrings){
      var sectionChild =  processClaimsSectionChild(objectStrings[obj]);
      if(!isEmpty(sectionChild))
      {
        sectionBody[obj] = sectionChild;
      }
  }
    return sectionBody;

}


//functions for specific meta characters
function getMetaBody(sectionString){
  var sectionBody = {};
  var metaBodyCode = /-{2,}\n*\*{3,}[\S\s]+\*{3,}[\S\s]+?\n{3,}/gi
  var objectStrings = sectionString.match(metaBodyCode);
  for( var obj in objectStrings)
  {
    var sectionChild =  processMetaChild(objectStrings[obj]);
    if(!isEmpty(sectionChild))
      sectionBody[obj] = processMetaChild(objectStrings[obj]);
  }

  return sectionBody;

}

function processMetaChild(objectString){
  var obj = {}
  var metaValueCode = /(\n{2,})([\S\s]+?)(?=\n{2,})/gi
      var metaValues = objectString.match(metaValueCode);
    var counter = 0;
  for(var value in metaValues){
    obj[value] = metaValues[value].replace(/\n/g, '');
    counter++;
  }
    return obj;
}


/*processes objects with keys and values in each section((i.e. drug 1 of
demographics */
function processSectionChild(objectString){
  //regular expression that matches key value pairs
  var obj = {};
  var objArray = [];
  var topObj = obj;
    var keyValuePairRegExp = /(\n){1,}[\S\s,]+?(:)[\S\s]+?(?=((\n){1,})|$)/gi
  var keyValuePairArray = objectString.match(keyValuePairRegExp);
  var bugCounter = 0;
  //unusual steps are required to parse meta data and claims summary
    for (var s in keyValuePairArray){
    //clean up the key pair
  //  console.log(JSON.stringify(keyValuePairArray[s]));
    keyValuePairString = trimStringEnds(keyValuePairArray[s], ['\n']);

    //split each string by the :, the result is an array of size two
    keyValuePair = keyValuePairString.split(':');
        var key = removeUnwantedCharacters(keyValuePair[0].trim(), ['\n', '-']);
    var value = keyValuePair[1].trim();
    obj[key] = value;
      }

  if(objArray.length > 0){
    objArray.push(obj);
    return objArray;
  }
  else
  {
    return obj;
  }

}

//function to process claim section of the document
function processClaimsSectionChild(objectString){
  //regular expression that matches key value pairs
  var obj = {};
  var objArray = [];
  var topObj = obj;
    var keyValuePairRegExp = /(\n){1,}[\S\s,]+?(:)[\S\s]+?(?=((\n){1,})|$)/gi
  var keyValuePairArray = objectString.match(keyValuePairRegExp);
  var bugCounter = 0;
  //unusual steps are required to parse meta data and claims summary
    for (var s in keyValuePairArray){
    //clean up the key pair
  //  console.log(JSON.stringify(keyValuePairArray[s]));
    keyValuePairString = trimStringEnds(keyValuePairArray[s], ['\n']);

    //split each string by the :, the result is an array of size two
    keyValuePair = keyValuePairString.split(':');
        var key = removeUnwantedCharacters(keyValuePair[0].trim(), ['\n', '-']);
    var value = keyValuePair[1].trim();
    if(value.length == 0)
      value = null;
    if(key in obj){
      objArray.push(obj);
      obj = {};
    }
    obj[key] = value;
      }

  if(objArray.length > 0){
    objArray.push(obj);
    return objArray;
  }
  else
  {
    return obj;
  }

}

/*remove a list of unwanted characters from a given string, globally(as in
  not only the ends */
function removeUnwantedCharacters(cleanedString, unwantedCharArray)
{
  for(var x in unwantedCharArray)
  {
    var unwantedCharRegExp = new RegExp(unwantedCharArray[x], 'g');
        cleanedString = cleanedString.replace(unwantedCharRegExp, '');
  }
  return cleanedString;
}

/*cleans up keys and values from the beginning and end of the string */
function trimStringEnds(keyValueString, unwantedCharArray){
  var unwantedBegCharIndex = 0;
  var unwantedEndCharIndex = keyValueString.length - 1;
  var keepGoing = true; //keep traversing the string
  console.log(JSON.stringify(keyValueString));
  //starting from the beginning of the string
  while(keepGoing)
  {
    var charIsUnwanted = false;
    for(var x = 0; x < unwantedCharArray.length; x++){
      if (keyValueString.charAt(unwantedBegCharIndex) == unwantedCharArray[x]){
        charIsUnwanted = true;
      }
    }
    if(!charIsUnwanted){
      keepGoing = false;
    }
    else
    {
      unwantedBegCharIndex++;
    }
  }
  //now start at the end
  keepGoing = true;
  while(keepGoing)
  {
    var charIsUnwanted = false;
    for(var x = 0; x < unwantedCharArray.length; x++){
      if (keyValueString.charAt(unwantedEndCharIndex) == unwantedCharArray[x]){
        charIsUnwanted = true;
      }
    }
    if(!charIsUnwanted){
      keepGoing = false;
    }
    else
    {
      unwantedEndCharIndex--;
    }
  }
  console.log(keyValueString);
  console.log(unwantedEndCharIndex);
  keyValueString = keyValueString.slice(unwantedBegCharIndex, unwantedEndCharIndex+1);
  console.log(JSON.stringify(keyValueString));
  return keyValueString;
}

//tells whether object is empty or not
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

