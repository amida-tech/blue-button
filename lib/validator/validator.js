/*jslint node: true */

var validator = function validator() {

    var fs = require("fs");
    var ZSchema = require("z-schema");
    var lastError;

    //setup references
    var shared = fs.readFileSync(__dirname + '/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/common_models', shared);
    var sharedSchema = {
        '$ref': 'http://local.com/common_models'
    };

    var demographics = fs.readFileSync(__dirname + '/schemas/demographics.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/demographics', demographics);
    var demographicsSchema = {
        '$ref': 'http://local.com/demographics'
    };

    var allergy = fs.readFileSync(__dirname + '/schemas/allergy.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/allergy', allergy);
    var allergySchema = {
        '$ref': 'http://local.com/allergy'
    };

    var encounter = fs.readFileSync(__dirname + '/schemas/encounter.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/encounter', encounter);
    var encounterSchema = {
        '$ref': 'http://local.com/encounter'
    };

    var immunization = fs.readFileSync(__dirname + '/schemas/immunization.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/immunization', immunization);
    var immunizationSchema = {
        '$ref': 'http://local.com/immunization'
    };

    var medication = fs.readFileSync(__dirname + '/schemas/medication.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/medication', medication);
    var medicationSchema = {
        '$ref': 'http://local.com/medication'
    };

    var problem = fs.readFileSync(__dirname + '/schemas/problem.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/problem', problem);
    var problemSchema = {
        '$ref': 'http://local.com/problem'
    };

    var procedure = fs.readFileSync(__dirname + '/schemas/procedure.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/procedure', procedure);
    var procedureSchema = {
        '$ref': 'http://local.com/procedure'
    };

    var plan_of_care = fs.readFileSync(__dirname + '/schemas/plan_of_care.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/plan_of_care', plan_of_care);
    var plan_of_careSchema = {
        '$ref': 'http://local.com/plan_of_care'
    };

    var payers = fs.readFileSync(__dirname + '/schemas/payers.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/payers', payers);
    var payersSchema = {
        '$ref': 'http://local.com/payers'
    };

    var result = fs.readFileSync(__dirname + '/schemas/result.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/result', result);
    var resultSchema = {
        '$ref': 'http://local.com/result'
    };

    var social_history = fs.readFileSync(__dirname + '/schemas/social_history.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/social_history', social_history);
    var socialHistorySchema = {
        '$ref': 'http://local.com/social_history'
    };

    var vital = fs.readFileSync(__dirname + '/schemas/vital.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/vital', vital);
    var vitalSchema = {
        '$ref': 'http://local.com/vital'
    };

    var insurance = fs.readFileSync(__dirname + '/schemas/insurance.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/insurance', insurance);
    var insuranceSchema = {
        '$ref': 'http://local.com/insurance'
    };

    var claims = fs.readFileSync(__dirname + '/schemas/claims.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/claims', claims);
    var claimsSchema = {
        '$ref': 'http://local.com/claims'
    };

    var provider = fs.readFileSync(__dirname + '/schemas/provider.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/provider', provider);
    var providerSchema = {
        '$ref': 'http://local.com/provider'
    };

    var document_model = fs.readFileSync(__dirname + '/schemas/document_model.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/document_model', document_model);
    var documentModelSchema = {
        '$ref': 'http://local.com/document_model'
    };

    var validator = new ZSchema({
        sync: true,
        noExtraKeywords: true
    });
    //add a key function value object that keeps track of which key goes with
    //what function

    var keySchemaMap = {};
    keySchemaMap.shared = sharedSchema;
    keySchemaMap.demographics = demographicsSchema;
    keySchemaMap.allergy = allergySchema;
    keySchemaMap.encounter = encounterSchema;
    keySchemaMap.immunization = immunizationSchema;
    keySchemaMap.medication = medicationSchema;
    keySchemaMap.problem = problemSchema;
    keySchemaMap.procedure = procedureSchema;
    keySchemaMap.result = resultSchema;
    keySchemaMap.social_history = socialHistorySchema;
    keySchemaMap.vital = vitalSchema;
    keySchemaMap.insurance = insuranceSchema;
    keySchemaMap.claims = claimsSchema;
    keySchemaMap.plan_of_care = plan_of_careSchema;
    keySchemaMap.payers = payersSchema;
    keySchemaMap.provider = providerSchema;

    this.validateDocumentModel = function (documentModel) {
        compiledSchema = validator.compileSchema(documentModelSchema);
        var valid = validator.validate(documentModel, compiledSchema);
        lastError = validator.getLastError();
        return valid;
    }

    this.getSectionDocumentModel = function (sectionName) {
        if (sectionName in keySchemaMap) {
            var sectionSchema = keySchemaMap[sectionName];
            var compiledSchema = validator.compileSchema(sectionSchema);
            lastError = validator.getLastError();
            return compiledSchema;
        }
        return {}

    }

    this.getDocumentModel = function () {
        var compiledSchema = validator.compileSchema(documentModelSchema);
        lastError = validator.getLastError();
        return compiledSchema;
    }

    /*validates a single section child, this means a section with a section. For example, a *SINGLE*
    problem in the problems section */

    this.validateSectionObj = function validateSectionObj(sectionObj, sectionName) {
        if (sectionName in keySchemaMap) {
            var sectionSchema = keySchemaMap[sectionName];
            compiledSchema = validator.compileSchema(sectionSchema);
            var valid = validator.validate(sectionObj, compiledSchema);
            lastError = validator.getLastError();
            return valid;
        }
        var sharedSchema = validator.compileSchema(keySchemaMap.shared);
        var sharedModels = sharedSchema['__$refResolved'].properties; //nevermind, use an alternative approach
        if (sectionName in sharedModels) {
            var sharedObjects = {};
            sharedObjects[sectionName] = sectionObj;
            var valid = validator.validate(sharedObjects, sharedSchema);
            lastError = validator.getLastError();
            return valid;
        }
        return false;
    }
    this.getLastError = function () {
        return lastError;
    }

    this.validateSection = function validateSection(section, sectionName) {
        /*not sure about triple equals here because object strings and primitive
        string =S */
        if (sectionName.toLowerCase() === 'demographics' || sectionName.toLowerCase() === 'social history') {
            var sectionSchema = keySchemaMap[sectionName];
            compiledSchema = validator.compileSchema(sectionSchema);
            var valid = validator.validate(sectionObj, compiledSchema);
            lastError = validator.getLastError();
            return valid;
        } else if (sectionName in keySchemaMap) {
            var sectionSchema = keySchemaMap[sectionName];
            compiledSchema = validator.compileSchema(sectionSchema);
            for (var x in section) {
                var valid = validator.validate(section[x], compiledSchema);
                if (!valid) {
                    return false;
                }
                return true;
            }
        } else {
            var sharedSchema = validator.compileSchema(keySchemaMap.shared);
            var sharedModels = sharedSchema['__$refResolved'].properties; //nevermind, use an alternative approach
        }
        if (sectionName in sharedModels) {
            var sharedObjects = {};
            sharedObjects[sectionName] = section;
            var valid = validator.validate(sharedObjects, sharedSchema);
            lastError = validator.getLastError();
            return valid;
        }
        return false;
    }
    this.getLastError = function () {
        return lastError;
    }

}

validator.instance = null;
validator.getInstance = function () {
    if (this.instance === null) {
        this.instance = new validator();
    }
    return this.instance;
}

module.exports = validator.getInstance();
