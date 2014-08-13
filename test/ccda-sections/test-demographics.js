var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var path = require('path');

var bb = require('../../index');

var demographics;

var loadRecord = function (done) {
    var filepath = path.join(__dirname, '../fixtures/file-snippets/CCD_1_Demographics.xml');
    var xml = fs.readFileSync(filepath, 'utf-8');
    demographics = bb.parseString(xml, {
        component: 'ccda_demographics'
    }).data
    done();

};

describe('Demographics - Snippet Comparison', function () {

    before(function (done) {
        if (demographics === undefined) {
            loadRecord(function () {
                done();
            });
        } else {
            done();
        }
    });

    xit('Deep Equality Check', function (done) {
        expect(demographics).to.exist;
        var filepath = path.join(__dirname, '../fixtures/file-snippets/json/CCD_1_Demographics.json');
        var json2Read = fs.readFileSync(filepath, 'utf-8');
        var expectedDemographics = JSON.parse(json2Read);
        expect(demographics).to.deep.equal(expectedDemographics);
        done();
    });

    xit('Shallow Equality Check', function (done) {
        expect(demographics.name).to.exists;
        expect(demographics.name.last).to.equal('Jones');
        expect(demographics.name.first).to.equal('Isabella');
        expect(demographics.name.middle).to.have.members(['Isa']);
        expect(JSON.stringify(demographics.dob[0].date)).to.equal('"1975-05-01T00:00:00Z"');
        expect(demographics.phone).to.exists;
        expect(demographics.phone).to.have.length(1);
        expect(demographics.phone[0].number).to.equal('(816)276-6909');
        expect(demographics.phone[0].type).to.equal('primary home');
        expect(demographics.race_ethnicity).to.equal('White');
        done();
    });
});

describe('Demographics - Schema Conformance', function () {

    before(function (done) {
        if (demographics === undefined) {
            loadRecord(function () {
                done();
            });
        } else {
            done();
        }
    });

    it('Basic Object Structure', function (done) {
        assert.isObject(demographics, 'Main item should be object');
        done();
    });

    it('Demographic Structure - Name', function (done) {
        var currentName = demographics.name;
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
        done();
    });

    it('Demographic Structure - Gender', function (done) {
        assert.isDefined(demographics.gender, 'Gender required');
        assert.isString(demographics.gender, 'Gender must be string');
        assert.includeMembers(['Male', 'Female', 'Unknown'], new Array(demographics.gender), 'Precision should be valid');
        done();
    });

    xit('Demographic Structure - dob', function (done) {

        assert.isDefined(demographics.dob, 'Date should exist');
        assert.isArray(demographics.dob, 'Date should be an array');
        assert.ok(demographics.dob.length > 0, 'Date required');
        assert.ok(demographics.dob.length < 2, 'Date required, max length of one');

        for (var ii in demographics.dob) {
            var currentDate = demographics.dob[ii];
            assert.ok(Date.parse(currentDate.date), 'Date should be parseable');
            assert.isString(currentDate.precision, 'Precision should be a string');
            assert.ok(currentDate.precision.length > 0, 'Precision should have content');
            assert.includeMembers(['year', 'month', 'day', 'hour', 'minute', 'second', 'subsecond'], new Array(currentDate.precision), 'Precision should be valid');
        }
        done();
    });

    it('Demographic Structure - Identifiers', function (done) {
        assert.isDefined(demographics.identifiers, 'Identifier should exist');
        assert.isArray(demographics.identifiers, 'Identifier should be an array');
        assert.ok(demographics.identifiers.length > 0, 'Identifier required.');

        for (var ii in demographics.identifiers) {
            var currentId = demographics.identifiers[ii];
            assert.isString(currentId.identifier, 'Identifier should be a string');
            assert.ok(currentId.identifier.length > 0, 'Identifier should have content');
            //TODO:  Add assertions if extension comes in, and snippets to test.
        }
        done();
    });

    it('Demographic Structure - Marital Status', function (done) {
        if (demographics.marital_status) {
            assert.isString(demographics.marital_status, "marital_status should be string.");
            assert.ok(demographics.marital_status.length > 0, "marital_status should have length");
        }
        done();
    });

    it('Demographic Structure - Address', function (done) {

        for (var iaddr in demographics.addresses) {
            var currentAddress = demographics.addresses[iaddr];
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
        done();
    });

    it('Demographic Structure - Phone & Email', function (done) {
        if (demographics.email) {
            for (var iem in demographics.email) {
                var currentEmail = demographics.email[iem];
                assert.isString(currentEmail.address, 'current email should be string');
                assert.ok(currentEmail.address.length > 0, 'current email should have content');
            }
        }

        if (demographics.phone) {
            for (var iph in demographics.phone) {
                var currentPhone = demographics.phone[iph];
                assert.isString(currentPhone.number, 'current phone should be string');
                assert.ok(currentPhone.number.length > 0, 'current phone should have content');
            }
        }
        done();
    });

    it('Demographic Structure - Race Ethnicity', function (done) {
        if (demographics.race_ethnicity) {
            assert.isString(demographics.race_ethnicity, 'race_ethnicity should be string');
            assert.ok(demographics.race_ethnicity.length > 0, 'race_ethnicity should have content');
        }
        done();
    });

    it('Demographic Structure - Religion', function (done) {
        if (demographics.race_ethnicity) {
            assert.isString(demographics.race_ethnicity, 'Religion should be string');
            assert.ok(demographics.race_ethnicity.length > 0, 'Religion should have content');
        }
        done();
    });

    it('Demographic Structure - Languages', function (done) {
        if (demographics.languages) {
            assert.isArray(demographics.languages);
            for (var ilang in demographics.languages) {
                var currentLanguage = demographics.languages[ilang];
                assert.isString(currentLanguage.language, "Language should be string");
                assert.ok(currentLanguage.language.length > 0, "Language should not be empty");
                if (currentLanguage.preferred) {
                    assert.isBoolean(currentLanguage.preferred, "Preference should be boolean");
                }
                if (currentLanguage.mode) {
                    assert.isString(currentLanguage.mode, "Language mode should be string");
                    assert.ok(currentLanguage.mode.length > 0, "Language mode should not be empty");
                }
                if (currentLanguage.proficiency) {
                    assert.isString(currentLanguage.proficiency, "Language proficiency should be string");
                    assert.ok(currentLanguage.proficiency.length > 0, "Language proficiency should not be empty");
                }
            }
        }
        done();
    });

    it('Demographic Structure - Birthplace', function (done) {

        if (demographics.birthplace) {
            var birthPlace = demographics.birthplace;
            if (birthPlace.street_lines) {
                assert.isArray(birthPlace.street_lines, 'street should be array');
                assert.ok(birthPlace.street_lines.length < 4, 'max four street lines');
                for (var iline in birthPlace.street_lines) {
                    assert.isString(birthPlace.street_lines[iline], 'street lines should be string');
                    assert.ok(birthPlace.street_lines[iline].length > 0, 'street lines should have content');
                }

            }
            if (birthPlace.city) {
                assert.isString(birthPlace.city, 'city should be string');
                assert.ok(birthPlace.city.length > 0, 'city should have content');
            }
            if (birthPlace.state) {
                assert.isString(birthPlace.state, 'state should be string');
                assert.ok(birthPlace.state.length > 0, 'state should have content');
            }
            if (birthPlace.zip) {
                assert.isString(birthPlace.zip, 'zip should be string');
                assert.ok(birthPlace.zip.length > 0, 'zip should have content');
            }
            if (birthPlace.country) {
                assert.isString(birthPlace.country, 'country should be string');
                assert.ok(birthPlace.country.length > 0, 'country should have content');
            }

        }
        done();
    });

    it('Demographic Structure - Guardians', function (done) {
        if (demographics.guardians) {
            assert.isArray(demographics.guardians, 'Guardians should be array');
            assert.ok(demographics.guardians.length > 0, 'Guardians should have length');

            for (var iguard in demographics.guardians) {
                var currentGuardian = demographics.guardians[iguard];
                assert.isDefined(currentGuardian.relation, 'Guardians must have relation');
                assert.isString(currentGuardian.relation, 'Relation must be string');
                assert.ok(currentGuardian.relation.length > 0, 'Relation must have content');

                if (currentGuardian.addresses) {
                    assert.isArray(currentGuardian.addresses, 'Addresses should be array');
                    assert.ok(currentGuardian.addresses.length > 0, 'Addresses should have length');

                    for (var iguardaddr in currentGuardian.addresses) {
                        var currentAddress = currentGuardian.addresses[iguardaddr];
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

                if (currentGuardian.name) {
                    var currentName = currentGuardian.name;
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

                if (currentGuardian.email) {
                    for (var iem in currentGuardian.email) {
                        var currentEmail = currentGuardian.email[iem];
                        assert.isString(currentEmail.address, 'current email should be string');
                        assert.ok(currentEmail.address.length > 0, 'current email should have content');
                    }
                }

                if (currentGuardian.phone) {
                    for (var iph in currentGuardian.phone) {
                        var currentPhone = currentGuardian.phone[iph];
                        assert.isString(currentPhone.number, 'current phone should be string');
                        assert.ok(currentPhone.number.length > 0, 'current phone should have content');
                    }
                }

            }
        }
        done();
    });

});
