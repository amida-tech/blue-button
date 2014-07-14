var walk = require("walk");
var libxmljs = require("libxmljs");
var fs = require("fs");
var meta = require("blue-button-meta");

// var bb = require("blue-button");
var bb = require("../index.js");

var count = 0;

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

var DEFAULT_NS = {
  "h": "urn:hl7-org:v3",
  "xsi": "http://www.w3.org/2001/XMLSchema-instance"
};

var root_path="./dump/";

function parse(vendor, vendor_id, file_id, filename) {
    stats = {};
    stats.template = "";
    stats.xml_sections = [];

    // readfile
    var data = fs.readFileSync(filename).toString();

    var xmlDoc = libxmljs.parseXmlString(data);    
    var item;
    for (item in meta.templates) {
        var templates = xmlDoc.get('/h:ClinicalDocument/h:templateId[@root="' + meta.templates[item]["templateId"] + '"]', DEFAULT_NS);
        if (templates) {
            // console.log(meta.templates[item]["name"]);
            stats.template = meta.templates[item]["name"];
        }
    }

    for (item in meta.sections) {
        for (var item2 in meta.sections[item]["templateIds"]) {
            var templates = xmlDoc.get('//h:structuredBody/h:component/h:section/h:templateId[@root="'+meta.sections[item]["templateIds"][item2]+'"]', DEFAULT_NS);
            if (templates) {
                //console.log(meta.sections[item]["name"]);
                stats.xml_sections.push(meta.sections[item]["name"]);
            }
        }
        // var entries = xmlDoc.get('//h:structuredBody/h:component/h:section/h:templateId[@root="'+meta.sections[item]["templateIds"][0]+'"]', DEFAULT_NS);
    }

    console.log(stats);

    // save file xml
    fs.writeFileSync(root_path + vendor_id + "-" + file_id + ".xml", data);

    //save file JSON
    try {
        var result = bb.parseString(data);
        stats.full=true;

        var json=JSON.stringify(result, null, 4);
        fs.writeFileSync(root_path+vendor_id+"-"+file_id+".json", json);
    }
    catch (ex) {
        stats.full=false;
    }

    //save sections xml
    var sections=["ccda_demographics","ccda_procedures","ccda_socialHistory","ccda_allergies","ccda_encounters",
    "ccda_medications","ccda_problems","ccda_immunizations","ccda_vitals","ccda_results"];

    //save sections JSON
    for (section in sections) {
        try {
            var result = bb.parseString(data, {component:sections[section]});
            stats[sections[section]]=true;

            var json=JSON.stringify(result, null, 4);
            fs.writeFileSync(root_path+vendor_id+"-"+file_id+"-"+sections[section]+".json", json);
        }
        catch (ex) {
            stats[sections[section]]=false;
        }


    }

    //report breakage in all sections back to caller

    return stats;
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

var files = [];

var samples = {};

//walk all folders in samples to get list of CCDA files
function walkCCDAFiles(dir, process) {
    var walker = walk.walk(dir, {});

    walker.on("file", function(root, fileStats, next) {
        if (getExtension(fileStats.name) === ".xml" || fileStats.name === "CCDA_Sample_NextGen_JonesIsabella.txt") {
            //explore(root+"/"+fileStats.name);

            var subpath = root.substr(dir.length + 1);

            if (!(subpath in samples)) {
                samples[subpath] = {files:[]};
            }

            samples[subpath].files.push(root + "/" + fileStats.name);

        }
        next();
    });

    walker.on("end", function() {
        //console.log("files");
        process();
    });

};

walkCCDAFiles("./sample_ccdas", process);

// process compiled list of CCDA sample files
function process()
{
    console.log(samples);

    var total = 0;
    for (item in samples) {
        total = total + samples[item].files.length;
        console.log(item, samples[item].files.length);
    }

    console.log(total);

    // iterate through all
    var index = 0;
    for (item in samples) {
        samples[item].index = index;

        samples[item].full = [];
        samples[item].sections = [];

        for (file in samples[item].files) {
            console.log(">>",item," | ", index," | ", file," | ", samples[item].files[file]);

            var stats = parse(item, index, file, samples[item].files[file]);

            samples[item].full[file] = stats.full;
            samples[item].sections[file] = stats;
        }
        index = index + 1;
        // if (index > 7) break;
    }

    // console.log(samples);

    var st = JSON.stringify(samples, null, 4);
    fs.writeFileSync(root_path +"stats.json", st);


    console.log(meta.templates);
}