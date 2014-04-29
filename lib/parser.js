//modular parser for variety of formats (e.g. CCDA, C32, etc)

var libxmljs = require("libxmljs");
var componentRouter = require("./parser/router.js").componentRouter;
var supported_components = require("./parser/router.js").supported_components;
var headerRouter = require("./parser/router.js").headerRouter;
var supported_headers = require("./parser/router.js").supported_headers;

//Decorates namespace holder for xpath query.
function applyNS(xpath) {
	var xpathSplit = xpath.split("/");
	var xpathString = "";
	for (var i in xpathSplit) {
		var xpathNS = "xmlns:" + xpathSplit[i];
		if (i > 0) {
			xpathString = xpathString + "/" + xpathNS;
		}
	}
	return xpathString;
}

//Takes xpath and optional namespace, returns node object(s).
function findNode(xmlDoc, xp, ns) {
	var res;

	if (ns) {
		res = xmlDoc.find(xp, ns);
	} else {
		res = xmlDoc.find(xp);
	}
	return res;
}


function parseHeader(inputFile) {

	var ns = {
		"xmlns": "urn:hl7-org:v3"
	};

	//Find and route standard sections.
	var xpath = "/ClinicalDocument/templateId";
	xpath = applyNS(xpath);
	var templateArray = findNode(inputFile, xpath, ns);

	for (var i in templateArray) {
		for (var ii in supported_headers) {
			if (supported_headers[ii] === templateArray[i].attr('root').value()) {
				headerRouter(ii, templateArray[i]);
			}
		}
	}

}



function parseComponents(inputFile) {

	var ns = {
		"xmlns": "urn:hl7-org:v3"
	};

	//Find and route standard sections.
	var xpath = "/ClinicalDocument/component/structuredBody/component/section/templateId";
	xpath = applyNS(xpath);
	var templateArray = findNode(inputFile, xpath, ns);

	for (var i in templateArray) {
		for (var ii in supported_components) {
			//OID based sections.
			if (supported_components[ii] === templateArray[i].attr('root').value()) {
				componentRouter(ii, templateArray[i].parent());
			}
		}
	}

}

//Parsing function.  Optionally takes input format, defaults to base format.
function parse(inputFile, callback) {

	var xmlDoc;

	try {
		xmlDoc = libxmljs.parseXmlString(inputFile);
	} catch (err) {
		callback(err);
	}
	if (xmlDoc) {
		parseHeader(xmlDoc);
		parseComponents(xmlDoc);
		callback(null, 'done');
	}
}



module.exports.parse = parse;