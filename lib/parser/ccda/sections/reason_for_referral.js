"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var processor = require("blue-button-xml").processor;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportReasonForReferralSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var reason_for_referral_section = component.define("ReasonForReferralSection");
    reason_for_referral_section.templateRoot([sectionIDs.ReasonForReferralSection]);
    reason_for_referral_section.fields([
	        //["code", "1..1", "h:code", shared.ConceptDescriptor],           
            ["title", "0..1", "h:title", shared.TextWithReference],
            ["text", "0..1", "h:text", processor.asXmlString]
            
        ]);
    return [reason_for_referral_section];
};

exports.reason_for_referral_section = exportReasonForReferralSection;

