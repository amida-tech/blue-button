var libxmljs = require("libxmljs");
var libCCDAgen = require("../lib/templating_functions.js");
var shared = require("../../../parser/ccda/shared");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes["codes"];


var observationAttrs = function(entry) {
    var attrs = {
        classCode: "OBS",
        moodCode: "EVN"
    }
    if (entry.observation.hasOwnProperty('negation_indicator')) {
        attrs.negationInd = entry.observation.negation_indicator.toString();
    }
    return attrs;
}

var updateReaction = function(xmlDoc, reaction, i) { // Allergy reaction observation
    xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "MFST", inversionInd: "true"});

    xmlDoc = xmlDoc.node('observation').attr({classCode: "OBS", moodCode: "EVN"});
                
    xmlDoc = xmlDoc.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.9"}).parent();

    xmlDoc = xmlDoc.node('code').attr({nullFlavor: "NA"}).parent();
    xmlDoc = xmlDoc.node('text').node('reference').attr({value: "#reaction" + (i + 1)}).parent().parent();
    xmlDoc = xmlDoc.node('statusCode').attr({code: 'completed'}).parent();
    xmlDoc = libCCDAgen.effectiveTime(xmlDoc, libCCDAgen.getTimes(reaction["date_time"]));
    xmlDoc = libCCDAgen.value(xmlDoc, reaction.reaction, "CD");
    xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}) // reaction severity observation
                .attr({inversionInd: "true"})
                .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                    .node('templateId')
                        .attr({root: "2.16.840.1.113883.10.20.22.4.8"}).parent();
    xmlDoc = libCCDAgen.code(xmlDoc, undefined, sec_entries_codes["SeverityObservation"]).parent();
    xmlDoc = xmlDoc.node('text')
                        .node('reference').attr({value: "#severity" + (i + 4)}).parent()
                    .parent()
                    .node('statusCode')
                        .attr({code: 'completed'}).parent();
    var dis = reaction.severity;
    if (dis) {
        xmlDoc = libCCDAgen.value(xmlDoc, dis.code, "CD");
        xmlDoc = libCCDAgen.code(xmlDoc, dis.interpretation, undefined, 'interpretationCode').parent();
    }
    xmlDoc = xmlDoc.parent().parent().parent().parent();
}

var updateReactions = function(xmlDoc, entry) { // Allergy reaction observation
    if (entry.observation && entry.observation.reactions) {
        var reactions = entry.observation.reactions;
        var n = reactions.length;
        for (var i=0; i<n; ++i) {
            updateReaction(xmlDoc, reactions[i], i);
        }
    }
}

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    // create a new xml document and generate the header
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAgen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1",
        "48765-2", "2.16.840.1.113883.6.1", undefined, undefined, "ALLERGIES, ADVERSE REACTIONS, ALERTS", isCCD);

    // Now loop over each entry in the data set
    for (var i = 0; i < data.length; i++) {
        var time = libCCDAgen.getTimes(data[i]["date_time"]);

        var xmlDoc = xmlDoc.node('entry')
            .attr({typeCode: "DRIV"})
            .node('act')
                .attr({classCode: "ACT"})
                .attr({moodCode: "EVN"});
                    // var comment = new libxmljs.Comment(doc, "Allergy problem act");
                    // comment = comment.text();
                    // xmlDoc = xmlDoc.node(comment);
                xmlDoc = xmlDoc.node('templateId') // allergy problem act
                    .attr({root: "2.16.840.1.113883.10.20.22.4.30"}).parent(); 
                xmlDoc = libCCDAgen.id(xmlDoc, data[i].identifiers);
                xmlDoc = libCCDAgen.code(xmlDoc, undefined, 
                    sec_entries_codes["AllergiesSection"]).parent();
                xmlDoc = xmlDoc.node('statusCode').attr({code: 'active'}).parent();

                if (data[i].date_time) {
                    xmlDoc = libCCDAgen.effectiveTime(xmlDoc, libCCDAgen.getTimes(data[i].date_time));
                }


                xmlDoc = xmlDoc.node('entryRelationship') // allergy observation
                    .attr({typeCode: "SUBJ"})
                    .attr({inversionInd: "true"});
                    
                    xmlDoc = xmlDoc.node('observation').attr(observationAttrs(data[i]));
                        //.attr({classCode: "OBS"})
                        //.attr({moodCode: "EVN"});
                        
                        xmlDoc = xmlDoc.node('templateId')
                            .attr({root: "2.16.840.1.113883.10.20.22.4.7"}).parent(); // allergy intolerance observation
                        if (data[i].observation) {
                            if (data[i].observation.identifiers) {
                                xmlDoc = libCCDAgen.id(xmlDoc, data[i].observation.identifiers);    
                            }
                        }
                        
                        xmlDoc = libCCDAgen.code(xmlDoc, undefined, 
                            sec_entries_codes["AllergyObservation"]).parent();
                        xmlDoc = xmlDoc.node('statusCode').attr({code: 'completed'}).parent();
                        if (data[i].observation) {
                            if (data[i].observation.date_time) {
                                xmlDoc = libCCDAgen.effectiveTime(xmlDoc, libCCDAgen.getTimes(data[i].observation.date_time));        
                            }
                            
                        }

                        if (data[i].observation) {
                            if (data[i].observation.intolerance) {
                                xmlDoc = libCCDAgen.value(xmlDoc, data[i]["observation"]["intolerance"], "CD", (i + 1));        
                            }
                        }
                        

                        if (data[i].observation && data[i].observation.allergen) {
                            xmlDoc = xmlDoc.node('participant')
                                .attr({typeCode: "CSM"})
                                .node('participantRole')
                                    .attr({classCode: "MANU"})
                                    .node('playingEntity')
                                        .attr({classCode: "MMAT"});
                                        xmlDoc = libCCDAgen.code(xmlDoc, data[i]["observation"]["allergen"]);
                                            xmlDoc = xmlDoc.node('originalText')
                                                .node('reference').attr({value: "#reaction" + (i + 1)}).parent()
                                            .parent()
                                        .parent()
                                    .parent()
                                .parent()
                            .parent()
                        } else {
                            xmlDoc = xmlDoc.node('participant').attr({nullFlavor: "UNK"});
                        }
    
                        // entryRelationship's loop
                        xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"}) 
                            .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Allergy status xmlDoc
                                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.28"}).parent();
                                xmlDoc = libCCDAgen.code(xmlDoc, undefined, 
                                    sec_entries_codes["AllergyStatusObservation"]).parent();
                                xmlDoc = xmlDoc.node('statusCode')
                                    .attr({code: 'completed'}).parent();
                                if (data[i].observation) {
                                    if (data[i].observation.status) {
                                        xmlDoc = libCCDAgen.value(xmlDoc, data[i].observation.status, "CE");        
                                    }
                                    
                                }
                            xmlDoc = xmlDoc.parent()
                        .parent();

<<<<<<< HEAD
                       



                        xmlDoc = xmlDoc.node('entryRelationship')// Allergy reaction observation 
                            .attr({typeCode: "MFST"}).attr({inversionInd: "true"})
                            .node('observation').attr({classCode: "OBS"})
                                .attr({moodCode: "EVN"}) 
                                .node('templateId')
                                    .attr({root: "2.16.840.1.113883.10.20.22.4.9"}).parent()
                                //.node('id')
                                //    .attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
                                .node('code').attr({nullFlavor: "NA"}).parent()
                                .node('text')
                                    .node('reference')
                                        .attr({value: "#reaction" + (i + 1)}).parent()
                                .parent()
                                .node('statusCode').attr({code: 'completed'}).parent();

                                if (data[i].observation) {
                                    if (data[i].observation.reactions) {
                                        xmlDoc = libCCDAgen.effectiveTime(xmlDoc, libCCDAgen.getTimes(data[i]["observation"]["reactions"] ? data[i]["observation"]["reactions"][0]["date_time"] : time));          
                                    }
                                    
                                }
                                
                                if (data[i].observation) {
                                    if (data[i].observation.reactions) {
                                    xmlDoc = libCCDAgen.value(xmlDoc, libCCDAgen.attempt(data, i, 'data[i]["observation"]["reactions"][0]["reaction"]'), "CD");        
                                    }
                                }
                                
                                xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}) // reaction severity observation
                                    .attr({inversionInd: "true"})
                                    .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                                        .node('templateId')
                                            .attr({root: "2.16.840.1.113883.10.20.22.4.8"}).parent();
                                        xmlDoc = libCCDAgen.code(xmlDoc, undefined, sec_entries_codes["SeverityObservation"]).parent();
                                        xmlDoc = xmlDoc.node('text')
                                            .node('reference').attr({value: "#severity" + (i + 4)}).parent()
                                        .parent()
                                        .node('statusCode')
                                            .attr({code: 'completed'}).parent();
                                        xmlDoc = libCCDAgen.value(xmlDoc, libCCDAgen.attempt(data, i, 'data[i]["observation"]["reactions"][0]["severity"]["code"]'), "CD");
                                        xmlDoc = xmlDoc.node('interpretationCode').attr({code: "S"})
                                            .attr({displayName: 'Suceptible'})
                                            .attr({codeSystem: "2.16.840.1.113883.1.11.78"})
                                            .attr({codeSystemName: "Observation Interpretation"}).parent()
                                    .parent()
                                .parent()
                            xmlDoc = xmlDoc.parent()
                        .parent();
=======
                        updateReactions(xmlDoc, data[i]);
>>>>>>> master
                        xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}) // severity observation
                            .attr({inversionInd: "true"})
                            .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                                .node('templateId')
                                    .attr({root: "2.16.840.1.113883.10.20.22.4.8"}).parent();
                                xmlDoc = libCCDAgen.code(xmlDoc, undefined, sec_entries_codes["SeverityObservation"]).parent();
                                xmlDoc = xmlDoc.node('text')
                                    .node('reference').attr({value: "#severity" + (i + 1)}).parent()
                                .parent()
                                .node('statusCode').attr({code: 'completed'}).parent();
                                xmlDoc = libCCDAgen.value(xmlDoc, libCCDAgen.attempt(data, i, 'data[i]["observation"]["severity"]["code"]'), "CD");
                                var dSev = data[i].observation.severity;
                                if (dSev) {
                                    xmlDoc = libCCDAgen.code(xmlDoc, dSev.interpretation, undefined, 'interpretationCode').parent();
                                }
                    xmlDoc = xmlDoc.parent().parent().parent().parent().parent();
    }
    xmlDoc = xmlDoc.parent() // end section
    .parent(); // end clinicalDocument (or component)
    return isCCD ? xmlDoc : doc;
}
