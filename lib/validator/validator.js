/*jslint node: true */



var validator = function validator() {

    var fs = require("fs");
    var ZSchema = require("z-schema");
    var lastError;
    //setup references
    var shared = fs.readFileSync(__dirname + '/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);
    var sharedSchema = {
          '$ref': 'http://local.com/commonModels'
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

    var result = fs.readFileSync(__dirname + '/schemas/result.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/result', result);
    var resultSchema = {
        '$ref': 'http://local.com/result'
    };

    var socialHistory = fs.readFileSync(__dirname + '/schemas/socialhistory.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/socialhistory', socialHistory);
    var socialHistorySchema = {
        '$ref': 'http://local.com/socialhistory'
    };

    var vital = fs.readFileSync(__dirname + '/schemas/vital.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/vital', vital);
    var vitalSchema = {
        '$ref': 'http://local.com/vital'
    };

    var documentModel = fs.readFileSync(__dirname + '/schemas/documentModel.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/documentModel', documentModel);
    var documentModelSchema = {
        '$ref': 'http://local.com/documentModel'
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
    keySchemaMap.socialHistory = socialHistorySchema;
    keySchemaMap.vital = vitalSchema;





    this.validateDocumentModel = function (documentModel) {
        compiledSchema = validator.compileSchema(documentModelSchema);
        var valid = validator.validate(documentModel, compiledSchema);
        lastError = validator.getLastError();
        return valid;
    }


    //validates a single section child
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
        if (sectionName in sharedModels){
            var sharedObjects = {};
            sharedObjects[sectionName] = sectionObj;
            var valid = validator.validate(sharedObjects, sharedSchema);
            lastError = validator.getLastError();
            return valid;
        }
        return false;
    }
    this.getLastError = function() {
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
