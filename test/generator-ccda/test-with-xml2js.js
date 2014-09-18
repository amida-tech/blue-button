"use strict;";

var expect = require('chai').expect;

var fs = require("fs");
var path = require('path');
var mkdirp = require('mkdirp');
var xml2js = require('xml2js');
var bb = require('../../index.js');

describe('xml vs parse generate xml ', function () {
    var generatedDir = null;

    before(function () {
        generatedDir = path.join(__dirname, "../fixtures/files/parse_gen_parse/generated");
        mkdirp.sync(generatedDir);
        expect(generatedDir).to.exist;
    });

    describe('CCD_1.xml', function () {
        var toSections = function (ccd) {
            expect(ccd.ClinicalDocument).to.exist;
            expect(ccd.ClinicalDocument.component).to.exist;
            expect(ccd.ClinicalDocument.component[0]).to.exist;
            expect(ccd.ClinicalDocument.component[0].structuredBody).to.exist;
            expect(ccd.ClinicalDocument.component[0].structuredBody[0]).to.exist;
            expect(ccd.ClinicalDocument.component[0].structuredBody[0].component).to.exist;
            return ccd.ClinicalDocument.component[0].structuredBody[0].component;
        };

        var findSection = function (sections, templateId) {
            var n = sections.length;
            for (var i = 0; i < n; ++i) {
                var sectionInfo = sections[i].section[0];
                var ids = sectionInfo.templateId;
                if (ids) {
                    for (var j = 0; j < ids.length; ++j) {
                        var id = ids[j];
                        if (id['$'].root === templateId) {
                            return sections[i].section[0]
                        }
                    }
                }
            }
            return null;
        };

        var cleanIntroducedCodeAttrs = function cleanIntroducedCodeAttrs(original, generated) {
            Object.keys(generated).forEach(function (key) {
                if ((key === '$') && original[key]) {
                    var originalAttrs = original[key];
                    var generatedAttrs = generated[key];
                    ['codeSystem', 'codeSystemName', 'displayName'].forEach(function (attr) {
                        if (generatedAttrs[attr] && !originalAttrs[attr]) {
                            delete generatedAttrs[attr];
                        }
                    });
                    if (originalAttrs.codeSystemName && (originalAttrs.codeSystemName !== generatedAttrs.codeSystemName)) {
                        if (originalAttrs.codeSystemName.toUpperCase() === generatedAttrs.codeSystemName.toUpperCase()) {
                            originalAttrs.codeSystemName = generatedAttrs.codeSystemName;
                        }
                    }
                } else if (generated[key] && (typeof original[key] === 'object')) {
                    cleanIntroducedCodeAttrs(original[key], generated[key]);
                }
            });
        };

        // Parser does not keep time zones.  This removes them from original until that is fixed
        var removeTimeZones = function (original) {
            Object.keys(original).forEach(function (key) {
                if ((key === '$') && original[key]) {
                    var t = original[key].value;
                    if (t && (typeof t === 'string')) {
                        if (t.length > 14) {
                            var index = t.indexOf('-');
                            if (index < 0) {
                                index = t.indexOf('+');
                            }
                            if ((index + 5) === t.length) {
                                original[key].value = t.slice(0, index);
                            }
                        }
                    }
                } else if (original[key] && (typeof original[key] === 'object')) {
                    removeTimeZones(original[key]);
                }
            });
        };

        // Parser does not keep time zones.  This removes them from original until that is fixed
        var removeOriginalText = function (original, generated) {
            Object.keys(original).forEach(function (key) {
                if ((key === 'originalText') || (key === 'reference')) {
                    delete original[key];
                    if (generated[key]) {
                        delete generated[key];
                    }
                } else if (generated[key] && (typeof original[key] === 'object')) {
                    removeOriginalText(original[key], generated[key]);
                }
            });
        };

        var xml;
        var xmlGenerated;
        var sections;
        var sectionsGenerated;

        it('create xml and generated xml', function () {
            xml = fs.readFileSync("./test/fixtures/generator-ccda/CCD_1.xml").toString();

            // convert nto JSON 
            var result = bb.parseString(xml);
            var val = bb.validator.validateDocumentModel(result);
            var err = bb.validator.getLastError();
            expect(err.valid).to.be.true;

            // generate ccda
            xmlGenerated = bb.generateCCDA(result).toString();
        });

        it('xml2js oiginal', function (done) {
            var parser = new xml2js.Parser();
            parser.parseString(xml, function (err, result) {
                sections = toSections(result);
                done(err);
            });
        });

        it('xml2js generated', function (done) {
            var parser = new xml2js.Parser();
            parser.parseString(xmlGenerated, function (err, result) {
                sectionsGenerated = toSections(result);
                done(err);
            });
        });

        it('allergies', function () {
            var allergies = findSection(sections, "2.16.840.1.113883.10.20.22.2.6");
            var allergiesGenerated = findSection(sectionsGenerated, "2.16.840.1.113883.10.20.22.2.6");
            expect(allergies).to.exist;
            expect(allergiesGenerated).to.exist;

            // ignore allergies text
            delete allergies.text;
            delete allergiesGenerated.text;

            cleanIntroducedCodeAttrs(allergies, allergiesGenerated);
            removeTimeZones(allergies);
            removeOriginalText(allergies, allergiesGenerated);
            //console.log(allergies);
            expect(allergiesGenerated).to.deep.equal(allergies);
        });
    });
});
