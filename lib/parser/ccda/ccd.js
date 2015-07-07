"use strict";

var component = require("blue-button-xml").component;
var xml = require("blue-button-xml").xmlUtil;
var shared = require("./shared");

var exportCCD = function (version) {
    var patient = require("./demographics").patient;
    var resultsSection = require("./sections/results").resultsSection(version)[0];
    var vitalSignsSection = require("./sections/vitals").vitalSignsSection(version)[0];
    var problemsSection = require("./sections/problems").problemsSection(version)[0];
    var immunizationsSection = require("./sections/immunizations").immunizationsSection(version)[0];
    var socialHistorySection = require("./sections/social_history").socialHistorySection(version)[0];
    var medicationsSection = require("./sections/medications").medicationsSection(version)[0];
    var allergiesSection = require("./sections/allergies").allergiesSection(version)[0];
    var encountersSection = require("./sections/encounters").encountersSection(version)[0];
    var proceduresSection = require("./sections/procedures").proceduresSection(version)[0];
    var plan_of_care_section = require("./sections/plan_of_care").plan_of_care_section(version)[0];
    var payers_section = require("./sections/payers").payers_section(version)[0];

    return component.define("CCD")
        .fields([
            ["meta", "0..1", ".", shared.metaData],
            ["demographics", "1..1", "(/ | //h:recordTarget/h:patientRole)[last()]", patient],
            ["vitals", "0..1", vitalSignsSection.xpath(), vitalSignsSection],
            ["results", "0..1", resultsSection.xpath(), resultsSection],
            ["medications", "0..1", medicationsSection.xpath(), medicationsSection],
            ["encounters", "0..1", encountersSection.xpath(), encountersSection],
            ["allergies", "0..1", allergiesSection.xpath(), allergiesSection],
            ["immunizations", "0..1", immunizationsSection.xpath(), immunizationsSection],
            ["social_history", "0..1", socialHistorySection.xpath(), socialHistorySection],
            ["problems", "0..1", problemsSection.xpath(), problemsSection],
            ["procedures", "0..1", proceduresSection.xpath(), proceduresSection],
            ["plan_of_care", "0..1", plan_of_care_section.xpath(), plan_of_care_section],
            ["payers", "0..1", payers_section.xpath(), payers_section],
        ]);
};

exports.CCD = exportCCD;

var runCCD = exports.runCCD = function (version) {
    var patient = require("./demographics").patient;
    var resultsSection = require("./sections/results").resultsSection(version)[0];
    var vitalSignsSection = require("./sections/vitals").vitalSignsSection(version)[0];
    var problemsSection = require("./sections/problems").problemsSection(version)[0];
    var immunizationsSection = require("./sections/immunizations").immunizationsSection(version)[0];
    var socialHistorySection = require("./sections/social_history").socialHistorySection(version)[0];
    var medicationsSection = require("./sections/medications").medicationsSection(version)[0];
    var allergiesSection = require("./sections/allergies").allergiesSection(version)[0];
    var encountersSection = require("./sections/encounters").encountersSection(version)[0];
    var proceduresSection = require("./sections/procedures").proceduresSection(version)[0];
    var plan_of_care_section = require("./sections/plan_of_care").plan_of_care_section(version)[0];
    var payers_section = require("./sections/payers").payers_section(version)[0];

    return function(doc, sourceKey) {
        console.time('build');
        var fields = [
            ["meta", "0..1", ".", shared.metaData],
            ["demographics", "1..1", "//h:recordTarget/h:patientRole", patient],
            ["vitals", "0..1", vitalSignsSection.xpath(), vitalSignsSection],
            ["results", "0..1", resultsSection.xpath(), resultsSection],
            ["medications", "0..1", medicationsSection.xpath(), medicationsSection],
            ["encounters", "0..1", encountersSection.xpath(), encountersSection],
            ["allergies", "0..1", allergiesSection.xpath(), allergiesSection],
            ["immunizations", "0..1", immunizationsSection.xpath(), immunizationsSection],
            ["social_history", "0..1", socialHistorySection.xpath(), socialHistorySection],
            ["problems", "0..1", problemsSection.xpath(), problemsSection],
            ["procedures", "0..1", proceduresSection.xpath(), proceduresSection],
            ["plan_of_care", "0..1", plan_of_care_section.xpath(), plan_of_care_section],
            ["payers", "0..1", payers_section.xpath(), payers_section]
        ];

        var result = {};
        var errors = [];

        fields.forEach(function(field) {
            console.time(field[0]);
            var p = field[2];
            var c = field[3];
            var section = xml.xpath(doc, p);
            if (section && section.length) {
                var context = {};
                var textNode = null;
                var childNodes = section[0].childNodes();
                if (childNodes && childNodes.length) {
                    for (var idx=0; idx<childNodes.length; ++idx) {
                        var child = section[0].child(idx);
                        if (child && (child.type() === 'element') &&  (child.name() === 'text')) {
                            textNode = child;
                            break;
                        }
                    }
                }
                if (textNode) {
                    var idNodes = textNode.find(".//*[@ID]");
                    idNodes.forEach(function(idNode) {
                        var key = idNode.attr('ID').value();
                        var value = idNode.text();
                        if (key && value) {
                            value = value.replace(/(\r\n|\n|\r|\t)/gm, "");
                            value = value.replace(/\s+/g, ' ');
                            context[key]=value;
                        }
                    });
                }
                var ret = c.instance();
                var data = ret.run(section[0], sourceKey, context);
                if (data) {
                    result[field[0]] = data;
                }
                Array.prototype.push.apply(errors, ret.errors);
            }
            console.timeEnd(field[0]);
        });

        console.timeEnd('build');
        return {
            data: result,
            errors: errors
        };
    };
};
