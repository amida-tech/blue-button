var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

var updateIndication = function(xmlDoc, indication) {
    if (indication) {
        xmlDoc = xmlDoc.node('entryRelationship') // Indication
            .attr({typeCode: "RSON"})
            .node('observation').attr({classCode: "OBS"})
                .attr({moodCode: "EVN"}) 
                .node('templateId')
                    .attr({root: "2.16.840.1.113883.10.20.22.4.19"}).parent();
        xmlDoc = libCCDAGen.id(xmlDoc, indication.identifiers);
        xmlDoc = libCCDAGen.code(xmlDoc, indication.code).parent();
        xmlDoc = xmlDoc.node('statusCode').attr({code: "completed"}).parent();
        xmlDoc = libCCDAGen.effectiveTime(xmlDoc, libCCDAGen.getTimes(indication.date_time));
        xmlDoc = libCCDAGen.value(xmlDoc, indication.value, "CD");
    }
}

var updateDrugVehicle = function(xmlDoc, drugVehicle) {
    if (drugVehicle) {
        var p = xmlDoc.node('participant').attr({typeCode: "CSM"});
        var pr = p.node('participantRole').attr({classCode: "MANU"}); // drug vehicle
        pr.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.24"});
        pr.node('code').attr({
            code: "412307009",
            displayName: "drug vehicle",
            codeSystem: "2.16.840.1.113883.6.96"});
        var pe = pr.node('playingEntity').attr({classCode: "MMAT"});
        libCCDAGen.code(pe, drugVehicle);
        pe.node('name', drugVehicle.name);
    }
}

var administrationAttrs = function(entry) {
    var attrs = {classCode: "SBADM"};
    var status = entry.status;
    if (status === 'Prescribed') {
        attrs.moodCode = 'INT'
    } else if (status === 'Completed') {
        attrs.moodCode = 'EVN';
    }
    return attrs;
}

module.exports = function (data, codeSystems, isCCD, CCDxml) {

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1", "10160-0",
        "2.16.840.1.113883.6.1", "LOINC", "HISTORY OF MEDICATION USE", "MEDICATIONS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var time = libCCDAGen.getTimes(data[i]["date_time"]);
        xmlDoc = xmlDoc.node('entry').attr({typeCode: "DRIV"})
            .node('substanceAdministration').attr(administrationAttrs(data[i]))
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.16"}).parent(); // medication activity
                xmlDoc = libCCDAGen.id(xmlDoc, data[i]["identifiers"]);
                xmlDoc = xmlDoc.node('text', data[i].sig)
                    .node('reference').attr({value: "#MedSec_1"}).parent()
                .parent()
                .node('statusCode').attr({code: 'completed'}).parent();
                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);

                if (data[i].administration && data[i].administration.interval) {
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
                }
                xmlDoc = libCCDAGen.medication_administration(xmlDoc, data[i]["administration"]);

                if (data[i].product.unencoded_name) {

                    xmlDoc = libCCDAGen.consumable(xmlDoc, data[i].product, data[i].product.unencoded_name);    
                } else {
                    xmlDoc = libCCDAGen.consumable(xmlDoc, data[i].product, "");    
                }

                
                xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i].performer, {});

                updateDrugVehicle(xmlDoc, data[i].drug_vehicle);
                updateIndication(xmlDoc, data[i].indication);
    
                xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "REFR"}) // Supply
                    .node('supply').attr({classCode: "SPLY"}).attr({moodCode: "INT"})
                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.17"}).parent();
                        
                        libCCDAGen.id(xmlDoc, data[i].supply && data[i].supply.identifiers);
                        
                        xmlDoc = xmlDoc.node('statusCode').attr({code: "completed"}).parent();
                        if (data[i].supply && data[i].supply.date_time) {
                            xmlDoc = libCCDAGen.effectiveTime(xmlDoc, libCCDAGen.getTimes(data[i].supply.date_time), undefined, "IVL_TS");
                        }
                        if (data[i].supply) {
                            if (data[i].supply.repeatNumber) {
                                xmlDoc = xmlDoc.node('repeatNumber').attr({value: data[i].supply.repeatNumber}).parent();
                            }
                            if (data[i].supply.quantity) {
                                xmlDoc = xmlDoc.node('quantity').attr({value: data[i].supply.quantity}).parent();
                            }
                        }

                        xmlDoc = xmlDoc.node('product');
                            xmlDoc = libCCDAGen.manufacturedProduct(xmlDoc, data[i]["product"], '#MedSec_1', 'MSO');
                        xmlDoc = xmlDoc.parent();
                        xmlDoc = xmlDoc.node('author')

                            if (data[i].supply && data[i].supply.author && data[i].supply.author.date_time) {
                                xmlDoc = libCCDAGen.effectiveTime(xmlDoc, libCCDAGen.getTimes(data[i].supply.author.date_time), 'time');
                            } else {
                                xmlDoc = xmlDoc.node('time').attr({nullFlavor: "UNK"}).parent()
                            }

                            xmlDoc = xmlDoc.node('assignedAuthor');
                                xmlDoc = libCCDAGen.id(xmlDoc, data[i].supply && data[i].supply.author && data[i].supply.author.identifiers);

                                if (data[i].supply && data[i].supply.author && data[i].supply.author.name) {
                                    xmlDoc = xmlDoc.node('assignedPerson');
                                    xmlDoc = libCCDAGen.name(xmlDoc, data[i].supply.author.name);
                                    xmlDoc = xmlDoc.parent()
                                }
                            xmlDoc = xmlDoc.parent()
                        .parent()
                        xmlDoc = libCCDAGen.entryRelationship(xmlDoc, data[i]["instructions"], 'act', 'SUBJ'); // Instructions
                    xmlDoc = xmlDoc.parent()
                .parent();
    
                xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "REFR"}) // Medication Dispense
                    .node('supply').attr({classCode: "SPLY"}).attr({moodCode: "EVN"}) 
                        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.18"}).parent();
                        xmlDoc = libCCDAGen.id(xmlDoc, data[i].dispense && data[i].dispense.identifiers);
                        xmlDoc = xmlDoc.node('statusCode').attr({code: "completed"}).parent();
                        xmlDoc = libCCDAGen.effectiveTime(xmlDoc, time);
                        xmlDoc = xmlDoc.node('product');
                            xmlDoc = libCCDAGen.manufacturedProduct(xmlDoc, data[i]["product"], '#MedSec_1', "MD");
                        xmlDoc = xmlDoc.parent();
                        if (data[i].dispense && data[i].dispense.performer) {
                            xmlDoc = libCCDAGen.performerRevised(xmlDoc, data[i].dispense.performer);
                        }
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
