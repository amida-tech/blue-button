var walk = require("walk");
var libxmljs = require("libxmljs");
var fs = require("fs");

var meta = require("blue-button-meta");

//var bb = require("blue-button");
var bb = require("../../amida-tech/blue-button/index.js");

var count=0;


function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

var DEFAULT_NS = {
  "h": "urn:hl7-org:v3",
  "xsi": "http://www.w3.org/2001/XMLSchema-instance"
};

function explore(path){
    try {
        var data = fs.readFileSync(path).toString();

        var s = bb.senseString(data);

        if (s.type==="ccda") {
            var r=bb.xml(data);
            if (r.errors.length>0) {
                //console.log(e.errors);
            }
            else {
                var s = bb.senseXml(r);
                //console.log(s);

                //var d = bb.parseXml(r, {component:"ccda_demographics"}); //errors: 0
                //var d = bb.parseXml(r, {component:"ccda_procedures"}); //errors: 20
                //var d = bb.parseXml(r, {component:"ccda_socialHistory"}); //errors: 0
                //var d = bb.parseXml(r, {component:"ccda_allergies"}); //errors: 26
                //var d = bb.parseXml(r, {component:"ccda_encounters"}); //errors: 12
                //var d = bb.parseXml(r, {component:"ccda_medications"}); //errors: 46
                //var d = bb.parseXml(r, {component:"ccda_problems"}); //errors: 20
                //var d = bb.parseXml(r, {component:"ccda_imunizations"}); //errors: 0
                //var d = bb.parseXml(r, {component:"ccda_vitals"}); //errors: 1
                //var d = bb.parseXml(r, {component:"ccda_results"}); //errors: 119

                //var d = bb.parseXml(r); //errors: 346
                
                //console.log(d);


                /*
                    var xmlDoc = libxmljs.parseXmlString(data.toString());
                    //var section = xmlDoc.get('//h:component[h:section/h:templateId/@root="2.16.840.1.113883.10.20.22.2.4"]', DEFAULT_NS);
                    for (item in meta.templates) {
                        var templates = xmlDoc.get('/h:ClinicalDocument/h:templateId[@root="'+meta.templates[item]["templateId"]+'"]', DEFAULT_NS);
                        //if (templates) console.log(meta.templates[item]["name"]);
                    }

                    for (item in meta.sections) {
                        var templates = xmlDoc.get('//h:structuredBody/h:component/h:section/h:templateId[@root="'+meta.sections[item]["templateIds"][0]+'"]', DEFAULT_NS);
                        //if (templates) console.log(meta.sections[item]["name"]);

                        //var entries = xmlDoc.get('//h:structuredBody/h:component/h:section/h:templateId[@root="'+meta.sections[item]["templateIds"][0]+'"]', DEFAULT_NS);

                    }

                    //var section = xmlDoc.get('//h:component[h:section/h:templateId/@root="2.16.840.1.113883.10.20.22.2.3"]', DEFAULT_NS);

                    //console.log(section.toString(true));

                    //console.log(xmlDoc);
                */
            }
        }
    }
    catch(ex)
    {
        console.log("");
        console.log("-------------==============");
        console.log(path);
        console.log("path: ",path," error: ",ex);
        //console.log(new Error().stack);

        count=count+1;

        console.log("error count:", count);
    }
}

function handleCCDFiles(dir) {
    var walker = walk.walk(dir, {});
    walker.on("directories", function(root, dirStatsArray, next) {
        next();
    });
    walker.on("file", function(root, fileStats, next) {
        //console.log(root, " | ",fileStats.name);
        //console.log(fileStats);
        if (getExtension(fileStats.name)===".xml") {
            explore(root+"/"+fileStats.name);
        }
        if (getExtension(fileStats.name)===".txt") {
            explore(root+"/"+fileStats.name);
        }
        next();
    });
    walker.on("errors", function(root, nodeStatsArray, next) {
        next();
    });

    walker.on("end", function(root, nodeStatsArray, next) {
        console.log("files");
        next();
    });

};


handleCCDFiles("./sample_ccdas");

//discover("./sample_ccdas", {allergies: ['multipleReactions', 'multipleObservations']});


//console.log(JSON.stringify(meta, null, 4));