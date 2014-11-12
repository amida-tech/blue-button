"use strict";

bbTesting.factory('ParserService', function() {
	var parser = require('bbparser');

    // Public API
    return {
        parse: function(xmlContent) {
            return parser.parseString(xmlContent);
        },
        validate: function(document) {
			return parser.validator.validateDocumentModel(document)
        }
    };
});
