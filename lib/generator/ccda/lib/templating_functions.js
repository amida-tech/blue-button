var XDate = require("xdate");
var bbm = require("blue-button-meta");
var codeSystems = bbm.CCDA.codeSystems;
var OIDs = require("../../../parser/ccda/oids.js");

var reverseTable = function(OID, name) {
    var obj = OIDs[OID];
    for (var key in obj.table) {
        obj.table[obj.table[key]] = key;
    }
    return {
        "name": name, 
        "code": obj.table[name],
        "code_system": OID, 
        "code_system_name": obj.name
    };
}

var value = function(xmlDoc, value, type, oText, text) {
    if (value) {
        xmlDoc = code(xmlDoc, value, undefined, 'value');
        xmlDoc.attr({"xsi:type": type});
        if (oText) {
            xmlDoc = xmlDoc.node('originalText')
                .node('reference').attr({value: "#reaction" + oText}).parent()
            .parent();
        }
        xmlDoc = xmlDoc.parent()
    } else {
        if (text) {
            xmlDoc = xmlDoc.node('value', text);
            if (type) {
                xmlDoc = xmlDoc.attr({"xsi:type": type})
            }
            xmlDoc = xmlDoc.parent();    
        } else {
            xmlDoc = xmlDoc.node('value').attr({nullFlavor: "UNK"}).parent();
        }
    }
    return xmlDoc;
}

// Templates the header for a specific section
var header = function (doc, templateIdOptional, templateIdRequired, code, codeSystem, codeSystemName, displayName, title, isCCD) {
    if (!isCCD) {
        xmlDoc = doc.node('ClinicalDocument')
            .attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
            .attr({xmlns: "urn:hl7-org:v3"})
            .attr({"xmlns:cda": "urn:hl7-org:v3"})
            .attr({"xmlns:sdtc": "urn:hl7-org:sdtc"});
    } else {
        xmlDoc = doc.node('component');
    }

    xmlDoc = xmlDoc.node('section')
        .node('templateId')
            .attr({root: templateIdOptional}).parent()

    if (templateIdRequired != undefined) {
        xmlDoc = xmlDoc.node('templateId')
            .attr({root: templateIdRequired}).parent();
    }

    if (codeSystemName != undefined) {
        xmlDoc = xmlDoc.node('code')
            .attr({code: code})
            .attr({codeSystem: codeSystem})
            .attr({codeSystemName: codeSystemName})
            .attr({displayName: displayName}).parent();
    } else if (codeSystemName == undefined && displayName == undefined) {
        xmlDoc = xmlDoc.node('code').attr({code: code})
            .attr({codeSystem: codeSystem}).parent();
    } else {
        xmlDoc = xmlDoc.node('code').attr({code: code})
            .attr({codeSystem: codeSystem})
            .attr({codeSystemName: codeSystemName})
            .attr({displayName: displayName}).parent();
    }
    xmlDoc = xmlDoc.node('title', title).parent()
        .node('text').parent()
    return xmlDoc;
}

// Templates the header for a specific section
var header_v2 = function (doc, templateIdOptional, templateIdRequired, code_obj, title, isCCD) {
    if (!isCCD) {
        xmlDoc = doc.node('ClinicalDocument')
            .attr({"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"})
            .attr({xmlns: "urn:hl7-org:v3"})
            .attr({"xmlns:cda": "urn:hl7-org:v3"})
            .attr({"xmlns:sdtc": "urn:hl7-org:sdtc"});
    } else {
        xmlDoc = doc.node('component');
    }

    xmlDoc = xmlDoc.node('section')
        .node('templateId').attr({root: templateIdOptional}).parent()

    if (templateIdRequired) {
        xmlDoc = xmlDoc.node('templateId').attr({root: templateIdRequired}).parent();
    }
    xmlDoc = code(xmlDoc, code_obj).parent();
    xmlDoc = xmlDoc.node('title', title).parent()
        .node('text').parent()
    return xmlDoc;
}


var tel = function (xmlDoc, tel, email) {
    if (tel || email) {
        if (tel) {
            for (var j=0; j<tel.length; ++j) {
                if (tel[j]) {
                    xmlDoc = xmlDoc.node('telecom')
                        .attr({value: "tel:" + checkObj(tel, tel[j]["number"])})
                        .attr(tel[j]["type"] ? {use: acronymize(tel[j]["type"])} : 
                            {use: "HP"}).parent();
                }
            }
        }
        if (email) {
            for (var i=0; i<email.length; ++i) {
                if (email[i] && email[i].address) {
                    xmlDoc = xmlDoc.node('telecom');
                    var attrs = {value: "mailto:" + email[i].address};
                    if (email[i].type) {
                        attrs.use = acronymize(email[i].type); 
                    }
                    xmlDoc = xmlDoc.attr(attrs).parent();
                }
            }            
        }
        return xmlDoc;    
    } else {
        return xmlDoc.node('telecom')
            .attr({nullFlavor: "UNK"}).parent();
    }
}

function acronymize(string) {
    var ret = string.split(" ");
    var fL = ret[0].slice(0, 1);
    var lL = ret[1].slice(0, 1);
    fL = fL.toUpperCase();
    lL = lL.toUpperCase();
    ret = fL + lL;
    if (ret == "PH")
        ret = "HP"
    return ret;
}

var name = function (xmlDoc, name, use) {
    if (name == undefined) {
        return xmlDoc.node('name').attr({ nullFlavor: "UNK"}).parent();
    } else if (Array.isArray(name)) {
        name.forEach(function(n) {
            var nameNode = xmlDoc.node('name');
            if (use) {
                nameNode.attr({use: use});
            }
            if (n["prefix"])
                nameNode.node('prefix', n["prefix"]);
            if (n["first"])
                nameNode.node('given', n["first"]);
            if (n["middle"])
                nameNode.node('given', n["middle"][0]);
            if (n["last"])
                nameNode.node('family', n["last"]);
            if (n.suffix) {
                nameNode.node('suffix', n.suffix);
            }
        });
        return xmlDoc;
    } else {
        xmlDoc = xmlDoc.node('name');
        if (use) {
            xmlDoc = xmlDoc.attr({use: use});
        }
            if (name["prefix"])
                xmlDoc = xmlDoc.node('prefix', name["prefix"]).parent();
            if (name["first"])
                xmlDoc = xmlDoc.node('given', name["first"]).parent();
            if (name["middle"])
                xmlDoc = xmlDoc.node('given', name["middle"][0]).parent();
            if (name["last"])
                xmlDoc = xmlDoc.node('family', name["last"]).parent();
            if (name.suffix) {
                xmlDoc = xmlDoc.node('suffix', name.suffix).parent();
            }
        xmlDoc = xmlDoc.parent();
        return xmlDoc;
    }
}

var addr = function (xmlDoc, addr, birthplace) {
    if (!addr) {
        xmlDoc = xmlDoc.node('addr')
            .attr({nullFlavor: "UNK"}).parent()
    } else if (addr[0]) {
        xmlDoc = xmlDoc.node('addr');
        if (addr[0]["use"]) {
            xmlDoc.attr({use: acronymize(addr[0]["use"])});
        }

        if (!birthplace && addr[0]["street_lines"] !== undefined) {
            for (var j=0; j<addr[0].street_lines.length; ++j) {
                xmlDoc = xmlDoc.node('streetAddressLine', addr[0]["street_lines"][j]).parent();
            }
        }
        xmlDoc = xmlDoc.node('city', addr[0]["city"]).parent()
            .node('state', addr[0]["state"]).parent()
            .node('postalCode', addr[0]["zip"]).parent()
            .node('country', addr[0]["country"]).parent()
            .parent()
    } else {
        xmlDoc = xmlDoc.node('addr');
        if (addr["use"]) {
            xmlDoc.attr({use: acronymize(addr[0]["use"])});
        }
        if (!birthplace) {
            for (var j=0; j<addr.street_lines.length; ++j) {
                xmlDoc = xmlDoc.node('streetAddressLine', addr.street_lines[j]).parent();
            }
        }
        xmlDoc = xmlDoc.node('city', addr["city"]).parent()
            .node('state', addr["state"]).parent()
            .node('postalCode', addr["zip"]).parent()
            .node('country', addr["country"]).parent()
            .parent()
    }
    return xmlDoc;
}

var performerRevised = function (xmlDoc, performer, spec) {
    spec = spec ? spec : {};
    if (performer) {
        var telecom = performer["telecom"] ? 
        performer["telecom"] : performer["phone"];
    }
    if (spec && spec["typeCode"]) {
        xmlDoc = xmlDoc.node('performer')
            .attr({typeCode: spec["typeCode"]});
    } else {
        xmlDoc = xmlDoc.node('performer');
    }
    if (spec && spec["tID"])
        xmlDoc = xmlDoc.node('templateId')
            .attr({root: spec["tID"]}).parent();

    xmlDoc = xmlDoc.node('assignedEntity');
        if (spec.code) {
            xmlDoc = code(xmlDoc, spec.code).parent();
        }

        xmlDoc = id(xmlDoc, performer && performer.identifiers);
        xmlDoc = addr(xmlDoc, performer && performer.address);
        xmlDoc = tel(xmlDoc, performer && telecom);
        xmlDoc = assignedPerson(xmlDoc, performer && performer.name);

        assignedPerson(xmlDoc, spec["assignedP"]);
        xmlDoc = performer ? representedOrganization(xmlDoc, performer["organization"]) : 
        representedOrganization(xmlDoc, spec["repOrg"]);
    xmlDoc = xmlDoc.parent()
        .parent();
    return xmlDoc;
}

var assignedPerson = function (xmlDoc, assignedPerson) {
    if (assignedPerson) {
        xmlDoc = xmlDoc.node('assignedPerson')
            .node('name');
                if (assignedPerson[0]["prefix"]) {
                    xmlDoc = xmlDoc.node('prefix', assignedPerson[0]["prefix"]).parent()    
                }
                xmlDoc = xmlDoc.node('given', assignedPerson[0]["first"]).parent();
                if (assignedPerson[0]["middle"]) {
                    xmlDoc = xmlDoc.node('given', assignedPerson[0]["middle"][0]).parent()    
                }
                
                xmlDoc = xmlDoc.node('family', assignedPerson[0]["last"]).parent();
                if (assignedPerson[0].suffix) {
                    xmlDoc = xmlDoc.node('suffix', assignedPerson[0].suffix).parent();
                }
            xmlDoc = xmlDoc.parent()
        .parent();
    }
    return xmlDoc;
}

var representedOrganization = function (xmlDoc, performer, tag) {
    tag ? tag : 'representedOrganization';
    performer = Array.isArray(performer) ? performer[0] : performer;
    if (performer) {
        xmlDoc = xmlDoc.node('representedOrganization');
            xmlDoc = id(xmlDoc, performer["identifiers"]);
            if (performer.name) {
                performer.name.forEach(function(name) {
                    xmlDoc.node('name', name);  
                });
            }
            xmlDoc = tel(xmlDoc, performer["phone"]);
            xmlDoc = addr(xmlDoc, performer["address"]);
        xmlDoc = xmlDoc.parent();
    } 
    return xmlDoc;
}

// get the times/dates for the value attribute of effectiveTime
// @return an array of dates, each date having two entries corresponding
// to two different date formats: yyyymmdd or yyyymm
// for example: [19991101, 199911]
var getTimes = function (date) {
    if (Array.isArray(date)) {
        if (date != undefined) {
            var timeArr = [];
            for (var i = 0; i < date.length; i++) {
                var effectiveTime = (new XDate(date[i]["date"])).toString("u").split("-");
                effectiveTime[2] = effectiveTime[2].slice(0, 2);
                var time = effectiveTime[0] + effectiveTime[1] + (zeroFill(parseInt(effectiveTime[2]) + 1, 2));
                timeArr.push(time);
                timeArr.push(effectiveTime[0] + effectiveTime[1]);
            }
            return timeArr;
        } else {
            return ["UNK", "UNK"];
        }
    } else {
        var date_times = {};
        var timeArr = [];
        if (typeof date === "object") {
            Object.keys(date).forEach(function (key) {
                if (date[key]["date"] && date[key]["date"] !== "Invalid Date") {
                    var timeArr = [];
                    var effectiveTime = date[key]["date"].split("-");

                    // write back the effective time the way it came in
                    if (date[key]["precision"] === "year") {
                        effectiveTime[1] = "";
                        effectiveTime[2] = "";
                    } else if (date[key]["precision"] === "month") {
                        effectiveTime[2] = "";
                    } else if (date[key]["precision"] === "day") { // day precision
                        effectiveTime[2] = effectiveTime[2].slice(0, 2); // slice off the T00:00:00Z portion of UTC time format
                    } else if (date[key]["precision"] === "hour") { // hour precision
                        effectiveTime[2] = effectiveTime[2].replace("T", "").split(":").join("").replace("Z", "").slice(0, -4); //YYYYMMDDHH    
                    } else if (date[key]["precision"] === "minute") { // minute precision
                        effectiveTime[2] = effectiveTime[2].replace("T", "").split(":").join("").replace("Z", "").slice(0, -2); //YYYYMMDDHHMM   
                    } else { // second precision
                        effectiveTime[2] = effectiveTime[2].replace("T", "").split(":").join("").replace("Z", "");    
                    }
                    var time = effectiveTime[0] + effectiveTime[1] + effectiveTime[2];
                    timeArr.push(time);
                    timeArr.push(effectiveTime[0] + effectiveTime[1]);
                    date_times[key] = timeArr;
                }
            });
        }
        return date_times;
    } 
}

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

// template for the consumable/manufacturedProduct section
// used in: medication information and immunization medication information
var consumable = function (xmlDoc, product, ref) {
    xmlDoc = xmlDoc.node('consumable');
        xmlDoc = manufacturedProduct(xmlDoc, product, ref);
    xmlDoc = xmlDoc.parent();
    return xmlDoc;
}

// part of the consumable template function.
var manufacturedProduct = function (xmlDoc, product, ref, sec) {
    xmlDoc = xmlDoc.node('manufacturedProduct').attr({classCode: "MANU"}) // medication information / immunization medication information
        .node('templateId').attr({root: ref.indexOf("immi") > -1 ?  "2.16.840.1.113883.10.20.22.4.54" : '2.16.840.1.113883.10.20.22.4.23'}).parent();
        if (product && product["product"]) {
            xmlDoc = id(xmlDoc, product["identifiers"]);
            xmlDoc = xmlDoc.node('manufacturedMaterial');
                xmlDoc = code(xmlDoc, sec ? product["product"] ? product["product"]["translations"] ? product["product"]["translations"][0] : undefined : undefined : product["product"], {});
                xmlDoc = xmlDoc.node('originalText', ref).parent();
                xmlDoc = xmlDoc.parent() // end code
                if (product["lot_number"]) {
                    xmlDoc = xmlDoc.node('lotNumberText', product["lot_number"]).parent();
                }
            xmlDoc = xmlDoc.parent() // end manufacturedMaterial
            if (product.manufacturer) {
                xmlDoc = xmlDoc.node('manufacturerOrganization')
                    .node('name', product.manufacturer).parent()
                .parent();
            }
        } else {
            id(xmlDoc);    
            xmlDoc = xmlDoc.node('manufacturedMaterial');
                xmlDoc = code(xmlDoc, undefined);
                    xmlDoc = xmlDoc.node('originalText')
                        .node('reference')
                            .attr({ value: ref}).parent()
                    .parent();
                    xmlDoc = code(xmlDoc, undefined, {}, 'translation').parent();
                xmlDoc = xmlDoc.parent()
            .parent()
            .node('manufacturerOrganization')
                .node('name', "UNK").parent()
            .parent()
        }
    xmlDoc = xmlDoc.parent(); // end manufacturedProduct
    return xmlDoc;
}

var entryRelationship = function (xmlDoc, data, type, typeCode, ref, templateId) {
    if (data) {
        xmlDoc = xmlDoc.node('entryRelationship').attr({typeCode: typeCode})
            .attr({inversionInd: "true"})
            .node(type).attr({classCode: type === "observation" ? "OBS" : "ACT"})
                .attr({moodCode: type === "observation" ? "EVN" : "INT"})
                .node('templateId').attr({root: templateId}).parent();
                xmlDoc = id(xmlDoc, data.identifiers);
                xmlDoc = code(xmlDoc, data["code"]).parent();
                if (data["free_text"]) {
                    xmlDoc = xmlDoc.node('text', data["free_text"])
                    .node('reference')
                        .attr({value: ref}).parent()
                    .parent()    
                }
                xmlDoc = xmlDoc.node('statusCode').attr({code: "completed"}).parent()
            xmlDoc = xmlDoc.parent()
        .parent()
    }
    return xmlDoc;
}

var substanceAdministration = function (xmlDoc, data, i, refSBADM, refCONS, templIdSBADM, templIdCONS) {
    var timeArr = getTimes(data[i]["date"]);
    xmlDoc = xmlDoc.node('substanceAdministration')
            .attr({classCode: "SBADM"})
            .attr({moodCode: "EVN"}).attr({negationInd: "false"})
        .node('templateId')
            .attr({root: "2.16.840.1.113883.10.20.22.4.52"}).parent();
        xmlDoc = id(xmlDoc, data[i]["identifiers"]);
        xmlDoc = xmlDoc.node('text')
            .node('reference')
                .attr({value: refSBADM}).parent()
        .parent()
        .node('statusCode')
            .attr({code: 'completed'}).parent()
        .node('effectiveTime')
            .attr({"xsi:type": "IVL_TS"})
            .attr({value: timeArr[0]}).parent();
        xmlDoc = routeCode(xmlDoc, data[i]["administration"]);
        xmlDoc = doseQuantity(xmlDoc, data[i]["administration"]);
        xmlDoc = consumable(xmlDoc, data, i, refCONS, templIdCONS);
        xmlDoc = performerRevised(xmlDoc, data[i]["performer"], {});
    return xmlDoc;
}

var id = function (xmlDoc, ids) {
    if (ids) {
        ids.forEach(function(id) {
            var idNode = xmlDoc.node('id').attr({root: id.identifier});
            if (id.extension) {
                idNode.attr({extension: id.extension});
            }
        });
    } else {
        xmlDoc.node('id').attr({nullFlavor: "UNK"}).parent();
    }
    return xmlDoc;
}

var checkObj = function (tag, objTag) {
    return typeof tag === 'object' ? objTag : tag;
}

var routeCode = function (xmlDoc, administration, ignoreBodySite) {
    if (administration == undefined) {
        return xmlDoc.node('routeCode')
            .attr({nullFlavor: "UNK"}).parent()
    } else if ((! ignoreBodySite) && (administration["body_site"] != undefined)) {
        code(xmlDoc, administration.body_site, undefined, 'routeCode');
        return xmlDoc;
    } else if (administration["route"] != undefined) {
        code(xmlDoc, administration.route, undefined, 'routeCode');
        return xmlDoc;
    } else {
        return xmlDoc;
    }
}

var doseQuantity = function (xmlDoc, administration) {
    if (administration !== undefined) {
        if (administration["body_site"] !== undefined && 
            administration["body_site"]["dose"] != undefined) {
            return xmlDoc.node('doseQuantity')
                .attr({value: administration["body_site"]["dose"]["value"]})
                .attr({unit: administration["body_site"]["dose"]["unit"]}).parent();
        } else if (administration["dose"] != undefined) {
            return xmlDoc.node('doseQuantity')
                .attr({value: administration["dose"]["value"]})
                .attr({unit: administration["dose"]["unit"]}).parent();
        }
    } else {
        return xmlDoc.node('doseQuantity')
            .attr({nullFlavor: "UNK"}).parent();
    }
    return xmlDoc;
}

var medication_administration = function (xmlDoc, administration) {
    if (!administration) {
        return xmlDoc.node('routeCode')
            .attr({nullFlavor: "UNK"}).parent()
            .node('doseQuantity').attr({nullFlavor: "UNK"}).parent()
            .node('rateQuantity').attr({nullFlavor: "UNK"}).parent()
            .node('maxDoseQuantity').attr({nullFlavor: "UNK"})
            .node('numerator').attr({nullFlavor: "UNK"}).parent()
            .node('denominator').attr({nullFlavor: "UNK"}).parent()
        .parent()
            .node('administrationUnitCode')
                .attr({nullFlavor: "UNK"}).parent()
    } else {
        xmlDoc = routeCode(xmlDoc, administration);
        xmlDoc = doseQuantity(xmlDoc, administration);
        xmlDoc = rateQuantity(xmlDoc, administration["rate"]);
        xmlDoc = xmlDoc.node('maxDoseQuantity')
            .attr({nullFlavor: "UNK"})
            .node('numerator')
                .attr({nullFlavor: "UNK"}).parent()
            .node('denominator')
                .attr({nullFlavor: "UNK"}).parent()
            .parent();
        if (administration["form"] != undefined) {
            xmlDoc = code(xmlDoc, administration["form"], 
                {'code_system': "2.16.840.1.113883.3.26.1.1"}, 'administrationUnitCode').parent();
        }
        return xmlDoc;
    }
}

var code = function code(xmlDoc, entity, spec, tag) {
    tag = tag ? tag : 'code';
    spec = spec ? spec : {};
    entity = entity ? entity : {};

    if (Object.keys(entity).length === 0 && Object.keys(spec).length === 0) {
        return xmlDoc.node(tag)
            .attr({nullFlavor: "UNK"});
    } else {
        xmlDoc = xmlDoc.node(tag);
        var code_attr = spec["code"] ? spec["code"] : entity["code"] ? entity["code"] : undefined;
        
        if (code_attr) {
            xmlDoc = xmlDoc.attr({code: code_attr});
        }

        var name_attr = spec["name"] ? spec["name"] : entity["name"] ? entity["name"] : undefined;
        if (name_attr) {
            xmlDoc = xmlDoc.attr({displayName: spec["name"] ? spec["name"] : entity["name"]});
        }

        if ((! spec.code_sytem_name) && entity.code_system_name && (entity.code_system_name.substring(0, 4) === 'OID ')) {
            spec.code_system = entity.code_system_name.split('OID ')[1];
            spec.code_system_name = entity.code_sytem_name;
        }

        var code_system_attr = spec["code_system"] ? spec["code_system"] : entity["code_system_name"] ? 
        (codeSystems[entity["code_system_name"]] ? codeSystems[entity["code_system_name"]][0] : entity["code_system_name"] ): undefined;
        if (code_system_attr) {
            xmlDoc = xmlDoc.attr({codeSystem: code_system_attr});
        }

        var code_system_name_attr = spec["code_system_name"] ? 
        spec["code_system_name"] : entity["code_system_name"] ? entity["code_system_name"] : undefined;
        if (code_system_name_attr) {
            xmlDoc = xmlDoc.attr({codeSystemName: code_system_name_attr});
        }

        if (entity.translations) {
            var n = entity.translations.length;
            for (var i=0; i<n; ++i) {
                xmlDoc = code(xmlDoc, entity.translations[i], undefined, 'translation').parent(); 
            }
        }

        return xmlDoc;
    }
}

var rateQuantity = function (xmlDoc, rate) {
    return rate ? xmlDoc.node('rateQuantity')
        .attr({value: rate["value"]})
        .attr({unit: rate["unit"]}).parent() : unk(xmlDoc, 'rateQuantity', 'UNK');
}

var unk = function (xmlDoc, tag, nullFlavor) {
    return xmlDoc.node(tag).attr({nullFlavor: nullFlavor}).parent();
}

// TODO: this is not used ...
var immunization_medication_information = function (xmlDoc, product) {
    return xmlDoc.node('manufacturedProduct')
        .attr({classCode: "MANU"}) // medication information
        .node('templateId')
            .attr({root: templateId}).parent()
        .node('manufacturedMaterial')
            .node('code')
                .attr({code: data[i]["product"]["product"]["code"]})
                .attr({codeSystem: codeSystems[data[i]["product"]["product"]["code_system_name"]]})
                .attr({displayName: data[i]["product"]["product"]["name"]})
                .attr({codeSystemName: data[i]["product"]["product"]["code_system_name"]})
                .node('originalText')
                    .node('reference').attr({value: ref}).parent()
                .parent();
                xmlDoc = code(xmlDoc, data[i]["product"]["product"] ? 
                data[i]["product"]["product"]["translations"][0] : undefined, {}, 'translation').parent();
            xmlDoc = xmlDoc.parent()
            .node('lotNumberText', data[i]["product"]["lot_number"]).parent()
        .parent()
        .node('manufacturerOrganization')
            .node('name', data[i]["product"]["manufacturer"]).parent()
        .parent()
    .parent()
}

var maritalStatusCode = function (xmlDoc, marriage_status) {
    if (marriage_status == undefined) {
        return xmlDoc.node('maritalStatusCode')
            .attr({nullFlavor: "UNK"}).parent();
    } else {
        return xmlDoc.node('maritalStatusCode')
            .attr({code: marriage_status.substring(0, 1)})
            .attr({displayName: marriage_status})
            .attr({codeSystem: "2.16.840.1.113883.5.2"})
            .attr({codeSystemName: "MaritalStatusCode"}).parent()
    }

}

var guardianPerson = function (xmlDoc, guardians) {
    var gName = guardians && guardians[0] && guardians[0].names && guardians[0].names[0];
    if (gName) {
        return xmlDoc.node('guardianPerson')
            .node('name')
                .node('given', gName.first).parent()
                .node('family', gName.last).parent()
            .parent()
        .parent()
    } else {
        return xmlDoc;
    }
}

var languageCommunication = function (xmlDoc, languages) {
    if (languages == undefined) {
        return xmlDoc.node('languageCommunication')
            .node('languageCode')
                .attr({nullFlavor: "UNK"}).parent()
            .node('modeCode')
                .attr({code: "ESP"})
                .attr({nullFlavor: "UNK"}).parent()
            .node('proficiencyLevelCode')
                .attr({nullFlavor: "UNK"}).parent()
            .node('preferenceInd')
                .attr({nullFlavor: "UNK"}).parent()
        .parent()
    } else {
        xmlDoc = xmlDoc.node('languageCommunication')
            .node('languageCode')
                .attr({code: languages[0]["language"]}).parent();
            
            if (languages[0].mode) {
                xmlDoc = xmlDoc.node('modeCode')
                    .attr({code: "ESP"})
                    .attr({displayName: languages[0]["mode"]})
                    .attr({codeSystem: "2.16.840.1.113883.5.60"})
                    .attr({codeSystemName: "LanguageAbilityMode"}).parent();
            }

            if (languages[0]["proficiency"] != undefined) {
                xmlDoc = xmlDoc.node('proficiencyLevelCode')
                    .attr({code: languages[0]["proficiency"].substring(0, 1)})
                    .attr({displayName: languages[0]["proficiency"]})
                    .attr({codeSystem: "2.16.840.1.113883.5.61"})
                    .attr({codeSystemName: "LanguageAbilityProficiency"}).parent();
            } else {
                xmlDoc = xmlDoc.node('proficiencyLevelCode')
                    .attr({nullFlavor: "UNK"}).parent();
            }
            xmlDoc = xmlDoc.node('preferenceInd')
                .attr({value: "true"}).parent()
        .parent()
        return xmlDoc;
    }
}

// generate participant information
var participant = function (xmlDoc, locations, spec) {
    spec = spec ? spec : {};
    if (!locations) {
        return xmlDoc.node('participant')
            .attr({nullFlavor: "UNK"}).parent();
    } else {
        xmlDoc = xmlDoc.node('participant')
            .attr({typeCode: spec["typeCode"] ? spec["typeCode"] : "LOC"})
            .node('participantRole')
                .attr({classCode: spec["classCode"] ? spec["classCode"] : "SDLOC"}) // service delivery location template
        .node('templateId')
            .attr({root: spec["tId"] ? spec["tId"] : "2.16.840.1.113883.10.20.22.4.32"}).parent();
        if (locations[0]["location_type"]) {
            xmlDoc = code(xmlDoc, locations[0]["location_type"]).parent();
        }
        xmlDoc = addr(xmlDoc, locations[0]["address"]);
        xmlDoc = tel(xmlDoc, locations[0]["phone"]);
        xmlDoc = playingEntity(xmlDoc, locations, {"classCode": "PLC"});
        xmlDoc = xmlDoc.parent()
        .parent()
        return xmlDoc;
    }
}

var playingEntity = function (xmlDoc, entity, spec) {
    spec = spec ? spec : {};
    xmlDoc = xmlDoc.node('playingEntity');
    if (spec && spec["classCode"]) {
        xmlDoc = xmlDoc.attr({classCode: spec["classCode"]});
    }

    xmlDoc = entity[0]["name"] ? xmlDoc.node('name', entity[0]["name"]).parent() : xmlDoc;
    xmlDoc = xmlDoc.parent();
    return xmlDoc;
}

// used by encounters and medications
var indicationConstraint = function (xmlDoc, findings, time) {
    if (!findings) {
        return xmlDoc;
    } else {
        xmlDoc = xmlDoc.node('entryRelationship')
            .attr({typeCode: "RSON"})
            .node('observation')
                .attr({classCode: "OBS"}).attr({moodCode: "EVN"})
                .node('templateId')
                    .attr({root: "2.16.840.1.113883.10.20.22.4.19"}).parent();

                id(xmlDoc, findings[0].identifiers);

                xmlDoc = xmlDoc.node('code')
                    .attr({code: "404684003"})
                    .attr({displayName: "Finding"})
                    .attr({codeSystem: "2.16.840.1.113883.6.96"})
                    .attr({codeSystemName: "SNOMED CT"}).parent()
                .node('statusCode')
                    .attr({code: 'completed'}).parent();
                xmlDoc = effectiveTime(xmlDoc, time);
                xmlDoc = value(xmlDoc, findings[0].value, "CD");
            xmlDoc = xmlDoc.parent()
        .parent()
        return xmlDoc;
    }
}

// generate effectiveTime node
var effectiveTime = function (xmlDoc, time, tag, xsi_type) {
    var node = tag ? tag : 'effectiveTime';
    if (Array.isArray(time)) {
        xmlDoc = xmlDoc.node(node)
        .node('low').attr({value: time[0]}).parent();
        if (time[2]) {
            xmlDoc = xmlDoc.node('high')
                .attr({value: time[2]}).parent()
        }
        xmlDoc = xmlDoc.parent();
        return xmlDoc;
    } else if (typeof time === "object") {
        xmlDoc = xmlDoc.node(node);
        if (xsi_type) {
            xmlDoc.attr({"xsi:type": xsi_type});
        }
        if (time['point']) {
                xmlDoc = xmlDoc.attr({value: time['point'][0]});
        } else {
            if (time['low']) {
                xmlDoc = xmlDoc.node('low').attr({value: time['low'][0]}).parent();
            }
            if (time['high']) {
                xmlDoc = xmlDoc.node('high').attr({value: time['high'][0]}).parent();
            }
            if (time['center']) {
                xmlDoc = xmlDoc.node('center').attr({value: time['center'][0]}).parent();
            }
        }
        xmlDoc = xmlDoc.parent();
    } else {
        xmlDoc = xmlDoc.node(node).node('low')
            .attr({nullFlavor: "UNK"}).parent();
    }
    return xmlDoc;
}

// generate precondition node
// used in: medications
var precondition = function (xmlDoc, precondition) {
    if (precondition) {
        var pr = xmlDoc.node('precondition').attr({typeCode: "PRCN"}); // precondition for substance administration
        pr.node('templateId').attr({root: "2.16.840.1.113883.10.20.22.4.25"});
        var cr = pr.node('criterion');
        cr.node('code').attr({
            code: precondition.code.code,
            codeSystem: "2.16.840.1.113883.5.4"});
        value(cr, precondition.value, "CE");
    }
    return xmlDoc;
}

module.exports.reverseTable = reverseTable;
module.exports.header = header;
module.exports.addr = addr;
module.exports.representedOrganization = representedOrganization;
module.exports.performerRevised = performerRevised;
module.exports.getTimes = getTimes;
module.exports.substanceAdministration = substanceAdministration;
module.exports.consumable = consumable;
module.exports.entryRelationship = entryRelationship;
module.exports.tel = tel;
module.exports.id = id;
module.exports.code = code;
module.exports.name = name;
module.exports.value = value;
module.exports.routeCode = routeCode;
module.exports.doseQuantity = doseQuantity;
module.exports.assignedPerson = assignedPerson;

module.exports.maritalStatusCode = maritalStatusCode;
module.exports.guardianPerson = guardianPerson;
module.exports.languageCommunication = languageCommunication;
module.exports.participant = participant;
module.exports.indicationConstraint = indicationConstraint;
module.exports.medication_administration = medication_administration;
module.exports.precondition = precondition;
module.exports.manufacturedProduct = manufacturedProduct;
module.exports.effectiveTime = effectiveTime;
module.exports.playingEntity = playingEntity;
module.exports.header_v2 = header_v2;
