var fs = require("fs");
var ZSchema = require("z-schema");

//var fileContent = fs.readFileSync(__dirname + '/../json_schema_test_suite/remotes/integer.json', 'utf8');
//ZSchema.setRemoteReference('http://localhost:1234/integer.json', fileContent);

//var json=JSON.parse(fs.readFileSync("./samples/test.json").toString());
//var schema=JSON.parse(fs.readFileSync("./schemas/test.json").toString());

var json=JSON.parse(fs.readFileSync("./samples/vitals.json").toString());
var schema=JSON.parse(fs.readFileSync("./schemas/vitals.json").toString());


console.log(json);
console.log(schema);


var validator = new ZSchema({ sync: true, noExtraKeywords:true});
var valid = validator.validate(json, schema);

if (!valid) {
    var error = validator.getLastError();
    console.log(JSON.stringify(error,null,4));
}

console.log(valid);