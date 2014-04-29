//CCDA to JSON parser.
var ccda_allergies = require("./ccda/allergies.js").parse;
var ccda_demographics = require("./ccda/demographics.js").parse;

var supported_components = {
	"ccda_allergies": "2.16.840.1.113883.10.20.22.2.6"
};

var supported_headers = {
	"ccda_header": "2.16.840.1.113883.10.20.22.1.2"
}

var componentRouter = function(componentName, component) {

	if (componentName === "ccda_allergies") {
		ccda_allergies(component);
	}

}

var headerRouter = function(headerName, header) {

	if (headerName === "ccda_header") {
		ccda_demographics(header);
	}

}

module.exports.componentRouter = componentRouter;
module.exports.headerRouter = headerRouter;
module.exports.supported_components = supported_components;
module.exports.supported_headers = supported_headers;