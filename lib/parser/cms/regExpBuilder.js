//CURRENTLY NOT IN USE


/*Multipurpose regular expression builder, created so that it's easier to
build and keep track of regular expressions
*/

var RegExpBuilder = {};



RegExpBuilder.createRegExp = function(){
  //if the number of arguments is zero, resort to default string
  var matchPattern = undefined;
  if(arguments.length == 0){
    throw "No arguments in regExpBuilder";
  }
  else{
    matchPattern = null;
    for(var x = 0; x <= arguments.length; x++){
      matchPattern += String(arguments[x]);
    }

    this.regularExpression = new RegExp(matchPattern);
  }
}

RegExpBuilder.addFlags = function{} {




}


module.exports = RegExpBuilder;

