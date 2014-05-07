var publicUri = "https://ccda.smartplatforms.org"; // for testing.

var isPlainObject = function(o){
  if (o === null) return false;
  if (o instanceof Date) return false;
  return (['object'].indexOf(typeof o) !== -1);
};

function deepForEach(obj, fns){
  var inobj = obj;
  fns = fns || {};

  if(fns.pre) {
    obj = fns.pre(obj);
  }

  var ret;
  if (obj === null) {
    ret = null;
  } else if (Array.isArray(obj)){
    ret = obj.map(function(elt){
      return deepForEach(elt, fns);
    });
  } else if (isPlainObject(obj)) {
    ret = {};
    Object.keys(obj).forEach(function(k){
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

var xpath = function(doc, p, ns){
  var r;

  if (doc.find) {
    r = doc.find(p, ns || DEFAULT_NS);
  } else {
    r = [];
    var riter = (doc.ownerDocument || doc).evaluate(p, doc, function(n){return (ns || DEFAULT_NS)[n] || null;}, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    while(true){
      var tmp = riter.iterateNext();
      if (tmp) {r.push(tmp);}
      else {break;}
    }
  }

  return r;
};

function tokenizeDemographics(d){
  var ret = [];
  if (d.name) {
    [].push.apply(ret, d.name.givens);
    ret.push(d.name.family);
  }

  if (d.addresss) d.addresses.forEach(function(a){
    if (a.zip) ret.push(a.zip);
    if (a.city) [].push.apply(ret, a.city.split(/\s/));
    if (a.state) ret.push(a.state);
  });

  if (d.medicalRecordNumbers) d.medicalRecordNumbers.forEach(function(mrn){
    if (mrn.root) ret.push(mrn.root);
    if (mrn.extension) ret.push(mrn.extension);
  });

  if (d.gender) ret.push(d.gender);
  if (d.birthTime) ret.push(d.birthTime.toISOString());

  ret = ret.map(function(t){
    return t.toLowerCase();
  });

  return ret;
}


function parseCollectionName(uri){
  return uri.match(/patients\/([^\/]+)\/([^\/]+)\/([^\/]+)/).slice(-2).join("_");
}

function patientUri(patientId){
  return publicUri + "/patients/"+patientId;
}

module.exports = {
  deepForEach: deepForEach,
  xpath: xpath,
  tokenizeDemographics: tokenizeDemographics,
  parseCollectionName: parseCollectionName,
  patientUri: patientUri
};

