var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];

var resultsValueAttrs = function(result) {
    var attrs = {"xsi:type": "PQ"};
    if ((result.value !== null) && (result.value !== undefined))  {
        attrs.value = result.value;
    }
    if (result.unit) {
        attrs.unit = result.unit;
    }
    return attrs;
}

var updateEntry = function(xmlDoc, entry) {
    xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"});
    xmlDoc.node('organizer').attr({classCode: "BATTERY"}).attr({moodCode: "EVN"});
        xmlDoc = xmlDoc.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.1"}).parent();
        xmlDoc = libCCDAGen.id(xmlDoc, entry["identifiers"]);
        xmlDoc = libCCDAGen.code(xmlDoc, entry["result_set"]).parent();
        xmlDoc = xmlDoc.node('statusCode')
            .attr({code: 'completed'}).parent()

         // results loop
         for (var j = 0; j < entry["results"].length; j++) {
             var time = libCCDAGen.getTimes(entry["results"][j]["date_time"]);
             var results = entry["results"][j];
        
            xmlDoc = xmlDoc.node('component')
                .node('observation').attr({classCode: "OBS"})
                    .attr({moodCode: "EVN"})
                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.2"}).parent();
                    xmlDoc = libCCDAGen.id(xmlDoc, results["identifiers"]);
                    xmlDoc = libCCDAGen.code(xmlDoc, results["result"]).parent();
                    xmlDoc = xmlDoc.node('text')
                        .node('reference').attr({value: "#result" + (j + 1)}).parent()
                    .parent()
                    .node('statusCode').attr({code: 'completed'}).parent();
                    xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);

                    xmlDoc = xmlDoc.node('value').attr(resultsValueAttrs(entry.results[j])).parent()
                        //.attr({"xsi:type": "PQ"})
                        //.attr({value: entry["results"][j]["value"]})
                        //.attr({unit: entry["results"][j]["unit"]}).parent()
                    .node('interpretationCode')
                        .attr(results["interpretations"] ? 
                            {code: results["interpretations"][0].substr(0, 1)} : {nullFlavor: "UNK"})
                        .attr({codeSystem: "2.16.840.1.113883.5.83"}).parent()
                    .node('referenceRange')
                        .node('observationRange');
                            if (entry["results"][j]["reference_range"] && entry["results"][j]["reference_range"]["range"]) {
                                 xmlDoc = xmlDoc.node('text', entry["results"][j]["reference_range"]["range"]).parent()
                            } else if (entry["results"][j]["reference_range"]) {
                                xmlDoc = xmlDoc.node('value').attr({"xsi:type": "IVL_PQ"})
                                    .node('low').attr({value: entry["results"][j]["reference_range"]['low']})
                                        .attr({unit: entry["results"][j]["reference_range"]['unit']}).parent()
                                    .node('high').attr({value: entry["results"][j]["reference_range"]['high']})
                                        .attr({unit: entry["results"][j]["reference_range"]['unit']}).parent()
                                .parent()
                            }                               
                        xmlDoc = xmlDoc.parent()
                    .parent()
                .parent()
            .parent()
        }
    
    xmlDoc = xmlDoc.parent();
}

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.3", 
        "2.16.840.1.113883.10.20.22.2.3.1", sec_entries_codes["ResultsSection"], "RESULTS", isCCD);

    // entries loop
    var n = data.length;
    for (var i=0; i<n; ++i) {
        updateEntry(xmlDoc, data[i]);
    }

    xmlDoc = xmlDoc.parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}
