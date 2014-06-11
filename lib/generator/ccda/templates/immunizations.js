var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

function writeXML(sectionNumber, data, codeSystems) {
    var xml = {};
    if (sectionNumber == 8) {
        xml = loadImmunizations(sectionNumber, data, codeSystems);
    }
    return xml;
}

function loadImmunizations(sectionNumber, data, codeSystems) {
     // determining the number of entries
    var entriesArr = [];
    var entries = {};
    for (var i = 0; i < data.length; i++) {
        entriesArr[i] = data[i]["date"][0]["date"].slice(0,4);
        entries[entriesArr[i]] = i + 1;
    }
    var uniqueEntries = entriesArr.filter(function(v,i) { return i == entriesArr.lastIndexOf(v); });

    for (var i = 1; i < uniqueEntries.length; i++) {
        entries[uniqueEntries[i]] = entries[uniqueEntries[i]] - entries[uniqueEntries[i-1]];
    }

    // start the templating
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(doc, "2.16.840.1.113883.10.20.22.2.2", "2.16.840.1.113883.10.20.22.2.2.1", "11369-6", 
        "2.16.840.1.113883.6.1", "LOINC", "History of immunizations", "IMMUNIZATIONS");
    
            // entries loop
            for (var i = 0; i < entriesArr.length; i++) {
                xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"});
                    xmlDoc = libCCDAGen.substanceAdministration(xmlDoc, data, i, "#immun" + (i+1), "#immi" + (i+1), 
                        "2.16.840.1.113883.10.20.22.4.52", "2.16.840.1.113883.10.20.22.4.54");
                     xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
                        .node('act').attr({classCode: "ACT"}).attr({moodCode: "INT"})
                            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.20"}).parent()
                            .node('code').attr({code: "171044003"})
                                 .attr({codeSystem: "2.16.840.1.113883.6.96"})
                                 .attr({displayName: "immunization education"}).parent()
                            .node('text', 'possible flu-like symptoms for three days')
                                .node('reference').attr({value: "#immunSect"}).parent()
                            .parent()
                            .node('statusCode').attr({code: "completed"}).parent()
                        .parent()
                    .parent()
                .parent()
            .parent(    )              
            }
        xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return doc;
}

module.exports = function() {
    return writeXML(arguments["0"], arguments["1"], arguments["2"]);
}

