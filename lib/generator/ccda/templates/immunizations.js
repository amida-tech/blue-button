var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function(data, codeSystems, isCCD, CCDxml) {
    // determining the number of entries
    var entries = libCCDAGen.getNumEntries(data);
    var keys = Object.keys(entries[1]);
    var sum = 0;
    for (var i = 0; i < keys.length; i++) {
        sum += entries[1][keys[i]];
    }

    var doc = new libxmljs.Document();
    xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.2", "2.16.840.1.113883.10.20.22.2.2.1", "11369-6", 
            "2.16.840.1.113883.6.1", "LOINC", "History of immunizations", "IMMUNIZATIONS", isCCD);

            // entries loop
            for (var i = 0; i < sum; i++) {
                xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"});
                    xmlDoc = libCCDAGen.substanceAdministration(xmlDoc, data, i, "#immun" + (i+1), "#immi" + (i+1), 
                        "2.16.840.1.113883.10.20.22.4.52", "2.16.840.1.113883.10.20.22.4.54");
                    xmlDoc = libCCDAGen.entryRelationship(xmlDoc, data, 'act'); 
                    xmlDoc = xmlDoc.parent() // end substanceAdministration
                .parent() // end entry
            }
        xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument

    return isCCD ? xmlDoc : doc;
}