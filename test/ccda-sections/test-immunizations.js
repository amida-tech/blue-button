var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../../index');

var immunizations;

var loadRecord = function (done) {
    var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Immunizations.xml');
    var xml = fs.readFileSync(filepath, 'utf-8');
    immunizations = bb.parseString(xml, {
        component: 'ccda_immunizations'
    }).data;
    done();
};

describe('immunizations parser', function () {

    before(function (done) {
        if (immunizations === undefined) {
            loadRecord(function () {
                done();
            });
        } else {
            done();
        }
    });

    xit('full deep check', function (done) {
        expect(immunizations).to.exist;
        //console.log(JSON.stringify(immunizations, null, 10));
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Immunizations.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedImmunizations = JSON.parse(json2Read);
        expect(immunizations).to.deep.equal(expectedImmunizations);
        done();
    });

    it('spot check', function (done) {
        expect(immunizations).to.exist;
        expect(immunizations).to.have.length(4);

        expect(immunizations[0].administration.route.name).to.equal('Intramuscular injection');
        expect(immunizations[0].product.product.name).to.exist;
        expect(immunizations[0].product.product.code).to.equal('88');
        expect(immunizations[0].product.product.name).to.equal("Influenza virus vaccine");
        expect(JSON.stringify(immunizations[0].date_time.point.date)).to.equal('"1999-11-01T00:00:00Z"');
        expect(immunizations[0].date_time.point.precision).to.equal('month');

        done();
    });
});

describe('Immunizations - Schema Conformance', function () {

    before(function (done) {
        if (immunizations === undefined) {
            loadRecord(function () {
                done();
            });
        } else {
            done();
        }
    });

    it('Basic Object Structure', function (done) {
        //assert.isObject(immunizations, 'Main item should be object');
        assert.isArray(immunizations, 'Sub object should be array.');
        done();

    });

    it('Immunization Structure - Date', function (done) {
        for (var i in immunizations.immunizations) {
            var currentImmunization = immunizations.immunizations[i];
            assert.isDefined(currentImmunization.date, 'Date should exist');
            assert.isArray(currentImmunization.date, 'Date should be an array');
            assert.ok(currentImmunization.date.length < 3, 'Date optional, max length of two');

            for (var ii in currentImmunization.date) {
                var currentDate = currentImmunization.date[ii];
                assert.ok(currentDate.date.getDate(), 'Date should be parseable');
                assert.isString(currentDate.precision, 'Precision should be a string');
                assert.ok(currentDate.precision.length > 0, 'Precision should have content');
                assert.includeMembers(['year', 'month', 'day', 'hour', 'minute', 'second', 'subsecond'], new Array(currentDate.precision), 'Precision should be valid');
            }
        }
        done();
    });

    it('Immunization Structure - Identifiers', function (done) {
        for (var i in immunizations.immunizations) {
            var currentImmunization = immunizations.immunizations[i];
            assert.isDefined(currentImmunization.identifiers, 'Identifier should exist');
            assert.isArray(currentImmunization.identifiers, 'Identifier should be an array');
            assert.ok(currentImmunization.identifiers.length > 0, 'Identifier required.');

            for (var ii in currentImmunization.identifiers) {
                var currentId = currentImmunization.identifiers[ii];
                assert.isString(currentId.identifier, 'Identifier should be a string');
                assert.ok(currentId.identifier.length > 0, 'Identifier should have content');
                //TODO:  Add assertions if extension comes in, and snippets to test.
            }
        }
        done();
    });

    it('Immunization Structure - Status', function (done) {
        for (var i in immunizations.immunizations) {
            var currentImmunization = immunizations.immunizations[i];
            if (currentImmunization.status) {
                assert.isString(currentImmunization.status, 'Status should be a string');
                assert.ok(currentImmunization.status.length > 0, 'If present, status should have length');
                assert.includeMembers(['pending', 'complete', 'refused'], new Array(currentImmunization.status), 'Status should be known value');
            }
        }
        done();
    });

    it('Immunization Structure - Product', function (done) {
        for (var i in immunizations.immunizations) {
            var currentImmunization = immunizations.immunizations[i];
            assert.isDefined(currentImmunization.product, 'Product should exist');
            assert.isObject(currentImmunization.product, 'Product should be an array');
            assert.isDefined(currentImmunization.product.name, 'Product name should exist');
            assert.isString(currentImmunization.product.name, 'Product name should be a string');
            assert.ok(currentImmunization.product.name.length > 0, 'Product name should have length');
            assert.isDefined(currentImmunization.product.code, 'Product code should exist');
            assert.isString(currentImmunization.product.code, 'Product code should be a string');
            assert.ok(currentImmunization.product.code.length > 0, 'Product code should have length');
            assert.isDefined(currentImmunization.product["code_system_name"], 'Product code system name should exist');
            assert.isString(currentImmunization.product["code_system_name"], 'Product code system name should be a string');
            assert.ok(currentImmunization.product["code_system_name"].length > 0, 'Product code system name should have length');
            assert.includeMembers(['CVX'], new Array(currentImmunization.product["code_system_name"]), 'Product code system name should be CVX');
            if (currentImmunization.product.translations) {
                assert.isArray(currentImmunization.product.translations, 'translations should be array');
                assert.ok(currentImmunization.product.translations.length > 0, 'if present, translations should have length');
                for (var ii in currentImmunization.product.translations) {
                    var currentTranslation = currentImmunization.product.translations[ii];
                    assert.isString(currentTranslation.name, 'Translation name should be a string');
                    assert.ok(currentTranslation.name.length > 0, 'Translation name should have length');
                    assert.isDefined(currentTranslation.code, 'Product code should exist');
                    assert.isString(currentTranslation.code, 'Translation code should be a string');
                    assert.ok(currentTranslation.code.length > 0, 'Translation code should have length');
                    assert.isDefined(currentTranslation["code_system_name"], 'Translation code system name should exist');
                    assert.isString(currentTranslation["code_system_name"], 'Translation code system name should be a string');
                    assert.ok(currentTranslation["code_system_name"].length > 0, 'Translation code system name should have length');
                }
            }
            if (currentImmunization.product.lot_number) {
                assert.isString(currentImmunization.product.lot_number, 'Lot number should be a string');
                assert.ok(currentImmunization.product.lot_number.length > 0, 'Lot number should have length');
            }
            if (currentImmunization.product.manufacturer) {
                assert.isString(currentImmunization.product.manufacturer, 'Manufacturer should be a string');
                assert.ok(currentImmunization.product.manufacturer.length > 0, 'Manufacturer should have length');
            }
        }
        done();
    });

    it('Immunization Structure - Administration', function (done) {
        for (var i in immunizations.immunizations) {
            var currentImmunization = immunizations.immunizations[i];

            if (currentImmunization.administration) {
                assert.isObject(currentImmunization.administration, 'administration should be object');
                if (currentImmunization.administration.route) {
                    assert.isObject(currentImmunization.administration.route, 'route should be an object');
                    assert.isString(currentImmunization.administration.route.name, 'route name should be a string');
                    assert.ok(currentImmunization.administration.route.name.length > 0, 'route name should have length');
                    assert.isString(currentImmunization.administration.route.code, 'route name should be a string');
                    assert.ok(currentImmunization.administration.route.code.length > 0, 'route name should have length');
                    assert.isString(currentImmunization.administration.route.code_system_name, 'route system name should be a string');
                    assert.ok(currentImmunization.administration.route.code_system_name.length > 0, 'route system name should have length');
                    assert.includeMembers(['Medication Route FDA'], new Array(currentImmunization.administration.route.code_system_name), 'route system name should be known value');
                }
                if (currentImmunization.administration.body_site) {
                    assert.isObject(currentImmunization.administration.body_site, 'site should be an object');
                    assert.isString(currentImmunization.administration.body_site.name, 'site name should be a string');
                    assert.ok(currentImmunization.administration.body_site.name.length > 0, 'site name should have length');
                    assert.isString(currentImmunization.administration.body_site.code, 'site name should be a string');
                    assert.ok(currentImmunization.administration.body_site.code.length > 0, 'site name should have length');
                    assert.isString(currentImmunization.administration.body_site.code_system_name, 'site system name should be a string');
                    assert.ok(currentImmunization.administration.body_site.code_system_name.length > 0, 'site system name should have length');
                    assert.includeMembers(['SNOMED CT'], new Array(currentImmunization.administration.site.code_system_name), 'site system name should be known value');
                }
                if (currentImmunization.administration.quantity) {
                    assert.isObject(currentImmunization.administration.quantity, 'quantity should be an object');
                    assert.isNumber(currentImmunization.administration.quantity.value, 'quantity value should be a number');
                    assert.ok(currentImmunization.administration.quantity.value > 0, 'quantity value should be positive');
                    assert.isString(currentImmunization.administration.quantity.unit, 'quantity unit should be a string');
                    assert.ok(currentImmunization.administration.quantity.unit.length > 0, 'quantity unit should have length');
                }
                if (currentImmunization.administration.form) {
                    assert.isObject(currentImmunization.administration.form, 'form should be an object');
                    assert.isString(currentImmunization.administration.form.name, 'form name should be a string');
                    assert.ok(currentImmunization.administration.form.name.length > 0, 'form name should have length');
                    assert.isString(currentImmunization.administration.form.code, 'form name should be a string');
                    assert.ok(currentImmunization.administration.form.code.length > 0, 'form name should have length');
                    assert.isString(currentImmunization.administration.form.code_system_name, 'form system name should be a string');
                    assert.ok(currentImmunization.administration.form.code_system_name.length > 0, 'form system name should have length');
                    assert.includeMembers(['Medication Route FDA'], new Array(currentImmunization.administration.site.code_system_name), 'site system name should be known value');
                }
            }
        }
        done();
    });

    it('Immunization Structure - Performer', function (done) {
        for (var i in immunizations.immunizations) {
            var currentImmunization = immunizations.immunizations[i];

            if (currentImmunization.performer) {
                assert.isObject(currentImmunization.performer, 'performer should be object');

                if (currentImmunization.performer.identifiers) {
                    for (var ii in currentImmunization.performer.identifiers) {
                        var currentId = currentImmunization.performer.identifiers[ii];
                        assert.isString(currentId.identifier, 'Identifier should be a string');
                        assert.ok(currentId.identifier.length > 0, 'Identifier should have content');
                        //TODO:  Add assertions if extension comes in, and snippets to test.
                    }
                }

                if (currentImmunization.performer.name) {
                    for (var iname in currentImmunization.performer.name) {
                        var currentName = currentImmunization.performer.name[iname];
                        if (currentName.prefix) {
                            assert.isString(currentName.prefix, "Prefix should be string");
                            assert.ok(currentName.prefix.length > 0, 'Prefix should have content');
                        }
                        if (currentName.first) {
                            assert.isString(currentName.first, "First Name should be string");
                            assert.ok(currentName.first.length > 0, 'First Name should have content');
                        }
                        if (currentName.middle) {
                            assert.isArray(currentName.middle, "Middle Name should be string");
                            assert.ok(currentName.middle.length > 0, 'Middle Name should have content');
                        }
                        if (currentName.last) {
                            assert.isString(currentName.last, "Last Name should be string");
                            assert.ok(currentName.last.length > 0, 'Last Name should have content');
                        }
                        if (currentName.suffix) {
                            assert.isString(currentName.suffix, "Suffix should be string");
                            assert.ok(currentName.suffix.length > 0, 'Suffix should have content');
                        }
                    }
                }

                if (currentImmunization.performer.address) {
                    for (var iaddr in currentImmunization.performer.address) {
                        var currentAddress = currentImmunization.performer.address[iaddr];
                        assert.isArray(currentAddress.street_lines, 'street should be array');
                        assert.ok(currentAddress.street_lines.length < 4, 'max four street lines');
                        for (var iline in currentAddress.street_lines) {
                            assert.isString(currentAddress.street_lines[iline], 'street lines should be string');
                            assert.ok(currentAddress.street_lines[iline].length > 0, 'street lines should have content');
                        }
                        assert.isString(currentAddress.city, 'city should be string');
                        assert.ok(currentAddress.city.length > 0, 'city should have content');
                        assert.isString(currentAddress.state, 'state should be string');
                        assert.ok(currentAddress.state.length > 0, 'state should have content');
                        assert.isString(currentAddress.zip, 'zip should be string');
                        assert.ok(currentAddress.zip.length > 0, 'zip should have content');
                        if (currentAddress.country) {
                            assert.isString(currentAddress.country, 'country should be string');
                            assert.ok(currentAddress.country.length > 0, 'country should have content');
                        }
                    }
                }

                if (currentImmunization.performer.email) {
                    for (var iem in currentImmunization.performer.email) {
                        var currentEmail = currentImmunization.performer.email[iem];
                        assert.isString(currentEmail, 'current email should be string');
                        assert.ok(currentEmail.length > 0, 'current email should have content');
                    }
                }

                if (currentImmunization.performer.phone) {
                    for (var iph in currentImmunization.performer.phone) {
                        var currentPhone = currentImmunization.performer.phone[iph];
                        assert.isString(currentPhone, 'current phone should be string');
                        assert.ok(currentPhone.length > 0, 'current phone should have content');
                    }
                }

                if (currentImmunization.performer.organization) {
                    for (var iorg in currentImmunization.performer.organization) {
                        currentOrganization = currentImmunization.performer.organization[iorg];
                        if (currentOrganization.identifiers) {
                            for (var ordIds in currentOrganization.identifiers) {
                                var currentOrgId = currentOrganization.identifiers[ordIds];
                                assert.isString(currentOrgId.identifier, 'Identifier should be a string');
                                assert.ok(currentOrgId.identifier.length > 0, 'Identifier should have content');
                                //TODO:  Add assertions if extension comes in, and snippets to test.
                            }
                        }
                        if (currentOrganization.name) {
                            for (var orgNames in currentOrganization.name) {
                                var currentOrgName = currentOrganization.name[orgNames];
                                assert.isString(currentOrgName, 'Org Name should be a string');
                                assert.ok(currentOrgName.length > 0, 'Org Name should have content');
                            }
                        }
                    }
                }

            }
        }

        done();
    });

    it("Immunization Structure - Refusal", function (done) {
        for (var i in immunizations) {
            var currentImmunization = immunizations[i];
            if (currentImmunization.refusal_reason) {
                assert.isString(currentImmunization.refusal_reason, 'refusal should be a string');
                assert.ok(currentImmunization.refusal_reason.length > 0, 'refusal should have content');
            }
        }
        done();
    });
});
