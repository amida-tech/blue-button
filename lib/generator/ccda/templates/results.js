var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");


module.exports = function(data, codeSystems, isCCD, CCDxml) {
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.3", "2.16.840.1.113883.10.20.22.2.3.1", "30954-2", 
            "2.16.840.1.113883.6.1", "LOINC", "RESULTS", "RESULTS", isCCD);

        // entries loop
        var xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                              .node('organizer').attr({classCode: "BATTERY"}).attr({moodCode: "EVN"});
            xmlDoc = xmlDoc.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.1"}).parent()
                .node('id').attr(data[0]["identifiers"] !== undefined ? {root: data[0]["identifiers"][0]["identifier"]} : {nullFlavor: "UNK"} ).parent();
                xmlDoc = libCCDAGen.code(xmlDoc, data[0]["result_set"]).parent();
                xmlDoc = xmlDoc.node('statusCode').attr({code: 'completed'}).parent()

                // results loop
                for (var j = 0; j < data[0]["results"].length; j++) {
                    var time = libCCDAGen.getTimes(data[0]["results"][j]["date"]);
                    var results = data[0]["results"][j];

                    xmlDoc = xmlDoc.node('component')
                        .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.2"}).parent()
                            .node('id').attr( results["identifiers"] !== undefined ? {root: results['identifiers'][0]['identifier']} : {nullFlavor: "UNK"}).parent();
                            xmlDoc = libCCDAGen.code(xmlDoc, results["result"]).parent(); 
                            xmlDoc = xmlDoc.node('text')
                                .node('reference').attr({value: "#result" + (j+1)}).parent()
                            .parent()
                            .node('statusCode').attr({code: 'completed'}).parent()
                            .node('effectiveTime').attr({value: time[0]}).parent()
                            .node('value').attr({"xsi:type": "PQ"}).attr({value: data[0]["results"][j]["value"]}).attr({unit: data[0]["results"][j]["unit"]}).parent()
                            .node('interpretationCode')
                                .attr(results["interpretations"] !== undefined ? {code: results["interpretations"][0].substr(0,1)} : {nullFlavor: "UNK"})
                                .attr({codeSystem: "2.16.840.1.113883.5.83"}).parent()
                            .node('referenceRange')
                                .node('observationRange')
                                    .node('text', "UNIMPLEMENTED").parent()
                                .parent()
                            .parent()
                        .parent()
                    .parent()
                }
            xmlDoc = xmlDoc.parent()
        .parent()
    .parent() // end section
.parent(); // end clinicalDocument

return isCCD ? xmlDoc : doc;
}