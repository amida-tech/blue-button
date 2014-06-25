/*jslint node: true */

var fs = require("fs");
var ZSchema = require("z-schema");

function setup() {




    //setup references
    shared = fs.readFileSync(__dirname + '/schemas/shared.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/commonModels', shared);

    demographics = fs.readFileSync(__dirname + '/schemas/demographics.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/demographics', demographics);
    demographicsSchema = {'$ref': 'http://local.com/demographics'};

    allergy = fs.readFileSync(__dirname + '/schemas/allergy.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/allergy', allergy);
    allergySchema = {'$ref': 'http://local.com/allergy'};

    encounter = fs.readFileSync(__dirname + '/schemas/encounter.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/encounter', encounter);
    encounterSchema = {'$ref': 'http://local.com/encounter'};

    immunization = fs.readFileSync(__dirname + '/schemas/immunization.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/immunization', immunization);
    immunizationSchema = {'$ref': 'http://local.com/immunization'};

    medication = fs.readFileSync(__dirname + '/schemas/medication.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/medication', medication);
    medicationSchema = {'$ref': 'http://local.com/medication'};

    problem = fs.readFileSync(__dirname + '/schemas/problem.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/problem', problem);
    problemSchema = {'$ref': 'http://local.com/problem'};

    procedure = fs.readFileSync(__dirname + '/schemas/procedure.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/procedure', procedure);
    procedureSchema = {'$ref': 'http://local.com/procedure'};

    result = fs.readFileSync(__dirname + '/schemas/result.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/result', result);
    resultSchema = {'$ref': 'http://local.com/result'};

    socialHistory= fs.readFileSync(__dirname + '/schemas/socialhistory.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/socialhistory', socialHistory);
    socialHistorySchema = {'$ref': 'http://local.com/socialhistory'};

    vital = fs.readFileSync(__dirname + '/schemas/vital.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/vital', vital);
    vitalSchema = {'$ref': 'http://local.com/vital'};

    documentModel = fs.readFileSync(__dirname + '/schemas/documentModel.json', 'utf8');
    ZSchema.setRemoteReference('http://local.com/documentModel', documentModel);
    documentModelSchema = {'$ref': 'http://local.com/documentModel'};

    //add a key function value object that keeps track of which key goes with
    //what function

    keySchemaMap = {};
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
}




function validateDocumentModel(documentModel){

    validator = new ZSchema({sync: true, noExtraKeywords: true});

    compiledSchema = validator.compileSchema(documentModelSchema);
    var valid = validator.validate(documentModel, compiledSchema);
    //console.log(valid);
    if (!valid) {
        var error = validator.getLastError();
        //console.log(JSON.stringify(error,null,4));
        return error;
    }
    return valid;
}


//validates a single section child
function validateSectionObj(sectionObj, sectionName){
    if(sectionName in keySchemaMap){
        var sectionSchema = keySchemaMap[sectionName];
        validator = new ZSchema({sync: true, noExtraKeywords: true});
        compiledSchema = validator.compileSchema(sectionSchema);

        var valid = validator.validate(sectionObj, compiledSchema);
        return valid;
    }
    return "section not found";
}

module.exports.setup = setup;
module.exports.valiateDocumentModel = validateDocumentModel;
module.exports.validateSectionObj = validateSectionObj;








