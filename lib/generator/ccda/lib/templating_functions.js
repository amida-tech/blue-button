"use strict";

var bbm = require("blue-button-meta");
var codeSystems = bbm.CCDA.codeSystems;
var OIDs = require("../../../parser/ccda/oids.js");

var reverseTable = function (OID, name) {
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
};

var checkObj = function (tag, objTag) {
    return typeof tag === 'object' ? objTag : tag;
};

var asIsCode = function (xmlDoc, input, tag) {
    tag = tag ? tag : 'code';
    var attrs = {};
    if (input.code) {
        attrs.code = input.code;
    }
    if (input.name) {
        attrs.displayName = input.name;
    }
    if (input.code_system) {
        attrs.codeSystem = input.code_system;
    }
    if (input.code_system_name) {
        attrs.codeSystemName = input.code_system_name;
    }
    xmlDoc.node(tag).attr(attrs);
};

var code = function code(xmlDoc, entity, tag) {
    tag = tag ? tag : 'code';

    if (entity) {
        var c = xmlDoc.node(tag);
        if (entity.code) {
            c.attr({
                code: entity.code
            });
        }
        if (entity.name) {
            c = c.attr({
                displayName: entity.name
            });
        }

        if (entity.code_system_name && (entity.code_system_name.substring(0, 4) === 'OID ')) {
            c.attr({
                codeSystem: entity.code_system_name.split('OID ')[1]
            });
            c.attr({
                codeSystemName: entity.code_sytem_name
            });
        } else {

            var code_system_attr = entity.code_system_name && codeSystems[entity.code_system_name] && codeSystems[entity.code_system_name][0];
            if (code_system_attr) {
                c.attr({
                    codeSystem: code_system_attr
                });
            }

            if (entity.code_system_name) {
                c.attr({
                    codeSystemName: entity.code_system_name
                });
            }

            if (entity.translations) {
                var n = entity.translations.length;
                for (var i = 0; i < n; ++i) {
                    code(c, entity.translations[i], 'translation');
                }
            }
        }
        return c;
    } else {
        return xmlDoc.node(tag).attr({
            nullFlavor: "UNK"
        });
    }
};

var value = function (xmlDoc, value, type, oText, text) {
    if (value) {
        var c = code(xmlDoc, value, 'value');
        c.attr({
            "xsi:type": type
        });
        if (oText) {
            c.node('originalText').node('reference').attr({
                value: "#reaction" + oText
            });
        }
    } else {
        if (text) {
            var v = xmlDoc.node('value', text);
            if (type) {
                v.attr({
                    "xsi:type": type
                });
            }
        } else {
            xmlDoc.node('value').attr({
                nullFlavor: "UNK"
            });
        }
    }
    return xmlDoc;
};

var id = function (xmlDoc, ids) {
    if (ids) {
        ids.forEach(function (id) {
            var idNode = xmlDoc.node('id').attr({
                root: id.identifier
            });
            if (id.extension) {
                idNode.attr({
                    extension: id.extension
                });
            }
        });
    } else {
        xmlDoc.node('id').attr({
            nullFlavor: "UNK"
        }).parent();
    }
    return xmlDoc;
};

// Templates the header for a specific section
var header = function (doc, templateIdOptional, templateIdRequired, code, codeSystem, codeSystemName, displayName, title, isCCD) {
    var xmlDoc;
    if (!isCCD) {
        xmlDoc = doc.node('ClinicalDocument')
            .attr({
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
            })
            .attr({
                xmlns: "urn:hl7-org:v3"
            })
            .attr({
                "xmlns:cda": "urn:hl7-org:v3"
            })
            .attr({
                "xmlns:sdtc": "urn:hl7-org:sdtc"
            });
    } else {
        xmlDoc = doc.node('component');
    }

    xmlDoc = xmlDoc.node('section');

    if (templateIdOptional) {
        xmlDoc.node('templateId').attr({
            root: templateIdOptional
        });
    }
    if (templateIdRequired) {
        xmlDoc.node('templateId').attr({
            root: templateIdRequired
        });
    }

    asIsCode(xmlDoc, {
        code: code,
        codeSystem: codeSystem,
        codeSystemName: codeSystemName,
        displayName: displayName
    });

    xmlDoc.node('title', title);
    xmlDoc.node('text');
    return xmlDoc;
};

// Templates the header for a specific section
var header_v2 = function (doc, templateIdOptional, templateIdRequired, code_obj, title, isCCD) {
    var xmlDoc;
    if (!isCCD) {
        xmlDoc = doc.node('ClinicalDocument')
            .attr({
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
            })
            .attr({
                xmlns: "urn:hl7-org:v3"
            })
            .attr({
                "xmlns:cda": "urn:hl7-org:v3"
            })
            .attr({
                "xmlns:sdtc": "urn:hl7-org:sdtc"
            });
    } else {
        xmlDoc = doc.node('component');
    }

    xmlDoc = xmlDoc.node('section');

    if (templateIdOptional) {
        xmlDoc.node('templateId').attr({
            root: templateIdOptional
        });
    }
    if (templateIdRequired) {
        xmlDoc.node('templateId').attr({
            root: templateIdRequired
        });
    }
    code(xmlDoc, code_obj);
    xmlDoc.node('title', title);
    xmlDoc.node('text');
    return xmlDoc;
};

var acronymize = function (string) {
    var ret = string.split(" ");
    var fL = ret[0].slice(0, 1);
    var lL = ret[1].slice(0, 1);
    fL = fL.toUpperCase();
    lL = lL.toUpperCase();
    ret = fL + lL;
    if (ret === "PH") {
        ret = "HP";
    }
    return ret;
};

var tel = function (xmlDoc, tel, email) {
    if (tel || email) {
        if (tel) {
            for (var j = 0; j < tel.length; ++j) {
                if (tel[j]) {
                    xmlDoc = xmlDoc.node('telecom')
                        .attr({
                            value: "tel:" + checkObj(tel, tel[j]["number"])
                        })
                        .attr(tel[j]["type"] ? {
                            use: acronymize(tel[j]["type"])
                        } : {
                            use: "HP"
                        }).parent();
                }
            }
        }
        if (email) {
            for (var i = 0; i < email.length; ++i) {
                if (email[i] && email[i].address) {
                    xmlDoc = xmlDoc.node('telecom');
                    var attrs = {
                        value: "mailto:" + email[i].address
                    };
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
            .attr({
                nullFlavor: "UNK"
            }).parent();
    }
};

var oneName = function (xmlDoc, name, use) {
    var nameNode = xmlDoc.node('name');
    if (use) {
        nameNode.attr({
            use: use
        });
    }
    if (name.prefix) {
        nameNode.node('prefix', name.prefix);
    }
    if (name.first) {
        nameNode.node('given', name.first);
    }
    if (name.middle) {
        nameNode.node('given', name.middle[0]);
    }
    if (name.last) {
        nameNode.node('family', name.last);
    }
    if (name.suffix) {
        nameNode.node('suffix', name.suffix);
    }
};

var addName = function (xmlDoc, name, use) {
    if (name === undefined) {
        xmlDoc.node('name').attr({
            nullFlavor: "UNK"
        }).parent();
    } else if (Array.isArray(name)) {
        name.forEach(function (n) {
            oneName(xmlDoc, n, use);
        });
    } else {
        oneName(xmlDoc, name, use);
    }
};

var oneAddr = function (xmlDoc, addr, birthplace) {
    var a = xmlDoc.node('addr');
    if (addr.use) {
        a.attr({
            use: acronymize(addr.use)
        });
    }
    if (!birthplace && addr && addr.street_lines) {
        for (var j = 0; j < addr.street_lines.length; ++j) {
            a.node('streetAddressLine', addr.street_lines[j]);
        }
    }
    a.node('city', addr["city"]);
    a.node('state', addr["state"]);
    a.node('postalCode', addr["zip"]);
    a.node('country', addr["country"]);
};

var addr = function (xmlDoc, addr, birthplace) {
    if (!addr) {
        xmlDoc.node('addr').attr({
            nullFlavor: "UNK"
        });
    } else if (addr[0]) {
        oneAddr(xmlDoc, addr[0], birthplace);
    } else {
        oneAddr(xmlDoc, addr, birthplace);
    }
};

var assignedPerson = function (xmlDoc, assignedPerson) {
    if (assignedPerson) {
        var ae = xmlDoc.node('assignedPerson');
        addName(ae, assignedPerson[0]);
    }
};

var representedOrganization = function (xmlDoc, performer, tag) {
    tag ? tag : 'representedOrganization';
    performer = Array.isArray(performer) ? performer[0] : performer;
    if (performer) {
        var org = xmlDoc.node('representedOrganization');
        org = id(org, performer.identifiers);
        if (performer.name) {
            performer.name.forEach(function (name) {
                org.node('name', name);
            });
        }
        tel(org, performer.phone);
        addr(org, performer.address);
    }
};

var performerRevised = function (xmlDoc, performer, spec) {
    if (performer || spec) {
        spec = spec ? spec : {};
        var p = xmlDoc.node('performer');
        if (spec.typeCode) {
            p.attr({
                typeCode: spec.typeCode
            });
        }
        if (spec.tID) {
            p.node('templateId').attr({
                root: spec.tID
            });
        }

        var ae = p.node('assignedEntity');
        if (spec.code) {
            code(ae, spec.code);
        }
        id(ae, performer && performer.identifiers);
        addr(ae, performer && performer.address);
        if (performer) {
            var telecom = performer.telecom ? performer.telecom : performer.phone;
            tel(ae, telecom);
        }
        assignedPerson(ae, performer && performer.name);
        if (performer) {
            representedOrganization(ae, performer.organization);
        }
    }
};

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

// get the times/dates for the value attribute of effectiveTime
// @return an array of dates, each date having two entries corresponding
// to two different date formats: yyyymmdd or yyyymm
// for example: [19991101, 199911]
var getTimes = function (date) {
    var timeArr;
    // if (Array.isArray(date)) {
    //     if (date) {
    //         timeArr = [];
    //         for (var i = 0; i < date.length; i++) {
    //             var effectiveTime = (new XDate(date[i].date)).toString("u").split("-");
    //             effectiveTime[2] = effectiveTime[2].slice(0, 2);
    //             var time = effectiveTime[0] + effectiveTime[1] + (zeroFill(parseInt(effectiveTime[2]) + 1, 2));
    //             timeArr.push(time);
    //             timeArr.push(effectiveTime[0] + effectiveTime[1]);
    //         }
    //         return timeArr;
    //     } else {
    //         return ["UNK", "UNK"];
    //     }
    // } else {
    var date_times = {};
    timeArr = [];
    if (typeof date === "object") {
        Object.keys(date).forEach(function (key) {
            if (date[key].date && date[key].date !== "Invalid Date") {
                var timeArr = [];
                var effectiveTime = date[key].date.split("-");

                // write back the effective time the way it came in
                if (date[key].precision === "year") {
                    effectiveTime[1] = "";
                    effectiveTime[2] = "";
                } else if (date[key].precision === "month") {
                    effectiveTime[2] = "";
                } else if (date[key].precision === "day") { // day precision
                    effectiveTime[2] = effectiveTime[2].slice(0, 2); // slice off the T00:00:00Z portion of UTC time format
                } else if (date[key].precision === "hour") { // hour precision
                    effectiveTime[2] = effectiveTime[2].replace("T", "").split(":").join("").replace("Z", "").slice(0, -4); //YYYYMMDDHH    
                } else if (date[key].precision === "minute") { // minute precision
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
    //}
};

// part of the consumable template function.
var manufacturedProduct = function (xmlDoc, product, ref, sec) {
    var mp = xmlDoc.node('manufacturedProduct').attr({
        classCode: "MANU"
    }); // medication information / immunization medication information
    mp.node('templateId').attr({
        root: ref.indexOf("immi") > -1 ? "2.16.840.1.113883.10.20.22.4.54" : '2.16.840.1.113883.10.20.22.4.23'
    });
    if (product && product.product) {
        id(mp, product.identifiers);
        var mm = mp.node('manufacturedMaterial');
        var c = code(mm, product.product);
        c.node('originalText', ref);
        if (product.lot_number) {
            mm.node('lotNumberText', product.lot_number);
        }
        if (product.manufacturer) {
            mp.node('manufacturerOrganization').node('name', product.manufacturer);
        }
    } else {
        id(mp);
        var mm2 = mp.node('manufacturedMaterial');
        var c2 = code(mm2, undefined);
        c2.node('originalText').node('reference').attr({
            value: ref
        });
        code(c2, undefined, 'translation');
        mp.node('manufacturerOrganization').node('name', "UNK");
    }
};

// template for the consumable/manufacturedProduct section
// used in: medication information and immunization medication information
var consumable = function (xmlDoc, product, ref) {
    var c = xmlDoc.node('consumable');
    manufacturedProduct(c, product, ref);
};

var entryRelationship = function (xmlDoc, data, type, typeCode, ref, templateId) {
    if (data) {
        var er = xmlDoc.node('entryRelationship').attr({
            typeCode: typeCode,
            inversionInd: "true"
        });
        var t = er.node(type).attr({
            classCode: type === "observation" ? "OBS" : "ACT",
            moodCode: type === "observation" ? "EVN" : "INT"
        });
        t.node('templateId').attr({
            root: templateId
        });
        id(t, data.identifiers);
        code(t, data.code);
        if (data.free_text) {
            t.node('text', data.free_text).node('reference').attr({
                value: ref
            });
        }
        t.node('statusCode').attr({
            code: "completed"
        });
    }
};

var doseQuantity = function (xmlDoc, administration) {
    if (administration) {
        var attrs;
        if (administration.body_site && administration.body_site.dose) {
            attrs = {
                value: administration.body_site.dose.value,
                unit: administration.body_site.dose.unit
            };
            xmlDoc.node('doseQuantity').attr(attrs);
        } else if (administration.dose) {
            attrs = {
                value: administration.dose.value,
                unit: administration.dose.unit
            };
            xmlDoc.node('doseQuantity').attr(attrs);
        }
    } else {
        xmlDoc.node('doseQuantity').attr({
            nullFlavor: "UNK"
        });
    }
    return xmlDoc;
};

var routeCode = function (xmlDoc, administration, ignoreBodySite) {
    if (!administration) {
        xmlDoc.node('routeCode').attr({
            nullFlavor: "UNK"
        });
    } else if ((!ignoreBodySite) && administration.body_site) {
        code(xmlDoc, administration.body_site, 'routeCode');
    } else if (administration.route) {
        code(xmlDoc, administration.route, 'routeCode');
    }
};

var substanceAdministration = function (xmlDoc, data, i, refSBADM, refCONS, templIdSBADM, templIdCONS) {
    var sa = xmlDoc.node('substanceAdministration').attr({
        classCode: "SBADM",
        moodCode: "EVN",
        negationInd: "false"
    });
    sa.node('templateId').attr({
        root: "2.16.840.1.113883.10.20.22.4.52"
    });
    id(sa, data[i].identifiers);
    sa.node('text').node('reference').attr({
        value: refSBADM
    });
    sa.node('statusCode').attr({
        code: 'completed'
    });
    var timeArr = getTimes(data[i].date);
    sa.node('effectiveTime').attr({
        "xsi:type": "IVL_TS",
        value: timeArr[0]
    });
    routeCode(sa, data[i].administration);
    doseQuantity(sa, data[i].administration);
    consumable(sa, data, i, refCONS, templIdCONS);
    performerRevised(sa, data[i]["performer"], {});
};

var rateQuantity = function (xmlDoc, rate) {
    if (rate && rate.value) {
        var attrs = {
            value: rate.value
        };
        if (rate.unit) {
            attrs.unit = rate.unit;
        }
        xmlDoc.node('rateQuantity').attr(attrs);
    } else {
        xmlDoc.node('rateQuantity').attr({
            nullFlavor: 'UNK'
        });
    }
};

var medication_administration = function (xmlDoc, administration) {
    var mdq;
    if (!administration) {
        xmlDoc.node('routeCode').attr({
            nullFlavor: "UNK"
        });
        xmlDoc.node('doseQuantity').attr({
            nullFlavor: "UNK"
        });
        xmlDoc.node('rateQuantity').attr({
            nullFlavor: "UNK"
        });
        mdq = xmlDoc.node('maxDoseQuantity').attr({
            nullFlavor: "UNK"
        });
        mdq.node('numerator').attr({
            nullFlavor: "UNK"
        });
        mdq.node('denominator').attr({
            nullFlavor: "UNK"
        });
        xmlDoc.node('administrationUnitCode').attr({
            nullFlavor: "UNK"
        });
    } else {
        routeCode(xmlDoc, administration);
        doseQuantity(xmlDoc, administration);
        rateQuantity(xmlDoc, administration.rate);
        mdq = xmlDoc.node('maxDoseQuantity').attr({
            nullFlavor: "UNK"
        });
        mdq.node('numerator').attr({
            nullFlavor: "UNK"
        });
        mdq.node('denominator').attr({
            nullFlavor: "UNK"
        });
        if (administration.form) {
            code(xmlDoc, administration.form, 'administrationUnitCode');
        }
    }
};

var maritalStatusCode = function (xmlDoc, marriage_status) {
    if (marriage_status) {
        xmlDoc.node('maritalStatusCode').attr({
            code: marriage_status.substring(0, 1),
            displayName: marriage_status,
            codeSystem: "2.16.840.1.113883.5.2",
            codeSystemName: "MaritalStatusCode"
        });
    } else {
        xmlDoc.node('maritalStatusCode').attr({
            nullFlavor: "UNK"
        });
    }
};

var guardianPerson = function (xmlDoc, guardian) {
    var gName = guardian.names && guardian.names[0];
    if (gName) {
        var gp = xmlDoc.node('guardianPerson');
        var n = gp.node('name');
        n.node('given', gName.first);
        n.node('family', gName.last);
    }
};

var languageCommunication = function (xmlDoc, languages) {
    var lc;
    if (languages && languages[0]) {
        languages.forEach(function (language) {
            lc = xmlDoc.node('languageCommunication');
            if (language.language) {
                lc.node('languageCode').attr({
                    code: language.language
                });
            }
            if (language.mode) {
                var fullCode = reverseTable("2.16.840.1.113883.5.60", language.mode);
                lc.node('modeCode').attr({
                    code: fullCode.code,
                    displayName: language.mode,
                    codeSystem: "2.16.840.1.113883.5.60",
                    codeSystemName: "LanguageAbilityMode"
                });
            }
            if (language.proficiency) {
                lc.node('proficiencyLevelCode').attr({
                    code: language["proficiency"].substring(0, 1),
                    displayName: language.proficiency,
                    codeSystem: "2.16.840.1.113883.5.61",
                    codeSystemName: "LanguageAbilityProficiency"
                });
            } else {
                lc.node('proficiencyLevelCode').attr({
                    nullFlavor: "UNK"
                });
            }
            if (language.hasOwnProperty("preferred")) {
                lc.node('preferenceInd').attr({
                    value: language.preferred.toString()
                });
            }
        });
    } else {
        lc = xmlDoc.node('languageCommunication');
        lc.node('languageCode').attr({
            nullFlavor: "UNK"
        });
        lc.node('modeCode').attr({
            code: "ESP",
            nullFlavor: "UNK"
        });
        lc.node('proficiencyLevelCode').attr({
            nullFlavor: "UNK"
        });
        lc.node('preferenceInd').attr({
            nullFlavor: "UNK"
        });
    }
};

var playingEntity = function (xmlDoc, entity, spec) {
    if (entity) {
        spec = spec ? spec : {};
        var pe = xmlDoc.node('playingEntity');
        if (spec && spec["classCode"]) {
            pe.attr({
                classCode: spec["classCode"]
            });
        }
        if (entity[0].name) {
            pe.node('name', entity[0].name);
        }
    }
};

// generate participant information
var participant = function (xmlDoc, locations, spec) {
    spec = spec ? spec : {};
    if (!locations) {
        xmlDoc.node('participant').attr({
            nullFlavor: "UNK"
        });
    } else {
        var p = xmlDoc.node('participant').attr({
            typeCode: spec.typeCode ? spec.typeCode : "LOC"
        });
        var pr = p.node('participantRole').attr({
            classCode: spec.classCode ? spec.classCode : "SDLOC"
        }); // service delivery location template
        pr.node('templateId').attr({
            root: spec.tId ? spec.tId : "2.16.840.1.113883.10.20.22.4.32"
        });
        if (locations[0].location_type) {
            code(pr, locations[0].location_type);
        }
        addr(pr, locations[0].address);
        tel(pr, locations[0].phone);
        playingEntity(pr, locations, {
            "classCode": "PLC"
        });
    }
};

// generate effectiveTime node
var effectiveTime = function (xmlDoc, time, tag, xsi_type) {
    var node = tag ? tag : 'effectiveTime';
    var t;
    if (Array.isArray(time)) {
        t = xmlDoc.node(node);
        t.node('low').attr({
            value: time[0]
        });
        if (time[2]) {
            t.node('high').attr({
                value: time[2]
            });
        }
    } else if (typeof time === "object") {
        t = xmlDoc.node(node);
        if (xsi_type) {
            t.attr({
                "xsi:type": xsi_type
            });
        }
        if (time.point) {
            t.attr({
                value: time.point[0]
            });
        } else {
            if (time.low) {
                t.node('low').attr({
                    value: time.low[0]
                });
            }
            if (time.high) {
                t.node('high').attr({
                    value: time.high[0]
                });
            }
            if (time.center) {
                t.node('center').attr({
                    value: time.center[0]
                });
            }
        }
    } else {
        xmlDoc.node(node).node('low').attr({
            nullFlavor: "UNK"
        });
    }
};

// used by encounters and medications
var indicationConstraint = function (xmlDoc, findings, time) {
    if (findings) {
        var er = xmlDoc.node('entryRelationship').attr({
            typeCode: "RSON"
        });
        var ob = er.node('observation').attr({
            classCode: "OBS",
            moodCode: "EVN"
        });
        ob.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.19"
        });
        id(ob, findings[0].identifiers);
        ob.node('code')
            .attr({
                code: "404684003"
            })
            .attr({
                displayName: "Finding"
            })
            .attr({
                codeSystem: "2.16.840.1.113883.6.96"
            })
            .attr({
                codeSystemName: "SNOMED CT"
            });
        ob.node('statusCode').attr({
            code: 'completed'
        });
        effectiveTime(ob, time);
        value(ob, findings[0].value, "CD");
    }
};

// generate precondition node
// used in: medications
var precondition = function (xmlDoc, precondition) {
    if (precondition) {
        var pr = xmlDoc.node('precondition').attr({
            typeCode: "PRCN"
        }); // precondition for substance administration
        pr.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.25"
        });
        var cr = pr.node('criterion');
        cr.node('code').attr({
            code: precondition.code.code,
            codeSystem: "2.16.840.1.113883.5.4"
        });
        value(cr, precondition.value, "CE");
    }
};

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
module.exports.asIsCode = asIsCode;
module.exports.addName = addName;
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
