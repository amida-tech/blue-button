var codeSystems = {
    "LOINC": ["2.16.840.1.113883.6.1", "8716-3"], 
    "SNOMED CT": ["2.16.840.1.113883.6.96", "46680005"], 
    "RXNORM": "2.16.840.1.113883.6.88",
    "ActCode": "2.16.840.1.113883.5.4", 
    "CPT-4": "2.16.840.1.113883.6.12", 
    "CVX": "2.16.840.1.113883.12.292", 
    "HL7ActCode": "2.16.840.1.113883.5.4"
}

// Utility function for determining the size/length of objects
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// insert an observation for the "socialHistory" section
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
    if (tel == undefined) {
        return xmlDoc.node('telecom').attr({nullFlavor: "UNK"}).parent();
    } else {
        return xmlDoc.node('telecom').attr({value: "tel:" + tel[0]["number"]}).attr({use: "HP"}).parent()
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

var performer = function(xmlDoc, id, extension, addrP, tel, repOrg, assignedP, time) {
    xmlDoc = xmlDoc.node('performer');
    if (time != undefined) {
        
    } else if (time == undefined) {
        xmlDoc = xmlDoc.node('time').attr({nullFlavor: "UNK"}).parent()
    }
        xmlDoc = xmlDoc.node('assignedEntity')
            .node('id').attr((id == undefined) ? {nullFlavor: "NI"} : {root: id})
                       .attr( (extension == undefined) ? {extension: ""} : { extension: extension }).parent();
            xmlDoc = addrP == undefined ? xmlDoc.node('addr').attr({nullFlavor: "UNK"}).parent() : addr(xmlDoc, addrP);
            xmlDoc = tel == undefined ? xmlDoc.node('telecom').attr({nullFlavor: "UNK"}).parent() : xmlDoc.node('telecom').attr({use: "WP"}).attr({value: tel[0]["number"]}).parent();
            if (assignedP) {
                xmlDoc = assignedPerson(xmlDoc, "generic");
            }
            xmlDoc = representedOrganization(xmlDoc, repOrg);
        xmlDoc = xmlDoc.parent()
    .parent()
    return xmlDoc;
}

var performerRevised = function(xmlDoc, performer, templateId_in, extension_in) {
    if (performer == undefined) {
        xmlDoc = xmlDoc.node('performer')
            .node('assignedEntity')
                .node('id').attr({nullFlavor: "NI"});
                xmlDoc = addr(xmlDoc, performer);
                xmlDoc = tel(xmlDoc, performer)
                xmlDoc = representedOrganization(xmlDoc, performer);
            xmlDoc = xmlDoc.parent()
        .parent()
    } else {
        var extension = performer["identifiers"] == undefined ? "UNK" : performer["identifiers"][0]["identifier_type"];
        var id = performer["identifiers"] == undefined ? "UNK" : performer["identifiers"][0]["identifier"];
        var telecom = performer["telecom"];

        xmlDoc = xmlDoc.node('performer')
            .node('assignedEntity')
                .node('id').attr((id == undefined) ? {nullFlavor: id} : {root: id})
                           .attr( (extension == "UNK") ? {nullFlavor: extension} : { extension: extension }).parent();
                xmlDoc = addr(xmlDoc, performer["address"]);
                xmlDoc = tel(xmlDoc, telecom);
                xmlDoc = assignedPerson(xmlDoc, performer["name"]);
                xmlDoc = representedOrganization(xmlDoc, performer["organization"]);
            xmlDoc = xmlDoc.parent()
        .parent()
    }
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
    if (performer != undefined && performer["organization"] != undefined) {
        xmlDoc = xmlDoc.node('representedOrganization')
            .node('id').attr( {root: performer["organization"]["identifiers"][0]["identifier"]} ).parent()
            .node('name', performer["organization"]["name"][0]).parent();
            xmlDoc = tel(xmlDoc, performer["organization"]["telecom"]);
            xmlDoc = addr(xmlDoc, performer["organization"]["address"]);       
        xmlDoc = xmlDoc.parent()    
    } else {

    }
    
    return xmlDoc;
}

var getTimes = function(date) {
    if (date != undefined) {
        var timeArr = [];
        for (var i = 0; i < date.length; i++) {
            var effectiveTime = date[i]["date"].split("-");
            effectiveTime[2] = effectiveTime[2].slice(0,2);
            var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
            timeArr.push(time);
            timeArr.push(effectiveTime[0] + effectiveTime[1]);
        }
        return timeArr;
    } else {
        return undefined;
    }
}

var consumable = function(xmlDoc, data, i, ref, templateId) {
    xmlDoc = xmlDoc.node('consumable');
        xmlDoc = manufacturedProduct(xmlDoc, data, i, ref, templateId);
    xmlDoc = xmlDoc.parent();
    return xmlDoc;
}

var manufacturedProduct = function(xmlDoc, data, i, ref) {
    return xmlDoc.node('manufacturedProduct').attr({classCode: "MANU"}) // medication information
        .node('templateId').attr({root: '2.16.840.1.113883.10.20.22.4.23'}).parent()
        .node('id').attr(data[i]["product"]["identifiers"] == undefined ? {nullFlavor: "UNK"} : {root: data[i]["product"]["identifiers"]["identifier"]}).parent()
        .node('manufacturedMaterial')
            .node('code').attr({code: data[i]["product"]["product"]["code"]})
                         .attr({codeSystem: codeSystems[data[i]["product"]["product"]["code_system_name"]]})
                         .attr({displayName: data[i]["product"]["product"]["name"]})
                         .attr({codeSystemName: data[i]["product"]["product"]["code_system_name"]})
                .node('originalText')
                    .node('reference').attr({value: ref}).parent()
                .parent();
                xmlDoc = translation(xmlDoc, data[i]["product"]["product"]["translations"]);
            xmlDoc = xmlDoc.parent()
            .node('lotNumberText', data[i]["product"]["lot_number"]).parent()
        .parent()
        .node('manufacturerOrganization')
            .node('name', data[i]["product"]["manufacturer"]).parent()
        .parent()
    .parent()
}

var entryRelationship = function(xmlDoc, data, type, i, j, code, subsection) {
    if (type == 'act') {
        xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
            .node('act').attr({classCode: "ACT"}).attr({moodCode: "INT"})
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.20"}).parent()
                .node('code').attr({code: "171044003"})
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

var entryBeginning = function(xmlDoc) {
    // allergy problem act
    organizer.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.30"}).parent()
        .node('id').attr({root: "36e3e930-7b14-11db-9fe1-0800200c9a66"}).parent()
        .node('code')
            .attr({code: "48765-2" })
            .attr({codeSystem: codeSystems["LOINC"][0] })
            .attr({codeSystemName: "LOINC"})
            .attr({displayName: 'Allergies, adverse reactions, alerts'}).parent()
        .node('statusCode').attr({code: 'active'}).parent()
        .node('effectiveTime').attr({value: time[0]}).parent()
}

var substanceAdministration = function(xmlDoc, data, i, refSBADM, refCONS, templIdSBADM, templIdCONS) {
    var timeArr = getTimes(data[i]["date"]);
    xmlDoc = xmlDoc.node('substanceAdministration').attr({classCode: "SBADM"}).attr({moodCode: "EVN"}).attr({negationInd: "false"})
        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.52"}).parent()
            .node('id').attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
            .node('text')
                .node('reference').attr({value: refSBADM}).parent()
            .parent()
            .node('statusCode').attr({code: 'completed'}).parent()
            .node('effectiveTime').attr({"xsi:type": "IVL_TS" }).attr({value: timeArr[0]}).parent();
            xmlDoc = routeCode(xmlDoc, data[i]["administration"]);
            xmlDoc = doseQuantity(xmlDoc, data[i]["administration"]);
            xmlDoc = consumable(xmlDoc, data, i, refCONS, templIdCONS);
            xmlDoc = performerRevised(xmlDoc, data[i]["performer"]);
    return xmlDoc;
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
        return xmlDoc.node('code').attr({nullFlavor: "UNK"}).parent();
    } else {
        return xmlDoc.node('code')
                    .attr({code: entity["code"] })
                    .attr({displayName: entity["name"]})
                    .attr({codeSystem: codeSystems["SNOMED CT"][0] })
                    .attr({codeSystemName: entity["code_system_name"]}).parent()    
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
        entriesArr[i] = data[i]["date"][0]["date"].slice(0,4);
        entries[entriesArr[i]] = entries[entriesArr[i]] != undefined ?  entries[entriesArr[i]] + 1 : 1;
    }
    var uniqueEntries = entriesArr.filter(function(v,i) { return i == entriesArr.lastIndexOf(v); });
    return [uniqueEntries, entries];
}

var getLength = function(obj) {
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
                xmlDoc = tel(xmlDoc, locations[0]["phone"]).parent();
                xmlDoc = xmlDoc.node('playingEntity').attr({classCode: "PLC"})
                    .node('name', locations[0]["name"]).parent()
                .parent()
            .parent()
        .parent()
        return xmlDoc;
    }
}

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
module.exports.performer = performer;
module.exports.performerRevised = performerRevised;
module.exports.getTimes = getTimes;
module.exports.substanceAdministration = substanceAdministration;
module.exports.consumable = consumable;
module.exports.entryRelationship = entryRelationship;
module.exports.getNumEntries = getNumEntries;
module.exports.getLength = getLength;
module.exports.tel = tel;
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


