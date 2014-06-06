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
  var claimsRegExp = new RegExp(claimsMatchCode, 'gi');




  // 2nd regular expression for claims, which is a special case of other
  // sections



  //this match code is for all other sections
  var headerMatchCode = '(-){9,}[\\S\\s]+?(\\n){2,}(-){9,}';
  var bodyMatchCode = '[\\S\\s]+?';
  var endMatchCode = '(?=((-){9,}))';

  var sectionMatchCode = headerMatchCode + bodyMatchCode + endMatchCode;


  var totalMatchCode = claimsMatchCode+ "|"+sectionMatchCode;

  /* the regular expression for entire sections, search globally and
  ignore capitalization */
  var totalRegExp = new RegExp(totalMatchCode, 'gi');
  var matchArray = data.match(totalRegExp);
  //console.log(matchArray);
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
  var sectionBody;

  sectionObj["sectionTitle"] = sectionTitle;
  //console.log(sectionTitle);
  //these are very special "edge" cases
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
  //console.log(sectionBody);
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
  //console.log(JSON.stringify(sectionString));
  var objectStrings = sectionString.match(objectFromBodyRegExp);
    //console.log(JSON.stringify(objectStrings));
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
  //console.log(JSON.stringify(sectionString));

  //this is for the claim lines with dashes in between
  var claimLineMatchCode = '(?:\\n*)(Claim Lines for Claim Number)[\\S\\s]+?\\n*-{9,}'
  +'[\\S\\s]+?(?:\\n*-{9,})';
  //this regular expression is for the regular claims with spaces.
  var claimMatchCode = '(?:(\\n{3,}))(Claim Number)[\\S\\s]+?(?:\\n*-{9,})';

  var sourceMatchCode = '-*(\\n){2,}(?!-{9,})[\\S\\s,]+?((?=((\\n){3,}?))|\\n\\n$)'

  var totalClaimMatchCode = claimLineMatchCode + '|' + claimMatchCode + '|' + sourceMatchCode;

  var totalClaimsRegExp = new RegExp(totalClaimMatchCode, 'gi');
  //console.log(totalClaimsRegExp);
  //or go to the end of the string
  var objectStrings = sectionString.match(totalClaimsRegExp);
  //console.log(objectStrings);
    //console.log((objectStrings.length));
  //process each section object (from string to an actual object)
  for (var obj in objectStrings){
      var sectionChild =  processClaimsSectionChild(objectStrings[obj]);
      if(!isEmpty(sectionChild))
      {
        sectionBody[obj] = sectionChild;
      }
  }
  //console.log(sectionBody);
  return sectionBody;

}

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
  //console.log(typeof objectString);
  //console.log(JSON.stringify(objectString));
  var metaValues = objectString.match(metaValueCode);
  //console.log(JSON.stringify(metaValues));
  var counter = 0;
  for(var value in metaValues){
    obj[value] = metaValues[value].replace(/\n/g, '');
    counter++;
  }
  //console.log(JSON.stringify(obj));
  return obj;
}


/*processes objects with keys and values in each section((i.e. drug 1 of
demographics */
function processSectionChild(objectString){
  //regular expression that matches key value pairs
  var obj = {};
  var objArray = [];
  var topObj = obj;
  //console.log(JSON.stringify(objectString));
  var keyValuePairRegExp = /(\n){1,}[\S\s,]+?(:)[\S\s]+?(?=((\n){1,})|$)/gi
  var keyValuePairArray = objectString.match(keyValuePairRegExp);
  var bugCounter = 0;
  //unusual steps are required to parse meta data and claims summary
  //console.log('******************************');
  for (var s in keyValuePairArray){
    //clean up the key pair
  //  console.log(JSON.stringify(keyValuePairArray[s]));
    keyValuePairString = trimStringEnds(keyValuePairArray[s], ['\n']);

    //split each string by the :, the result is an array of size two
    keyValuePair = keyValuePairString.split(':');
    //console.log(JSON.stringify(keyValuePair));
    var key = removeUnwantedCharacters(keyValuePair[0].trim(), ['\n', '-']);
    var value = keyValuePair[1].trim();
    obj[key] = value;
    //console.log(objArray);
  }
  //console.log("bug counter" + bugCounter);

  if(objArray.length > 0){
    objArray.push(obj);
    return objArray;
  }
  else
  {
    return obj;
  }

}

function processClaimsSectionChild(objectString){
  //regular expression that matches key value pairs
  var obj = {};
  var objArray = [];
  var topObj = obj;
  //console.log(JSON.stringify(objectString));
  var keyValuePairRegExp = /(\n){1,}[\S\s,]+?(:)[\S\s]+?(?=((\n){1,})|$)/gi
  var keyValuePairArray = objectString.match(keyValuePairRegExp);
  var bugCounter = 0;
  //unusual steps are required to parse meta data and claims summary
  //console.log('******************************');
  for (var s in keyValuePairArray){
    //clean up the key pair
  //  console.log(JSON.stringify(keyValuePairArray[s]));
    keyValuePairString = trimStringEnds(keyValuePairArray[s], ['\n']);

    //split each string by the :, the result is an array of size two
    keyValuePair = keyValuePairString.split(':');
    //console.log(JSON.stringify(keyValuePair));
    var key = removeUnwantedCharacters(keyValuePair[0].trim(), ['\n', '-']);
    var value = keyValuePair[1].trim();
    if(value.length == 0)
      value = null;
    if(key in obj){
      objArray.push(obj);
      obj = {};
    }
    obj[key] = value;
    //console.log(objArray);
  }
  //console.log("bug counter" + bugCounter);

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
    //console.log(unwantedCharRegExp);
    cleanedString = cleanedString.replace(unwantedCharRegExp, '');
  }
  return cleanedString;


}

/*cleans up keys and values from the beginning and end of the string,
i.e. In *******helloo********* , stars would be removed. NOT WORKING YET */
function trimStringEnds(keyValueString, unwantedCharArray){
  var unwantedCharIndex = 0;
  for(var x in unwantedCharArray){
    while(keyValueString.charAt(unwantedCharIndex) == unwantedCharArray[x]){
      unwantedCharIndex++;
    }
    keyValueString = keyValueString.slice(unwantedCharIndex);
}
  return keyValueString;

}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

