var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

module.exports = function (data, codeSystems, isCCD, CCDxml) {

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1", "10160-0",
        "2.16.840.1.113883.6.1", "LOINC", "HISTORY OF MEDICATION USE", "MEDICATIONS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        console.log(JSON.stringify(data[i],null,4));




        var time = libCCDAGen.getTimes(data[i]["date_time"]);
        xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"})
            .node('substanceAdministration').attr({classCode: "SBADM"}).attr({moodCode: "EVN"})
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.16"}).parent(); // medication activity
                xmlDoc = libCCDAGen.id(xmlDoc, data[0]["identifiers"]);
                xmlDoc = xmlDoc.node('text', data[i]["product"] ? data[i]["product"]["unencoded_name"] : undefined)
                    .node('reference').attr({value: "#MedSec_1"}).parent()
                .parent()
                .node('statusCode').attr({code: 'completed'}).parent();
                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);
                xmlDoc = xmlDoc.node('effectiveTime')
                    .attr({"xsi:type": "PIVL_TS"})
                    .attr({institutionSpecified: "true"})
                    .attr({operator: "A"});
                    var period;
                    if (period = data[i]["administration"] ? data[i]["administration"]["interval"] ? data[i]["administration"]["interval"]["period"] : undefined : undefined) {
                        xmlDoc = xmlDoc.node('period').attr({value: period["value"]})
                            .attr({unit: period["unit"]}).parent()
                    }
                xmlDoc = xmlDoc.parent()
                xmlDoc = libCCDAGen.medication_administration(xmlDoc, data[i]["administration"]);
                xmlDoc = libCCDAGen.consumable(xmlDoc, data[i]["product"], '#MedSec_1');
                xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i]["performer"], {});
    
                xmlDoc = xmlDoc.node('participant').attr({typeCode: "CSM"})
                    .node('participantRole').attr({classCode: "MANU"}) // drug vehicle
                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.24"}).parent()
                        .node('code')
                            .attr({code: "412307009"})
                            .attr({displayName: "drug vehicle"})
                            .attr({codeSystem: "2.16.840.1.113883.6.96"}).parent()
                        .node('playingEntity').attr({classCode: "MMAT"});
                            xmlDoc = libCCDAGen.code(xmlDoc, data[i]["drug_vehicle"] ? data[i]["drug_vehicle"] : undefined).parent();
                            xmlDoc = xmlDoc.node('name', data[i]["drug_vehicle"] ? data[i]["drug_vehicle"]["name"] : "").parent()
                        .parent()
                    .parent()
                .parent()
                .node('entryRelationship') // Indication
                    .attr({typeCode: "RSON"})
                    .node('observation').attr({classCode: "OBS"})
                        .attr({moodCode: "EVN"}) 
                        .node('templateId')
                            .attr({root: "2.16.840.1.113883.10.20.22.4.19"}).parent();
                        xmlDoc = libCCDAGen.id(xmlDoc, data[i]["indication"] ? data[i]["indication"]["identifiers"] : undefined);
                        xmlDoc = xmlDoc.node('code')
                            .attr({code: "404684003"})
                            .attr({displayName: "Finding"})
                            .attr({codeSystem: codeSystems["SNOMED CT"][0]})
                            .attr({codeSystemName: "SNOMED CT"}).parent()
                        .node('statusCode')
                            .attr({code: "completed"}).parent();
                        xmlDoc = libCCDAGen.effectiveTime(xmlDoc, libCCDAGen.getTimes(data[i]["indication"] ? data[i]["indication"]["date_time"] : time));
                        xmlDoc = libCCDAGen.value(xmlDoc, data[i]["indication"] ? data[i]["indication"]["value"] : undefined, "CD");
                    xmlDoc = xmlDoc.parent()
                .parent()
    
                .node('entryRelationship').attr({typeCode: "REFR"}) // Supply
                    .node('supply').attr({classCode: "SPLY"}).attr({moodCode: "INT"})
                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.17"}).parent()
                        .node('id').attr({nullFlavor: "NI"}).parent()
                        .node('statusCode').attr({code: "completed"}).parent();
                        xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time, undefined, "IVL_TS");
                        xmlDoc = xmlDoc.node('repeatNumber').attr({value: "1"}).parent()
                        .node('quantity').attr({value: "75"}).parent()
                        .node('product');
                            xmlDoc = libCCDAGen.manufacturedProduct(xmlDoc, data[i]["product"], '#MedSec_1', 'MSO');
                        xmlDoc = xmlDoc.parent();
                        xmlDoc = libCCDAGen.performerRevised(xmlDoc, undefined, {
                            "id": "2.16.840.1.113883.19.5.9999.456",
                            "extension": "2981823",
                            "addr": "generic",
                            "tel": undefined,
                            "repOrg": undefined,
                            "assignedP": undefined,
                            "templateId_in": undefined
                        });
                        xmlDoc = xmlDoc.node('author')
                            .node('time').attr({nullFlavor: "UNK"}).parent()
                            .node('assignedAuthor');
                                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["product"] ? data[i]["product"]["identifiers"] : undefined);
                                xmlDoc = xmlDoc.node('addr').attr({nullFlavor: "UNK"}).parent()
                                .node('telecom').attr({nullFlavor: "UNK"}).parent()
                                .node('assignedPerson')
                                    .node('name')
                                        .node('prefix', "Dr.").parent()
                                        .node('given', "Henry").parent()
                                        .node('family', 'Seven').parent()
                                    .parent()
                                .parent()
                            .parent()
                        .parent()
                        xmlDoc = libCCDAGen.entryRelationship(xmlDoc, data[i]["instructions"], 'act', 'SUBJ'); // Instructions
                    xmlDoc = xmlDoc.parent()
                .parent();
                // xmlDoc = libCCDAGen.entryRelationship(xmlDoc, data[i]["supply"], 'supply', undefined);
    
                xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "REFR"}) // Medication Dispense
                    .node('supply').attr({classCode: "SPLY"}).attr({moodCode: "EVN"}) 
                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.18"}).parent();
                        xmlDoc = libCCDAGen.id(xmlDoc, data[i]["dispense"] ? data[i]["dispense"]["identifiers"] : undefined);
                        xmlDoc = xmlDoc.node('statusCode').attr({code: "completed"}).parent();
                        xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);
                        xmlDoc = xmlDoc.node('repeatNumber').attr({value: "1"}).parent()
                        .node('quantity').attr({value: "75"}).parent()
                        .node('product');
                            xmlDoc = libCCDAGen.manufacturedProduct(xmlDoc, data[i]["product"], '#MedSec_1', "MD");
                        xmlDoc = xmlDoc.parent();
                        xmlDoc = libCCDAGen.performerRevised(xmlDoc, undefined, {
                            "id": "2.16.840.1.113883.19.5.9999.456",
                            "extension": "2981823",
                            "addr": "generic",
                            "tel": undefined,
                            "repOrg": "generic",
                            "assignedP": "generic",
                            "templateId_in": undefined
                        });
                    xmlDoc = xmlDoc.parent()
                .parent()
                xmlDoc = libCCDAGen.precondition(xmlDoc, data[i]["precondition"]);
            xmlDoc = xmlDoc.parent()
        .parent();
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument

    return isCCD ? xmlDoc : doc;
}
