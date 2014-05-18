// flexible loading of proper XML parser
// currently just uses libxmljs for Node.js env

"use strict";

function parse(src) {
    var xml;

    //libxmljs parser options
    var options = {
        noblanks: true
    };

    xml = require("libxmljs").parseXmlString(src, options);

    //console.log("process: "+process.title);
    /*
  Browser support is removed for now

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
  */

    return xml;
}

module.exports = {
    parse: parse
};
