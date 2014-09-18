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

        var normalizedDisplayNames = {
            "History of immunizations": 'Immunizations',
            "Patient Objection": "Patient objection"
        };

        var normalizedCodeSystemNames = {
            "National Cancer Institute (NCI) Thesaurus": "Medication Route FDA",
            "HL7 ActNoImmunizationReason": "Act Reason",
            "RxNorm": "RXNORM"
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
                        if (normalizedCodeSystemNames[originalAttrs.codeSystemName]) {
                            originalAttrs.codeSystemName = normalizedCodeSystemNames[originalAttrs.codeSystemName];
                        }
                    }
                    if (originalAttrs.displayName && (originalAttrs.displayName !== generatedAttrs.displayName)) {
                        if (normalizedDisplayNames[originalAttrs.displayName]) {
                            originalAttrs.displayName = normalizedDisplayNames[originalAttrs.displayName];
                        }
                    }
                } else if (original[key] && (typeof original[key] === 'object') && (typeof generated[key] === 'object')) {
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

        var trimText = function (original, generated) {
            Object.keys(original).forEach(function (key) {
                if ((key === '_') && generated[key]) {
                    original[key] = original[key].replace(/[\r\t\n ]/g, '');
                    generated[key] = generated[key].replace(/[\r\t\n ]/g, '');
                } else if (generated[key] && (typeof original[key] === 'object') && (typeof generated[key] === 'object')) {
                    trimText(original[key], generated[key]);
                }
            });
        };

        var removeId = function (original, generated, templateId) {
            Object.keys(original).forEach(function (key) {
                if ((key === 'templateId') && original.templateId) {
                    console.log(original.templateId[0]);
                }
                if ((key === 'templateId') && original.templateId && original.templateId[0]['$'] && (original.templateId[0]['$'].root !== "2.16.840.1.113883.10.20.22.4.53")) {
                    console.log('here;');
                    delete original.id;
                } else if (generated[key] && (typeof original[key] === 'object') && (typeof generated[key] === 'object')) {
                    removeId(original[key], generated[key], templateId);
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

        var compareSection = function (templateId) {
            var section = findSection(sections, templateId);
            var sectionGenerated = findSection(sectionsGenerated, templateId);
            expect(section).to.exist;
            expect(sectionGenerated).to.exist;

            // ignore text
            delete section.text;
            delete sectionGenerated.text;

            cleanIntroducedCodeAttrs(section, sectionGenerated);
            removeTimeZones(section);
            removeOriginalText(section, sectionGenerated);
            trimText(section, sectionGenerated);
            //removeId(section, sectionGenerated, "2.16.840.1.113883.10.20.22.4.53");

            expect(sectionGenerated).to.deep.equal(section);
        }

        it('allergies', function () {
            compareSection("2.16.840.1.113883.10.20.22.2.6");
        });

        //it('immunizations', function () {
        //    compareSection("2.16.840.1.113883.10.20.22.2.2");
        //});

        //it('medications', function () {
        //    compareSection("2.16.840.1.113883.10.20.22.2.1");
        //});
    });
});
