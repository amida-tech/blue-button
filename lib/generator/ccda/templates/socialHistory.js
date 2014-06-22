var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");


module.exports = function(data, codeSystems, isCCD, CCDxml) {
     // determining the number of entries
    var entriesArr = [];
    var entries = {};
    for (var i = 0; i < data.length; i++) {
        entriesArr[i] = data[i]["smoking_statuses"][0]["date"][0]["date"].slice(0,4);
        entries[entriesArr[i]] = i + 1;
    }
    var uniqueEntries = entriesArr.filter(function(v,i) { return i == entriesArr.lastIndexOf(v); });

    for (var i = 1; i < uniqueEntries.length; i++) {
        entries[uniqueEntries[i]] = entries[uniqueEntries[i]] - entries[uniqueEntries[i-1]];
    }

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.17", undefined, "29762-2", 
            "2.16.840.1.113883.6.1", undefined, "Social History", "SOCIAL HISTORY", isCCD);

            // entries loop
            for (var i = 0; i < uniqueEntries.length; i++) {
                var timeArr = [];
                for (var k = 0; k < data[i]["smoking_statuses"][0]["date"].length; k++) {
                    var effectiveTime = data[i]["smoking_statuses"][0]["date"][k]["date"].split("-");
                    effectiveTime[2] = effectiveTime[2].slice(0,2);
                    var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
                    timeArr.push(time);
                }
                var organizer = xmlDoc.node('entry').attr({typeCode: "DRIV"})
                                      .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"});
                    organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.78"}).parent() // smoking status observation
                        .node('id').attr({extension: "123456789"}).attr({root: "2.16.840.1.113883.19"}).parent()
                        .node('code')
                            .attr({code: "ASSERTION" })
                            .attr({codeSystem: "2.16.840.1.113883.5.4" }).parent()
                        .node('statusCode').attr({code: 'completed'}).parent()
                        .node('effectiveTime')
                            .node('low').attr({value: timeArr[0]}).parent()
                            .node('high').attr({value: timeArr[1]}).parent()
                        .parent()
                        .node('value').attr({"xsi:type": "CD"})
                                      .attr({code: "8517006"})
                                      .attr({displayName: data[i]["smoking_statuses"]["value"]})
                                      .attr({codeSystem: "2.16.840.1.113883.6.96"}).parent()
                        .parent()
                    .parent()
                    var xmlDoc = libCCDAGen.insertObservation(xmlDoc, "2.16.840.1.113883.10.20.22.4.38", "9b56c25d-9104-45ee-9fa4-e0f3afaa01c1", 
                        "229819007", "2.16.840.1.113883.6.96", "tobacco use and exposure", "#soc1", timeArr, '1 pack per day', i);
                    var xmlDoc = libCCDAGen.insertObservation(xmlDoc, "2.16.840.1.113883.10.20.22.4.38", "45efb604-7049-4a2e-ad33-d38556c9636c", 
                        "229819007", "2.16.840.1.113883.6.96", "tobacco use and exposure", "#soc2", timeArr, 'none', i);
                    var xmlDoc = libCCDAGen.insertObservation(xmlDoc, "2.16.840.1.113883.10.20.22.4.38", "37f76c51-6411-4e1d-8a37-957fd49d2cef", 
                        "160573003", "2.16.840.1.113883.6.96", "Alcohol consumption", "#soc2", timeArr, 'none', i);
            }   
        xmlDoc.parent() // end section
    .parent(); // end clinicalDocument
    return isCCD ? xmlDoc : doc;
}