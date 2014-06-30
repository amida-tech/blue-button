var XDate=require("xdate");

var getCodeSystems = function() {
    var ret = {
        "LOINC": ["2.16.840.1.113883.6.1", "8716-3"], 
        "SNOMED CT": ["2.16.840.1.113883.6.96", "46680005"], 
        "RXNORM": "2.16.840.1.113883.6.88",
        "ActCode": "2.16.840.1.113883.5.4", 
        "CPT-4": "2.16.840.1.113883.6.12", 
        "CVX": "2.16.840.1.113883.12.292", 
        "HL7ActCode": "2.16.840.1.113883.5.4"
    }
    return ret;
}

var codeSystems = getCodeSystems();

// Utility function for determining the size/length of objects
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// insert an observation for the "social_history" section
var insertObservation = function(xmlDoc, templateId, id, code, codeSystem, displayName, reference, timeArr, value, i) {
    return xmlDoc.node('entry').attr({typeCode: "DRIV"})
            .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // social history observation
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.38"}).parent()
                .node('id').attr({root: id}).parent()
                .node('code')
                    .attr({code: "229819007" })
                    .attr({codeSystem: "2.16.840.1.113883.6.96" })
                    .attr({displayName: displayName})
                    .node('originalText')
                        .node('reference').attr({value: "#soc" + (i+1)}).parent()
                    .parent()
                .parent()
                .node('statusCode').attr({code: 'completed'}).parent()
                .node('effectiveTime')
                    .node('low').attr({value: timeArr[0]}).parent()
                    .node('high').attr({value: timeArr[2]}).parent()
                .parent()
                .node('value', '1 pack per day').attr({"xsi:type": "ST"}).parent()
            .parent()
        .parent()
}

// Templates the header for a specific section
var header = function(doc, templateIdOptional, templateIdRequired, code, codeSystem, codeSystemName, displayName, title, isCCD) {
    if (!isCCD) {
        xmlDoc = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
                 .attr({xmlns: "urn:hl7-org:v3"}).attr({"xmlns:cda": "urn:hl7-org:v3"}).attr({"xmlns:sdtc": "urn:hl7-org:sdtc"});
    } else {
        xmlDoc = doc.node('component');
    }
    
        xmlDoc = xmlDoc.node('section')
            .node('templateId').attr({root: templateIdOptional}).parent()

            if (templateIdRequired != undefined) {
                xmlDoc = xmlDoc.node('templateId').attr({root: templateIdRequired}).parent();
            }

            if (codeSystemName != undefined) {
                xmlDoc = xmlDoc.node('code').attr({code: code })
                    .attr({codeSystem: codeSystem})
                    .attr({codeSystemName: codeSystemName})
                    .attr({displayName: displayName}).parent();
            } else if (codeSystemName == undefined && displayName == undefined) {
                xmlDoc = xmlDoc.node('code').attr({code: code })
                    .attr({codeSystem: codeSystem}).parent();
            } else {
                xmlDoc = xmlDoc.node('code').attr({code: code })
                    .attr({codeSystem: codeSystem})
                    .attr({codeSystemName: codeSystemName})
                    .attr({displayName: displayName}).parent();
            }
            xmlDoc = xmlDoc.node('title', title).parent()
            .node('text').parent()
    return xmlDoc;
}

var tel = function(xmlDoc, tel) {
    if (tel) {
        return xmlDoc.node('telecom').attr({value: checkObj(tel, tel[0]["number"]) }).attr({use: "HP"}).parent()
    } else {
        return xmlDoc.node('telecom').attr({nullFlavor: "UNK"}).parent();
    }
}

var name = function(xmlDoc, name) {
    if (name == undefined) {
        return xmlDoc.node('name').attr({nullFlavor: "UNK"}).parent();
    } else {
        return xmlDoc.node('name').attr({use: "L"})
                .node('given', name["first"]).parent()
                .node('given', name["middle"] == undefined ? "" : name["middle"][0]).parent()
                .node('family', name["last"]).parent()
            .parent()   
    }
     
}

var addr = function(xmlDoc, addr, birthplace) {
    if (addr == undefined) {
        xmlDoc = xmlDoc.node('addr').attr({nullFlavor: "UNK"}).parent()
    } else if (addr == "generic") {
        xmlDoc = xmlDoc.node('addr')
            .node('streetAddressLine', '1001 Village Avenue').parent()
            .node('city', 'Portland').parent()
            .node('state', 'OR').parent()
            .node('postalCode', '99123').parent()
            .node('country', 'US').parent()
        .parent()
    } else if (addr[0] != undefined) {    
        xmlDoc = xmlDoc.node('addr');
            if (!birthplace && addr[0]["streetLines"] !== undefined) {
                xmlDoc = xmlDoc.node('streetAddressLine', addr[0]["streetLines"][0]).parent()
            }
            xmlDoc = xmlDoc.node('city', addr[0]["city"]).parent()
            .node('state', addr[0]["state"]).parent()
            .node('postalCode', addr[0]["zip"]).parent()
            .node('country', addr[0]["country"]).parent()
        .parent()    
    } else {
        xmlDoc = xmlDoc.node('addr');
            if (!birthplace) {
                xmlDoc = xmlDoc.node('streetAddressLine', addr["streetLines"][0]).parent()
            }
            xmlDoc = xmlDoc.node('city', addr["city"]).parent()
            .node('state', addr["state"]).parent()
            .node('postalCode', addr["zip"]).parent()
            .node('country', addr["country"]).parent()
        .parent()    
    }
    return xmlDoc;
}

// var performer = function(xmlDoc, specified) {
//     xmlDoc = xmlDoc.node('performer');
//         xmlDoc = xmlDoc.node('assignedEntity');
//             xmlDoc = id(xmlDoc, specified["id"], specified["extension"]);
//             xmlDoc = addr(xmlDoc, specified["addr"]);
//             xmlDoc = tel(xmlDoc, specified["tel"]);
//             xmlDoc = assignedPerson(xmlDoc, specified["assignedP"]);
//             xmlDoc = representedOrganization(xmlDoc, specified["repOrg"]);
//         xmlDoc = xmlDoc.parent()
//     .parent();
//     return xmlDoc;
// }

var performerRevised = function(xmlDoc, performer, spec) {
    if (performer) {
        var extension = performer["identifiers"] ? performer["identifiers"][0]["identifier_type"] : "UNK";
        var idAttr = performer["identifiers"] ? performer["identifiers"][0]["identifier"] : "UNK";
        var telecom = performer["telecom"];
    }

        xmlDoc = xmlDoc.node('performer')
            .node('assignedEntity');
                xmlDoc = performer ? id(xmlDoc, idAttr, extension) : id(xmlDoc, spec["id"], spec["extension"]);
                xmlDoc = performer ? addr(xmlDoc, performer["address"]) : addr(xmlDoc, spec["addr"]);
                xmlDoc = performer ? tel(xmlDoc, telecom) : tel(xmlDoc, spec["tel"]);
                xmlDoc = performer ? assignedPerson(xmlDoc, performer["name"]) : assignedPerson(xmlDoc, spec["assignedP"]);
                xmlDoc = performer ? representedOrganization(xmlDoc, performer["organization"]) : representedOrganization(xmlDoc, spec["repOrg"]);
            xmlDoc = xmlDoc.parent()
        .parent();
        return xmlDoc;
}

var assignedPerson = function(xmlDoc, assignedPerson) {
    if (assignedPerson == "generic") {
        xmlDoc = xmlDoc.node('assignedPerson')
            .node('name')
                .node('prefix', "Dr.").parent()
                .node('given', "Henry").parent()
                .node('family', 'Seven').parent()
            .parent()
        .parent()
    } else if (assignedPerson == undefined) {
        return xmlDoc;
    } else {
        xmlDoc = xmlDoc.node('assignedPerson')
            .node('name')
                .node('given', assignedPerson[0]["first"]).parent()
                .node('family', assignedPerson[0]["last"]).parent()
            .parent()
        .parent();
    }
    return xmlDoc;
}

var representedOrganization = function(xmlDoc, performer) {
    if (performer && performer != "generic") {
        xmlDoc = xmlDoc.node('representedOrganization')
            .node('id').attr( {root: performer[0]["identifiers"][0]["identifier"]} ).parent()
            .node('name', performer[0]["name"]).parent();
            xmlDoc = tel(xmlDoc, performer[0]["telecom"]);
            xmlDoc = addr(xmlDoc, performer[0]["address"]);       
        xmlDoc = xmlDoc.parent();
    } else if (performer == "generic") {
        xmlDoc = xmlDoc.node('representedOrganization')
            .node('id').attr( {root: "2.16.840.1.113883.19.5.9999.1393"}).parent()
            .node('name', "Community Health and Hospitals").parent();
            xmlDoc = tel(xmlDoc, undefined);
            xmlDoc = addr(xmlDoc, undefined);       
        xmlDoc = xmlDoc.parent();
    }
    return xmlDoc;
}

// get the times/dates for the value attribtue of effectiveTime
// @return an array of dates, each date having two entries corresponding
// to two different date formats: yyyymmdd or yyyymm
// for example: [19991101, 199911]
var getTimes = function(date) {
    if (date != undefined) {
        var timeArr = [];
        for (var i = 0; i < date.length; i++) {
            var effectiveTime = (new XDate(date[i]["date"])).toString("u").split("-");
            effectiveTime[2] = effectiveTime[2].slice(0,2);
            var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
            timeArr.push(time);
            timeArr.push(effectiveTime[0] + effectiveTime[1]);
        }
        return timeArr;
    } else {
        return ["UNK", "UNK"];
    }
}

// template for the consumable/manufacturedProduct section
// used in: medication information and immunization medication information
var consumable = function(xmlDoc, data, i, ref, templateId) {
    xmlDoc = xmlDoc.node('consumable');
        xmlDoc = manufacturedProduct(xmlDoc, data, i, ref, templateId);
    xmlDoc = xmlDoc.parent();
    return xmlDoc;
}

// part of the consumable template function.
var manufacturedProduct = function(xmlDoc, data, i, ref) {
    xmlDoc = xmlDoc.node('manufacturedProduct').attr({classCode: "MANU"}) // medication information
        .node('templateId').attr({root: '2.16.840.1.113883.10.20.22.4.23'}).parent();
        if (data[i]["product"]) {
            xmlDoc = xmlDoc.node('id').attr(data[i]["product"]["identifiers"] == undefined ? {nullFlavor: "UNK"} : {root: data[i]["product"]["identifiers"]["identifier"]}).parent()
            .node('manufacturedMaterial');
                xmlDoc = code(xmlDoc, data[i]["product"]["product"]);
                    xmlDoc = xmlDoc.node('originalText')
                        .node('reference').attr({value: ref}).parent()
                    .parent();
                xmlDoc = translation(xmlDoc, data[i]["product"]["product"] ? data[i]["product"]["product"]["translations"] : undefined);
            xmlDoc = xmlDoc.parent();
            if (data[i]["product"]["lot_number"] !== undefined) {
                xmlDoc = xmlDoc.node('lotNumberText', data[i]["product"]["lot_number"]).parent();
            }
            xmlDoc = xmlDoc.parent()
            .node('manufacturerOrganization')
                .node('name', data[i]["product"]["manufacturer"]).parent()
            .parent()
        .parent();
        } else {
            xmlDoc = xmlDoc.node('id').attr({nullFlavor: "UNK"}).parent()
                .node('manufacturedMaterial');
                    xmlDoc = code(xmlDoc, data[i]["product"]);
                    xmlDoc = xmlDoc.node('originalText')
                        .node('reference').attr({value: ref}).parent()
                    .parent();
                    xmlDoc = translation(xmlDoc, data[i]["product"]);
                xmlDoc = xmlDoc.parent()
            .parent()
            .node('manufacturerOrganization')
                .node('name', "UNK").parent()
            .parent()
        .parent();
        }
        
    return xmlDoc;
}

var entryRelationship = function(xmlDoc, data, type, i, j, code, subsection) {
    if (type == 'act') {
        xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
            .node('act').attr({classCode: "ACT"}).attr({moodCode: "INT"})
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.20"}).parent()
                .node('code').attr(code ? {code: code} : {code: "171044003"})
                     .attr({codeSystem: "2.16.840.1.113883.6.96"})
                     .attr({displayName: "immunization education"}).parent()
                .node('text', 'label in spanish')
                    .node('reference').attr({value: "#MedSec_1"}).parent()
                .parent()
                .node('statusCode').attr({code: "completed"}).parent()
            .parent()
        .parent()
        return xmlDoc;
    } else if (type == 'observation') {
        xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
            .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // Severity Observation
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.8"}).parent()
                .node('code').attr({code: "SEV" })
                .attr({displayName: "Severity Observation"})
                .attr({codeSystem: "2.16.840.1.113883.5.4" })
                .attr({codeSystemName: "ActCode" }).parent()
                .node('text')
                    .node('reference').attr({value: "#severity" + (subsection == 1.1 ? (j+ 4 + i) : ((i == 0) ? (j + i + 2) : (j + i + 1)) ) }).parent()
                .parent()
                .node('statusCode').attr({code: 'completed'}).parent()
                .node('value')
                    .attr({"xsi:type": "CD"})
                    .attr({code: code})
                    .attr({displayName: (subsection == 1.1 ? data[j]["reaction"] == undefined ? "UNK" : data[j]["reaction"][0]["severity"] : data[j]["reaction"] == undefined ? "UNK" : data[i]["reaction"][0]["reaction"]["name"]) })
                    .attr({codeSystem: "2.16.840.1.113883.6.96"})
                    .attr({codeSystemName: "SNOMED CT" }).parent()
                .node('interpretationCode')
                    .attr({code: (subsection == 1.1 ? "S" : "N") })
                    .attr({displayName: (subsection == 1.1 ? 'Susceptible' : "Normal")})
                    .attr({codeSystem: "2.16.840.1.113883.1.11.78"})
                    .attr({codeSystemName: "Observation Interpretation" }).parent()
            .parent()
        .parent()
        return xmlDoc;
    }
}

var substanceAdministration = function(xmlDoc, data, i, refSBADM, refCONS, templIdSBADM, templIdCONS) {
    var timeArr = getTimes(data[i]["date"]);
    xmlDoc = xmlDoc.node('substanceAdministration').attr({classCode: "SBADM"}).attr({moodCode: "EVN"}).attr({negationInd: "false"})
        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.52"}).parent();
        xmlDoc = id(xmlDoc, data[i]["identifiers"]);
        xmlDoc = xmlDoc.node('text')
            .node('reference').attr({value: refSBADM}).parent()
        .parent()
        .node('statusCode').attr({code: 'completed'}).parent()
        .node('effectiveTime').attr({"xsi:type": "IVL_TS" }).attr({value: timeArr[0]}).parent();
        xmlDoc = routeCode(xmlDoc, data[i]["administration"]);
        xmlDoc = doseQuantity(xmlDoc, data[i]["administration"]);
        xmlDoc = consumable(xmlDoc, data, i, refCONS, templIdCONS);
        xmlDoc = performerRevised(xmlDoc, data[i]["performer"], {});
    return xmlDoc;
}

var id = function(xmlDoc, id, ext) {
    if (id) {
        if (ext) {
            return xmlDoc.node('id').attr({root: checkObj(id, id[0]["identifier"]) })
                            .attr({extension: checkObj(ext, ext[0]["identifier_type"]) }).parent() 
        } else {
            return xmlDoc.node('id').attr({root: checkObj(id, id[0]["identifier"]) }).parent()
        }
    } else {
        return xmlDoc.node('id').attr({nullFlavor: "UNK"}).parent();
    }
}

var checkObj = function(tag, objTag) {
    return typeof tag === 'object' ? objTag : tag; 
}


var routeCode = function(xmlDoc, administration) {
    if (administration == undefined) {
        return xmlDoc.node('routeCode').attr({nullFlavor: "UNK"}).parent()
    } else if (administration["body_site"] != undefined) {
        return xmlDoc.node('routeCode').attr({code: administration["body_site"]['code']})
                              .attr({codeSystem: "2.16.840.1.113883.3.26.1.1"})
                              .attr({codeSystemName: administration["body_site"]["code_system_name"]})
                              .attr({displayName: administration["body_site"]["name"]}).parent();
    } else if (administration["route"] != undefined) {
        return xmlDoc.node('routeCode').attr({code: administration['route']['code']})
                              .attr({codeSystem: "2.16.840.1.113883.3.26.1.1"})
                              .attr({codeSystemName: administration["route"]["code_system_name"]})
                              .attr({displayName: administration["route"]["name"]}).parent()
    } else {
        return xmlDoc;
    }
}

var doseQuantity = function(xmlDoc, administration) {
    if (administration !== undefined) {
        if (administration["body_site"] !== undefined && administration["body_site"]["dose"] != undefined) {
            return xmlDoc.node('doseQuantity').attr({value: administration["body_site"]["dose"]["value"]})
                                 .attr({unit: administration["body_site"]["dose"]["unit"]}).parent();
        } else if (administration["dose"] != undefined) {
            return xmlDoc.node('doseQuantity').attr({value: administration["dose"]["value"]})
                                .attr({unit: administration["dose"]["unit"]}).parent();
        }
    } else {
        return xmlDoc.node('doseQuantity').attr({nullFlavor: "UNK"}).parent();
    } 
    return xmlDoc;
}

var medication_administration = function(xmlDoc, administration) {
    if (administration == undefined) {
        return xmlDoc.node('routeCode').attr({nullFlavor: "UNK"}).parent()
            .node('doseQuantity').attr({nullFlavor: "UNK"}).parent()
            .node('rateQuantity').attr({nullFlavor: "UNK"}).parent()
            .node('maxDoseQuantity').attr({nullFlavor: "UNK"})
                .node('numerator').attr({nullFlavor: "UNK"}).parent()
                .node('denominator').attr({nullFlavor: "UNK"}).parent()
            .parent()
             .node('administrationUnitCode').attr({nullFlavor: "UNK"}).parent()
    } else {
        xmlDoc = routeCode(xmlDoc, administration); 
        xmlDoc = doseQuantity(xmlDoc, administration);
        xmlDoc = rateQuantity(xmlDoc, administration["rate"]);
        xmlDoc = xmlDoc.node('maxDoseQuantity').attr({nullFlavor: "UNK"})
            .node('numerator').attr({nullFlavor: "UNK"}).parent()
            .node('denominator').attr({nullFlavor: "UNK"}).parent()
        .parent();
        if (administration["form"] != undefined) {
            xmlDoc = xmlDoc.node('administrationUnitCode').attr({code: administration["form"]["code"]})
                                         .attr({displayName: administration["form"]["name"]})
                                         .attr({codeSystem: "2.16.840.1.113883.3.26.1.1"})
                                         .attr({codeSystemName: administration["form"]["code_system_name"]}).parent();
        }
        return xmlDoc;
    }
}

var code = function(xmlDoc, entity) {
    if (entity == undefined) {
        return xmlDoc.node('code').attr({nullFlavor: "UNK"});
    } else {
        return xmlDoc.node('code')
                    .attr({code: entity["code"] })
                    .attr({displayName: entity["name"]})
                    .attr(entity["code_system_name"] == undefined ? {codeSystem: codeSystems["SNOMED CT"][0]} : {codeSystem: codeSystems[entity["code_system_name"]]})
                    .attr({codeSystemName: entity["code_system_name"]})   
    }
    
}

var rateQuantity = function(xmlDoc, rate) {
    if (rate == undefined) {
        return xmlDoc.node('rateQuantity').attr({nullFlavor: "UNK"}).parent();
    } else {
        return xmlDoc.node('rateQuantity').attr({value: rate["value"]})
                                 .attr({unit: rate["unit"]}).parent()
    }
}

var immunization_medication_information = function(xmlDoc, product) {
    return xmlDoc.node('manufacturedProduct').attr({classCode: "MANU"}) // medication information
        .node('templateId').attr({root: templateId}).parent()
        .node('manufacturedMaterial')
            .node('code').attr({code: data[i]["product"]["product"]["code"]})
                         .attr({codeSystem: codeSystems[data[i]["product"]["product"]["code_system_name"]]})
                         .attr({displayName: data[i]["product"]["product"]["name"]})
                         .attr({codeSystemName: data[i]["product"]["product"]["code_system_name"]})
                .node('originalText')
                    .node('reference').attr({value: ref}).parent()
                .parent()
                .node('translation').attr({code: data[i]["product"]["product"]["translations"][0]["code"]})
                                    .attr({displayName: data[i]["product"]["product"]["translations"][0]["name"]})
                                    .attr({codeSystemName: data[i]["product"]["product"]["translations"][0]["code_system_name"]})
                                    .attr({codeSystem: codeSystems[data[i]["product"]["product"]["translations"][0]["code_system_name"]]}).parent()
            .parent()
            .node('lotNumberText', data[i]["product"]["lot_number"]).parent()
        .parent()
        .node('manufacturerOrganization')
            .node('name', data[i]["product"]["manufacturer"]).parent()
        .parent()
    .parent()
}

/* 
Returns the number of entries in a data set for a specific section, in order to know how many times to 
loop over the data.

@returns -
entries[0] -- array of unique entries
entries[1] -- object which maps entries to number of entries
*/
var getNumEntries = function(data) {
    var entriesArr = [];
    var entries = {};
    for (var i = 0; i < data.length; i++) {
        entriesArr[i] = data[i]["date"] !== undefined ? (new XDate(data[i]["date"][0]["date"])).toString("u").slice(0,4) : "UNK";
        entries[entriesArr[i]] = entries[entriesArr[i]] !== undefined ?  entries[entriesArr[i]] + 1 : 1;
    }
    var uniqueEntries = entriesArr.filter(function(v,i) { return i == entriesArr.lastIndexOf(v); });
    return [uniqueEntries, entries];
}

var getObjLength = function(obj) {
    return Object.size(obj);
}

var maritalStatusCode = function(xmlDoc, marriage_status) {
    if (marriage_status == undefined) {
        return xmlDoc.node('maritalStatusCode').attr({nullFlavor: "UNK"}).parent();
    } else {
        return xmlDoc.node('maritalStatusCode').attr({code: marriage_status.substring(0,1)})
            .attr({displayName: marriage_status})
            .attr({codeSystem: "2.16.840.1.113883.5.2"})
            .attr({codeSystemName: "MaritalStatusCode"}).parent()    
    }
    
}

var guardianPerson = function(xmlDoc, guardians) {
    if (guardians == undefined) {
        return xmlDoc;
    } else {
       return xmlDoc.node('guardianPerson')
            .node('name')
                .node('given', guardians[0]["names"][0]["first"]).parent()
                .node('family', guardians[0]["names"][0]["last"]).parent()
            .parent()
        .parent()
    }

}

var languageCommunication = function(xmlDoc, languages) {
    if (languages == undefined) {
        return xmlDoc.node('languageCommunication')
            .node('languageCode').attr({nullFlavor: "UNK"}).parent()
            .node('modeCode').attr({code: "ESP"})
                             .attr({nullFlavor: "UNK"}).parent()
            .node('proficiencyLevelCode').attr({nullFlavor: "UNK"}).parent()
            .node('preferenceInd').attr({nullFlavor: "UNK"}).parent()
        .parent()
    } else {
        xmlDoc = xmlDoc.node('languageCommunication')
            .node('languageCode').attr({code: languages[0]["language"]}).parent()
            .node('modeCode').attr({code: "ESP"})
                             .attr({displayName: languages[0]["mode"]})
                             .attr({codeSystem: "2.16.840.1.113883.5.60"})
                             .attr({codeSystemName: "LanguageAbilityMode"}).parent();
            if (languages[0]["proficiency"] != undefined) {
                xmlDoc = xmlDoc.node('proficiencyLevelCode').attr({code: languages[0]["proficiency"].substring(0,1)})
                    .attr({displayName: languages[0]["proficiency"]})
                    .attr({codeSystem: "2.16.840.1.113883.5.61"})
                    .attr({codeSystemName: "LanguageAbilityProficiency"}).parent();
            } else {
                xmlDoc = xmlDoc.node('proficiencyLevelCode').attr({nullFlavor: "UNK"}).parent();
            }
            xmlDoc = xmlDoc.node('preferenceInd').attr({value: "true"}).parent()
        .parent()
        return xmlDoc;
    }
}

// generate translation node
var translation = function(xmlDoc, translations) {
    if (translations == undefined) {
        return xmlDoc.node('translation').attr({nullFlavor: "UNK"}).parent();
    } else {
        return xmlDoc.node('translation').attr({code: translations[0]["code"]})
            .attr({codeSystem: "2.16.840.1.113883.5.4"})
            .attr({displayName: translations[0]["name"]})
            .attr({codeSystemName: translations[0]["code_system_name"]}).parent()
    }
}

// generate participant information
var participant = function(xmlDoc, locations) {
    if (locations == undefined) {
        return xmlDoc.node('participant').attr({nullFlavor: "UNK"}).parent();
    } else {
        xmlDoc = xmlDoc.node('participant').attr({typeCode: "LOC"})
            .node('participantRole').attr({classCode: "SDLOC"}) // service delivery location template
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.32"}).parent();
                if (locations[0]["loc_type"] != undefined) {
                    xmlDoc = xmlDoc.node('code').attr({code: locations[0]["loc_type"]["code"]})
                             .attr({codeSystem: "2.16.840.1.113883.6.259"})
                             .attr({codeSystemName: locations[0]["loc_type"]["code_system_name"]})
                             .attr({displayName: locations[0]["loc_type"]["name"]}).parent();
                }
                xmlDoc = addr(xmlDoc, locations[0]["addresses"]);             
                xmlDoc = tel(xmlDoc, locations[0]["phone"]);
                xmlDoc = xmlDoc.node('playingEntity').attr({classCode: "PLC"})
                    .node('name', locations[0]["name"]).parent()
                .parent()
            .parent()
        .parent()
        return xmlDoc;
    }
}

// used by encounters and medications
var indicationConstraint = function(xmlDoc, findings, time) {
   if (findings == undefined) {
        return xmlDoc;
    } else {
        return xmlDoc.node('entryRelationship').attr({typeCode: "RSON"})
            .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.19"}).parent()
                .node('id').attr({root: "db734647-fc99-424c-a864-7e3cda82e703"}).attr({extension: "45665"}).parent()
                .node('code').attr({code: "404684003"}).attr({displayName: "Finding"})
                             .attr({codeSystem: "2.16.840.1.113883.6.96"})
                             .attr({codeSystemName: "SNOMED CT"}).parent()
                .node('statusCode').attr({code: 'completed'}).parent()
                .node('effectiveTime')
                    .node('low').attr({value: time}).parent()
                .parent()
                .node('value').attr({"xsi:type": "CD"})
                              .attr({code: findings[0]["code"]})
                              .attr({displayName: findings[0]["name"]})
                              .attr({codeSystem: "2.16.840.1.113883.6.96"}).parent()
            .parent()
        .parent()
    }
    
}

// generate effectiveTime node
var effectiveTime = function(xmlDoc, time) {
    if (time) {
        xmlDoc = xmlDoc.node('effectiveTime')
            .node('low').attr({value: time[0]}).parent();
            if (time[2]) {
                xmlDoc = xmlDoc.node('high').attr({value: time[2]}).parent()
            }
        xmlDoc = xmlDoc.parent();
        return xmlDoc;
    } else {
         xmlDoc = xmlDoc.node('effectiveTime')
            .node('low').attr({nullFlavor: "UNK"})
        .parent();
        return xmlDoc;
    }
}

// generate precondition node
// used in: medications
var precondition = function(xmlDoc, precondition) {
    if (precondition == undefined) {
        return xmlDoc;
    } else {
        return xmlDoc.node('precondition').attr({typeCode: "PRCN"}) // precondition for substance administration
            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.25"}).parent()
            .node('criterion')
                .node('code').attr({code: precondition["code"]["code"]})
                             .attr({codeSystem: "2.16.840.1.113883.5.4"}).parent()
                .node('value').attr({"xsi:type": "CE"})
                              .attr({code: precondition["value"]["code"]})
                              .attr({codeSystem: "2.16.840.1.113883.6.96"})
                              .attr({displayName: "Wheezing"}).parent()
            .parent()
        .parent()
    }
}

module.exports.insertObservation = insertObservation;
module.exports.header = header;
module.exports.addr = addr;
module.exports.representedOrganization = representedOrganization;
// module.exports.performer = performer;
module.exports.performerRevised = performerRevised;
module.exports.getTimes = getTimes;
module.exports.substanceAdministration = substanceAdministration;
module.exports.consumable = consumable;
module.exports.entryRelationship = entryRelationship;
module.exports.getNumEntries = getNumEntries;
module.exports.getObjLength = getObjLength;
module.exports.tel = tel;
module.exports.id = id;
module.exports.code = code;
module.exports.name = name;
module.exports.maritalStatusCode = maritalStatusCode;
module.exports.guardianPerson = guardianPerson;
module.exports.languageCommunication = languageCommunication;
module.exports.translation = translation;
module.exports.participant = participant;
module.exports.indicationConstraint = indicationConstraint;
module.exports.medication_administration = medication_administration;
module.exports.precondition = precondition;
module.exports.manufacturedProduct = manufacturedProduct;
module.exports.getCodeSystems = getCodeSystems;
module.exports.effectiveTime = effectiveTime;


