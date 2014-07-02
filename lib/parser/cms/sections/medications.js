var commonFunctions = require('./commonFunctions');

function parseMedications(sectionObj) {

    //setup templates for common function


    /*apply special functions to medications, take out the fields from original cms
  parser, store them in an intermediary object.*/

    //console.log(sectionObj);

    var result = [];
    var child;
    /*Ultimately, this code is for the sole purpose of rerunning medications
  code on allergies */
    var productKeys = ['drug name', 'comments'];
    for (var key in sectionObj) {
        child = sectionObj[key];
        var parsedObj = {};
        for (var x in productKeys) {
            var productKey = productKeys[x];
            if (productKey in child && child[productKey].length > 0) {
                var resultType = child[productKey].toLowerCase();
                var processedProduct = processProduct(child);
                if (processedProduct.date !== undefined) {
                    if (processedProduct.date.length > 0) {
                            parsedObj.date = processedProduct.date;
                            delete processedProduct.date;
                    }

                }
                parsedObj.product = processedProduct;
                parsedObj.sig = child[productKey].toLowerCase();
                parsedObj.status = 'Completed'


                result.push(parsedObj);
            }
            /*be selective about what sections you want to pass into shared parser
       you don't want to pass a section with a blank entry for comments. */
            if (productKey in child && child[productKey].length <= 0) {
                delete sectionObj[key];
            }
        }
    }
    //extremely crare case when you DON'T want the corresponding field to be included
    return result;
}


function processProduct(childObj) {
    var productObj = {};
    var drugName;
    var parseCodedEntry = commonFunctions.getFunction(
        'cda_coded_entry');
    var dateArray = [];
    if ('drug name' in childObj) {
        drugName = parseCodedEntry(childObj['drug name']);
        productObj.product = drugName;
        productObj.unencoded_name = childObj['drug name'];
    } else if ('comments' in childObj) {
        //do check to make sure comments has a drug
        drugName = parseCodedEntry(childObj.comments);
        productObj.product = drugName;
        productObj.unencoded_name = childObj.comments;
        if ('last treatment date' in childObj) {
            var value = childObj['last treatment date'];
            if (value.length !== 0) {
                var processDate = commonFunctions.getFunction('cda_date');
                dateArray.push(processDate(value));
            }
        }
    }

    if (dateArray.length > 0) {
        productObj.date = dateArray;
    }

    return productObj;
}





module.exports = parseMedications;
