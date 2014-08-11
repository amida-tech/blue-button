//converts CMS Object to the BB.js

var txtToIntObj = require('./cmsTxtToIntObj');
var sectionRouter = require('./sectionRouter').sectionRouter;
var documentKeyMapper = {
    "meta": "meta",
    "demographic": "demographics",
    "self reported medical conditions": "problems",
    "self reported allergies": "allergies",
    "self reported labs and tests": "results",
    "drugs": "medications",
    "self reported immunizations": "immunizations",
    "self reported labs and tests": "results",
    "self reported vital statistics": "vitals",
    "plans": "insurance",
    "employer subsidy": "insurance",
    "primary insurance": "insurance",
    "other insurance": "insurance",
    "preventive services": "plan_of_care",
    "claim summary": "claims",
    "providers": "providers"
};
var bbDocumentModel = {
    "data": {
        "demographics": {},
        "vitals": [],
        "results": [],
        "medications": [],
        "encounters": [],
        "allergies": [],
        "immunizations": [],
        "socialHistory": [],
        "problems": [],
        "procedures": [],
        "insurance": [],
        "claims": [],
        "plan_of_care": [],
        "providers": []
    },
    "meta": {
        "type": "cms",
        "version": ""
    },
    "errors": []
};

// Intermediate JSON is the initially converted JSON model from raw data, convert model based on
//

function convertToBBModel(intermediateObj) {

    //load up the entire document model
    bbDocumentModel = {
        "data": {
            "demographics": {},
            "vitals": [],
            "results": [],
            "medications": [],
            "encounters": [],
            "allergies": [],
            "immunizations": [],
            "socialHistory": [],
            "problems": [],
            "procedures": [],
            "insurance": [],
            "claims": [],
            "plan_of_care": [],
            "providers": []
        },
        "meta": {
            "type": "cms",
            "version": ""
        },
        "errors": []
    };
    // **need to have a function that maps each section of the cms to each section
    // of the bb model
    //first round of processing, by section
    for (var key in intermediateObj) {
        var sectionProcessFunction = sectionRouter(key);
        if (sectionProcessFunction) {
            var section = intermediateObj[key].data;
            var returnedObj = sectionProcessFunction(section, key);
            var parsedSection = returnedObj;
            putDataInBBModel(key, parsedSection, bbDocumentModel);
        }
    }

    /*might want to do some alerting to see which section to process again, based
  on what kind of information there is left. For instance, allergies has
  treatments and one of them has a drug in it. */

    //for now, just process the allergy section.

    var allergiesSection = intermediateObj['self reported allergies'].data;
    var allergiesRerunKey = 'drugs';
    var complexProcessFunction = sectionRouter(allergiesRerunKey);
    var newSection = complexProcessFunction(allergiesSection);
    putDataInBBModel(allergiesRerunKey, newSection, bbDocumentModel);
    cleanUpModel(bbDocumentModel);
    //console.log(bbDocumentModel);
    return bbDocumentModel;
}

function cleanUpModel(bbDocumentModel) {

    for (var x in bbDocumentModel) {
        if (Object.keys(bbDocumentModel[x]).length === 0) {
            delete bbDocumentModel[x];
        }
    }
    var data = bbDocumentModel.data;
    for (var x in data) {
        if (Object.keys(data[x]).length === 0) {
            delete data[x];
        }

    }
}

function putDataInBBModel(key, parsedSection, bbDocumentModel) {
    key = key.toLowerCase();
    if (key in documentKeyMapper) {
        key = documentKeyMapper[key];
    }
    if (key in bbDocumentModel) {
        if (bbDocumentModel[key] instanceof Array) {
            if (parsedSection instanceof Array) {
                for (var x in parsedSection) {
                    bbDocumentModel[key].push(parsedSection[x]);
                }
            } else {
                bbDocumentModel[key].push(parsedSection);
            }
        } else if (typeof bbDocumentModel[key] == 'object') {
            if (parsedSection instanceof Array) {
                for (var y in parsedSection) {
                    bbDocumentModel[key] = parsedSection[y];
                }
            }
        }
    } else if ('data' in bbDocumentModel) {
        putDataInBBModel(key, parsedSection, bbDocumentModel.data);
    }
    return bbDocumentModel;
}

module.exports.convertToBBModel = convertToBBModel;
