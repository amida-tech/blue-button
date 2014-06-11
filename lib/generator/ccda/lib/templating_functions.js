var codeSystems = {
    "LOINC": ["2.16.840.1.113883.6.1", "8716-3"], 
    "SNOMED CT": ["2.16.840.1.113883.6.96", "46680005"], 
    "RXNORM": "2.16.840.1.113883.6.88",
    "ActCode": "2.16.840.1.113883.5.4", 
    "CPT-4": "2.16.840.1.113883.6.12", 
    "CVX": "2.16.840.1.113883.12.292", 
    "HL7ActCode": "2.16.840.1.113883.5.4"
}

// socialHistory
var insertObservation = function(xmlDoc, templateId, id, code, codeSystem, displayName, reference, timeArr, value) {
    return xmlDoc.node('entry').attr({typeCode: "DRIV"})
            .node('observation').attr({classCode: "OBS"}).attr({moodCode: "EVN"}) // social history observation
                .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.38"}).parent()
                .node('id').attr({root: "9b56c25d-9104-45ee-9fa4-e0f3afaa01c1"}).parent()
                .node('code')
                    .attr({code: "229819007" })
                    .attr({codeSystem: "2.16.840.1.113883.6.96" })
                    .attr({displayName: displayName}).parent()
                .node('originalText')
                    .node('reference').attr({value: "#soc1"}).parent()
                .parent()
                .node('statusCode').attr({code: 'completed'}).parent()
                .node('effectiveTime')
                    .node('low').attr({value: timeArr[0]}).parent()
                    .node('high').attr({value: timeArr[1]}).parent()
                .parent()
                .node('value', '1 pack per day').attr({"xsi:type": "ST"}).parent()
            .parent()
        .parent()
}

var header = function(doc, templateIdOptional, templateIdRequired, code, codeSystem, codeSystemName, displayName, title) {
    var ret = doc.node('ClinicalDocument').attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
        .attr({xmlns: "urn:hl7-org:v3"}).attr({"xmlns:cda": "urn:hl7-org:v3"}).attr({"xmlns:sdtc": "urn:hl7-org:sdtc"})
        .node('section')
            .node('templateID').attr({root: templateIdOptional}).parent();

            if (templateIdRequired != undefined) {
                ret.node('templateID').attr({root: templateIdRequired}).parent();
            }

            if (codeSystemName != undefined) {
                ret.node('code').attr({code: code })
                    .attr({codeSystem: codeSystem})
                    .attr({codeSystemName: codeSystemName})
                    .attr({displayName: displayName}).parent()
            } else {
                ret.node('code').attr({code: code })
                    .attr({codeSystem: codeSystem})
                    .attr({codeSystemName: codeSystemName})
                    .attr({displayName: displayName}).parent()
            }
            ret.node('title', title).parent()
            .node('text').parent()
    return ret;
}

var addr = function(xmlDoc, addr) {
    if (addr == undefined) {
        xmlDoc = xmlDoc.node('addr').attr({nullFlavor: "UNK"}).parent()
    } else {
        xmlDoc = xmlDoc.node('addr')
            .node('streetAddressLine', addr["streetLines"][0]).parent()
            .node('city', addr["city"]).parent()
            .node('state', addr["state"]).parent()
            .node('postalCode', addr["zip"]).parent()
            .node('country', addr["country"]).parent()
        .parent()    
    }
    return xmlDoc;
}

var performer = function(xmlDoc, id, extension, addrP, tel, repOrg) {
    xmlDoc = xmlDoc.node('performer')
        .node('assignedEntity')
            .node('id').attr((id == undefined) ? {nullFlavor: "NI"} : {root: id})
                       .attr( (extension == undefined) ? {extension: ""} : { extension: extension }).parent();
            xmlDoc = addr(xmlDoc, addrP);
            xmlDoc.node('telecom').attr({use: "WP"}).attr( (tel == undefined) ? {nullFlavor: "UNK"} : {value: tel["value"]}).parent();
            xmlDoc = representedOrganization(xmlDoc, repOrg);
        xmlDoc = xmlDoc.parent()
    .parent()
    return xmlDoc;
}

var performerRevised = function(xmlDoc, data, i) {
    var extension = data[i]["performer"]["identifiers"][0]["identifier_type"];
    var id = data[i]["performer"]["identifiers"][0]["identifier"];
    var tel = data[i]["performer"]["telecom"]
    xmlDoc = xmlDoc.node('performer')
        .node('assignedEntity')
            .node('id').attr((id == undefined) ? {nullFlavor: "NI"} : {root: id})
                       .attr( (extension == undefined) ? {extension: ""} : { extension: extension }).parent();
            xmlDoc = addr(xmlDoc, data[i]["performer"]["address"][0]);
            xmlDoc = xmlDoc.node('telecom').attr({use: "WP"}).attr( (tel == undefined) ? {nullFlavor: "UNK"} : {value: tel["value"]}).parent();
            if (data[i]["performer"]["name"] != undefined) {
                xmlDoc = xmlDoc.node('assignedPerson')
                    .node('name')
                        .node('given', data[i]["performer"]["name"][0]["first"]).parent()
                        .node('family', data[i]["performer"]["name"][0]["last"]).parent()
                    .parent()
                .parent();
            }
            xmlDoc = representedOrganization(xmlDoc, data[i]["performer"]["organization"][0]);
        xmlDoc = xmlDoc.parent()
    .parent()
    return xmlDoc;
}

var representedOrganization = function(xmlDoc, org) {
    xmlDoc = xmlDoc.node('representedOrganization')
        .node('id').attr( (org["identifiers"] != undefined) ? {root: org["identifiers"][0]["identifier"]} : {root: "2.16.840.1.113883.19.5"}).parent()
        .node('name', org["name"][0]).parent()
        .node('telecom').attr( (org["telecom"] == undefined) ? {nullFlavor: "UNK"} : {value: org["telecom"]["value"]}).parent();
        if (org["address"] == undefined) {
            xmlDoc = xmlDoc.node('addr').attr({nullFlavor: "UNK"}).parent();
        } else {
            xmlDoc = addr(xmlDoc, org["address"]);
        }       
    xmlDoc = xmlDoc.parent()
    return xmlDoc;
}

var getTimes = function(length, date) {
    var timeArr = [];
    for (var k = 0; k < length; k++) {
        var effectiveTime = date[k]["date"].split("-");
        effectiveTime[2] = effectiveTime[2].slice(0,2);
        var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
        timeArr.push(time);
    }
    return timeArr;
}

var consumable = function(xmlDoc, data, i, ref, templateId) {
    xmlDoc = xmlDoc.node('consumable')
                .node('manufacturedProduct').attr({classCode: "MANU"}) // medication information
                    .node('templateId').attr({root: templateId}).parent()
                    .node('manufacturedMaterial')
                        .node('code').attr({code: data[i]["product"]["code"]})
                                     .attr({codeSystem: codeSystems[data[i]["product"]["code_system_name"]]})
                                     .attr({displayName: data[i]["product"]["name"]})
                                     .attr({codeSystemName: data[i]["product"]["code_system_name"]})
                            .node('originalText')
                                .node('reference').attr({value: ref}).parent()
                            .parent()
                            .node('translation').attr({code: data[i]["product"]["translations"][0]["code"]})
                                                .attr({displayName: data[i]["product"]["translations"][0]["name"]})
                                                .attr({codeSystem: codeSystems[data[i]["product"]["translations"][0]["code_system_name"]]})
                                                .attr({codeSystemName: data[i]["product"]["translations"][0]["code_system_name"]}).parent()
                        .parent()
                        .node('lotNumberText', data[i]["product"]["lot_number"]).parent()
                    .parent()
                    .node('manufacturerOrganization')
                        .node('name', data[i]["product"]["manufacturer"]).parent()
                    .parent()
                .parent()
            .parent()
    return xmlDoc;
}

var entryRelationship = function(xmlDoc, data) {
    xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: "SUBJ"}).attr({inversionInd: "true"})
        .node('act').attr({classCode: "ACT"}).attr({moodCode: "INT"})
            .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.20"}).parent()
            .node('code').attr({code: "409073007"})
                 .attr({codeSystem: "2.16.840.1.113883.6.96"})
                 .attr({displayName: "instruction"}).parent()
            .node('text', 'label in spanish')
                .node('reference').attr({value: "#MedSec_1"}).parent()
            .parent()
            .node('statusCode').attr({code: "completed"}).parent()
        .parent()
    .parent()
    return xmlDoc;
}

var substanceAdministration = function(xmlDoc, data, i, refSBADM, refCONS, templIdSBADM, templIdCONS) {
    var timeArr = getTimes(data[i]["date"].length, data[i]["date"]);
    xmlDoc = xmlDoc.node('substanceAdministration').attr({classCode: "SBADM"}).attr({moodCode: "EVN"})
        .node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.52"}).parent()
            .node('id').attr({root: data[i]["identifiers"][0]["identifier"]}).parent()
            .node('text')
                .node('reference').attr({value: refSBADM}).parent()
            .parent()
            .node('statusCode').attr({code: 'completed'}).parent()
            .node('effectiveTime').attr({"xsi:type": "IVL_TS" }).attr({value: timeArr[0]}).parent()
            .node('routeCode').attr({code: data[i]['administration']['route']['code']})
                              .attr({codeSystem: "2.16.840.1.113883.3.26.1.1"})
                              .attr({codeSystemName: data[i]["administration"]["route"]["code_system_name"]})
                              .attr({displayName: data[i]["administration"]["route"]["name"]}).parent()
            .node('doseQuantity').attr({value: data[i]["administration"]["quantity"]["value"]})
                                 .attr({unit: data[i]["administration"]["quantity"]["unit"]}).parent();
            xmlDoc = consumable(xmlDoc, data, i, refCONS, templIdCONS);
            xmlDoc = performerRevised(xmlDoc, data, i);
    return xmlDoc;
}

// var participant = function(xmlDoc, participant) {

// }

module.exports.insertObservation = insertObservation;
module.exports.header = header;
module.exports.addr = addr;
module.exports.representedOrganization = representedOrganization;
module.exports.performer = performer;
module.exports.getTimes = getTimes;
module.exports.substanceAdministration = substanceAdministration;
module.exports.consumable = consumable;
module.exports.entryRelationship = entryRelationship;