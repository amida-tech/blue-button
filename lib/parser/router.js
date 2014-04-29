//CCDA to JSON parser.
var ccda_allergies = require("./ccda/allergies.js").parse;

var supportedComponents = {
	"ccda_allergies": "2.16.840.1.113883.10.20.22.2.6"
};

var router = function(componentName, component) {

	if (componentName === "ccda_allergies") {
		ccda_allergies(component);
	}

}

module.exports.router = router;
module.exports.supportedComponents = supportedComponents;