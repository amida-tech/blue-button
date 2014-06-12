//these are common models that must be hardcoded...

var sections = {'cda_name': cda_name, 'cda_concept': cda_concept, 'cda_id':cda_id}

function cda_concept(){}

function cda_id(){}


function cda_name(name) {
  //this needs to be edited later to include prefixes
  var cdaNameObj = {};
  var nameArray = name.split(" ");
  if(nameArray.length == 2){
    cdaNameObj['first'] = nameArray[0];
    cdaNameObj['last'] = nameArray[1];
  }
  else if(nameArray.length == 3){
    cdaNameObj['first'] = nameArray[0];
    cdaNameObj['middle'] = nameArray[1];
    cdaNameObj['last'] = nameArray[2];
  }
  return cdaNameObj;
}


var getCommonModelFunction = function(commonModelName) {
    //console.log(keyMap);
    //sectionName = keyMap[sectionName];

    if (commonModelName in sections) {
        if(sections[commonModelName] != null){
        return sections[commonModelName];
      }
    }
    else {
        return null;
    }
};

module.exports.getCommonModelFunction = getCommonModelFunction;
module.exports.sections = sections;






