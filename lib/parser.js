//modular parser for variety of formats (e.g. CCDA, C32, etc)

var libxmljs = require("libxmljs");
var router = require("./parser/router.js").router;
var supportedComponents = require("./parser/router.js").supportedComponents;

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

function parseComponents(inputFile) {

	var ns = {
		"xmlns": "urn:hl7-org:v3"
	};

	var xpath = "/ClinicalDocument/component/structuredBody/component/section/templateId";
	xpath = applyNS(xpath);
	var templateArray = findNode(inputFile, xpath, ns);

	for (var i in templateArray) {
		for (var ii in supportedComponents) {
			if (supportedComponents[ii] === templateArray[i].attr('root').value()) {				
				router(ii, templateArray[i].parent());
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
		parseComponents(xmlDoc);
		callback(null, 'done');
	}
}



module.exports.parse = parse;