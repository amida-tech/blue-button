exports.deepDelete = function deepDelete(obj, prop) {
    if (typeof obj === 'object') {
        delete obj[prop];
        Object.keys(obj).forEach(function(key) {
            deepDelete(obj[key], prop);
        });
    }
};

exports.jsonParseWithDate = function(str) {
    return JSON.parse(str, function(key, value) {
        var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        if (typeof value === 'string') {
            var a = reISO.exec(value);
            if (a) {
                return new Date(value);
            }
        }
        return value;
    });   
};
