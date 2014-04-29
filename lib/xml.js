// flexible loading of proper XML parser

"use strict";

/*global Document*/
function parse(src){
  var xml;

  //console.log("process: "+process.title);

  if (process.title === "node" || process.title === "grunt" ){
    xml = require("libxmljs").parseXmlString(src);
  }
  else if (typeof src === "string"){
    xml = new DOMParser().parseFromString(src, "text/xml");
  } else if (typeof src === "object" && src.constructor === Document) {
    xml = src;
  } else {
    throw "Unrecognized document type " + typeof src;
  }

  return xml;
}

module.exports = {parse:parse};
