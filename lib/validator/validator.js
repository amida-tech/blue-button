var fs = require("fs");
var Q = require('q');
var ZSchema = require("z-schema");

//set remotes locally. Ideally, this should be from the master branch of the
//blue button repository.
var sharedModels = fs.readFileSync(__dirname + '/schemas/shared.json', 'utf8');


//ideally, we want this to be a single remote reference from Github.
ZSchema.setRemoteReference('http://local.com/commonModels', sharedModels);

var json=JSON.parse(fs.readFileSync("./samples/vitals.json").toString());
var schema=JSON.parse(fs.readFileSync("./schemas/vitals.json").toString());

var sharedSchema = JSON.parse(fs.readFileSync("./schemas/shared.json").toString());
var vitalsTest = JSON.parse(fs.readFileSync("./schemas/vitalstest.json").toString());

//console.log(json);
//console.log(sharedModels);

//THIS MUST BE A STRING
var refModel = JSON.parse(fs.readFileSync(__dirname + '/schemas/reftest.json', 'utf8').toString());


var remoteSchema = {
        '$ref': 'http://local.com/schema'
    };

var dateSchema = { '$ref': 'http://local.com/commonModels#/properties/cda_date' }


var dateObj = {'date': '1975-05-01T00:00:00.000Z'};
//console.log(remoteSchema);
//console.log(refModel);


//remember sync: true
var validator = new ZSchema({ sync: true, noExtraKeywords:true});


var compiledSchema = validator.compileSchema(refModel);
console.log(JSON.stringify(compiledSchema,null,4));


var valid = validator.validate(dateObj, compiledSchema);
console.log(valid);
if (!valid) {
    var error = validator.getLastError();
    console.log(JSON.stringify(error,null,4));
}




