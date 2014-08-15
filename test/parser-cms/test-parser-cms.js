var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var bb = require('../../index.js');

describe('parser.js', function () {
    var txtfile = null;

    before(function (done) {
        var filepath = path.join(__dirname, '../fixtures/parser-cms/sample.txt');
        txtfile = fs.readFileSync(filepath, 'utf-8').toString();
        done();
    });

    it('CMS parser/model validation', function (done) {
        expect(txtfile).to.exist;

        //convert string into JSON 
        var result = bb.parseText(txtfile);
        expect(result).to.exist;

        val = bb.validator.validateDocumentModel(result);

        var err = bb.validator.getLastError();

        //if validation failed print all validation errors and summary by category of error
        if (!err.valid) {

            var _ = require("underscore");

            function count(numbers) {
                return _.reduce(numbers, function (result, current) {
                    return result + 1;
                }, 0);
            }
            var result = _.chain(err.errors)
                .groupBy("code")
                .map(function (value, key) {
                    return {
                        code: key,
                        count: count(_.pluck(value, "code"))
                    }
                })
                .value();

            console.log("Errors: \n", JSON.stringify(bb.validator.getLastError(), null, 4));
            console.log("Errors summary: \n ", JSON.stringify(result, null, 4));
        }

        expect(err.valid).to.equal(true);

        done();
    });

});
