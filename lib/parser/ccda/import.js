var fs = require("fs");
var ccda = require('./ccd');

var argv = require('optimist')
.usage('Convert a CCDA to JSON.\nUsage: $0')
.demand('f')
.alias('f', 'file')
.describe('f', 'CCDA file to load')
.demand('p')
.alias('p', 'patient-id')
.describe('p', 'Patient ID')
.describe('stdout', 'Output JSON to stdout')
.alias('r', 'replace-content')
.describe('r', 'Overwrite existing URIs when available')
.alias('m', 'mongo-db')
.describe('m', 'load result into mongdb')
.argv;

var src = fs.readFileSync(argv.f);
ccda.import(argv.p, src, argv, function(err, result) {
  console.log(JSON.stringify(result.toJSON(), null, "  "));
});
