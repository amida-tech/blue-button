"use strict";

var isPlainObject = function (o) {
    if (o === null) return false;
    if (o instanceof Date) return false;
    return (['object'].indexOf(typeof o) !== -1);
};

function deepForEach(obj, fns) {
    var inobj = obj;
    fns = fns || {};

    if (fns.pre) {
        obj = fns.pre(obj);
    }

    var ret;
    if (obj === null) {
        ret = null;
    } else if (Array.isArray(obj)) {
        ret = obj.map(function (elt) {
            return deepForEach(elt, fns);
        });
    } else if (isPlainObject(obj)) {
        ret = {};
        Object.keys(obj).forEach(function (k) {
            ret[k] = deepForEach(obj[k], fns);
        });
    } else {
        ret = obj;
    }

    if (fns.post) {
        ret = fns.post(inobj, ret);
    }
    return ret;
}

var DEFAULT_NS = {
    "h": "urn:hl7-org:v3",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance"
};

var xpath = function (doc, p, ns) {
    var r;

    if (doc.find) {
        r = doc.find(p, ns || DEFAULT_NS);
    } else {
        r = [];
        var riter = (doc.ownerDocument || doc).evaluate(p, doc, function (n) {
            return (ns || DEFAULT_NS)[n] || null;
        }, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        while (true) {
            var tmp = riter.iterateNext();
            if (tmp) {
                r.push(tmp);
            } else {
                break;
            }
        }
    }

    return r;
};

var exists = function (obj) {
    return obj !== undefined && obj !== null;
};

module.exports = {
    deepForEach: deepForEach,
    xpath: xpath,
    exists: exists
};
