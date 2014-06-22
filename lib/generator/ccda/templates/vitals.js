var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function(data, codeSystems, isCCD, CCDxml) {
     // determining the number of entries
    var entries = libCCDAGen.getNumEntries(data);

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.4", "2.16.840.1.113883.10.20.22.2.4.1", codeSystems[data[0]["vital"]["code_system_name"]][1], 
            "2.16.840.1.113883.6.1", "LOINC", "VITAL SIGNS", "VITAL SIGNS", isCCD);
    
            // entries loop
            for (var i = 0; i < entries[0].length; i++) {
                var vitLoop = [1,3,5,2,4,6];
                var time = libCCDAGen.getTimes(data[i*entries[1][entries[0][i]]]["date"]);
               
                var organizer = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                                      .node('organizer').attr({classCode: "CLUSTER"}).attr({moodCode: "EVN"});
                    organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.26"}).parent()
                        .node('id').attr({root: data[0]["identifiers"][0]["identifier"]}).parent()
                        .node('code')
                            .attr({code: codeSystems["SNOMED CT"][1] })
                            .attr({codeSystem: codeSystems["SNOMED CT"][0] })
                            .attr({codeSystemName: "SNOMED CT"})
                            .attr({displayName: 'Vital signs'}).parent()
                        .node('statusCode').attr({code: data[0]['status']}).parent()
                        .node('effectiveTime').attr({value: time[0]}).parent()

                        // components loop
                        for (var j = 0; j < entries[1][entries[0][i]]; j++) {
                            organizer.node('component')
                                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                                    .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.27"}).parent()
                                    .node('id').attr({root: data[j]['identifiers'][0]['identifier']}).parent()
                                    .node('code').attr({code: data[j]["vital"]["code"] })
                                        .attr({codeSystem: codeSystems[data[j]["vital"]["code_system_name"]][0]})
                                        .attr({codeSystemName: data[j]["vital"]["code_system_name"]})
                                        .attr({displayName: data[j]["vital"]['name']}).parent()
                                    .node('text')
                                        .node('reference').attr({value: "#vit" + vitLoop[j+(i*3)]}).parent()
                                    .parent()
                                    .node('statusCode').attr({code: data[j]['status']}).parent()
                                    .node('effectiveTime').attr({value: time[0]}).parent()
                                    .node('value').attr({"xsi:type": "PQ"}).attr({value: data[j+(i*entries[1][ entries[0][i == 0 ? i : (i-1)] ]) ]["value"]}).attr({unit: data[j]["unit"]}).parent()
                                    .node('interpretationCode').attr({code: "N"}).attr({codeSystem: "2.16.840.1.113883.5.83"}).parent()
                            
                        }
                    xmlDoc.parent()
                .parent()
            }   
    xmlDoc.parent() // end section
        .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}