blue-button
==========

Blue Button JavaScript (Node.js) library

[![NPM](https://nodei.co/npm/blue-button.png)](https://nodei.co/npm/blue-button/)

[![Build Status](https://travis-ci.org/amida-tech/blue-button.svg)](https://travis-ci.org/amida-tech/blue-button)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button/badge.png)](https://coveralls.io/r/amida-tech/blue-button)

![blue-button.js](./docs/blue-button-js.png)

## Library interfaces/APIs

This library provides following functionality

- Parse XML documents (via libxmljs)
- Sense type of data (e.g. CCDA, C32, etc)
- Parse CCDA into JSON representation
	- Parse CCDA elements (sections) into JSON representation
- Generating JSON object based on data model

### Usage example

Require blue-button module

``` javascript
var bb = require("blue-button")
```

Load some XML and parse it

``` javascript
var data = "some CCDA.xml data here...";

//parse xml into JS object
var doc = bb.parseXml(data);
```

Check XML parsing errors

``` javascript
console.log(doc.errors);
```

should be:

``` javascript
[]
``` 

here is XML itself:

``` javascript
console.log(doc.toString());
```

should be:

``` xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
<!-- Title: US_Realm_Header_Template -->
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3" xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
  <!-- ******************************************************** CDA Header 
		******************************************************** -->
  <realmCode code="US"/>
  <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>
  <!-- US General Header Template -->
  <templateId root="2.16.840.1.113883.10.20.22.1.1"/>
  <!-- *** Note: The next templateId, code and title will differ depending 
		on what type of document is being sent. *** -->
  <!-- conforms to the document specific requirements -->
  <templateId root="2.16.840.1.113883.10.20.22.1.2"/>
  
  ...and so on
```

Let's sense document type from parsed XML:

``` javascript
//get document type (e.g. CCDA) of parsed document
var type = bb.senseXml(doc);

console.log(type);
```

getting:

``` javascript
{ type: 'ccda' }
```

Let's sense document type from string with health data:

``` javascript
//get document type (e.g. CCDA) of document from string (and return parsed xml if it is xml based type)
var result = bb.senseString(data);

//printing result:
console.log(result);
```

getting type as well as parsed XML for later user:

``` javascript
{ type: 'ccda', xml: { errors: [] } }
//xml "errors" is just default print of libxmljs parsed XML object

//in case of JSON stringified input, it will return {type: 'json', json: [json object here]}
```

Sensing CMS Blue Button data in text file:

``` javascript
//get document type (e.g. CMS) of document from string (and return format version)
var result = bb.senseString(data);

//printing result:
console.log(result); 
```
getting:

``` javascript
{ type: 'cms', version: '2.0' }
```

getting type as well as parsed XML for later user:

``` javascript

{ type: 'ccda', xml: { errors: [] } }
//xml "errors" is just default print of libxmljs parsed XML object

//in case of JSON stringified input, it will return {type: 'json', json: [json object here]}

```

Parsing into JSON data model from CMS text file

``` javascript
//read in the file
var textString = fs.readFileSync("cms_sample.txt").toString(); 

//convert the string text file into blue button model
var result = bb.parseText(textString); 

console.log(result);
```
getting:

``` javascript

{ data: 
   { demographics: 
      { name: [Object],
        dob: [Object],
        email: [Object],
        phone: [Object],
        address: [Object] },
     vitals: [ [Object], [Object] ],
     results: [ [Object] ],
     medications: [ [Object], [Object] ],
     allergies: [ [Object], [Object] ],
     immunizations: [ [Object], [Object], [Object] ],
     problems: [ [Object], [Object] ],
     insurance: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
     claims: [ [Object], [Object], [Object], [Object], [Object] ] },
  meta: 
   { type: 'cms',
     version: '2.0',
     timestamp: { date: '2013-03-16T05:10:00Z', precision: 'minute' },
     sections: ['demographics', ..., 'claims'] } }

``` 

Parsing into JSON data model from XML or from string

``` javascript
//convert Xml document into JSON
var result = bb.parseXml(doc);

//convert string into JSON
var result = bb.parseString(data);

console.log(result);
```

getting:

``` javascript
{ data: 
   { demographics: 
      { name: [Object],
        dob: [Object],
        ...
        birthplace: [Object],
        guardians: [Object] },
     vitals: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
     results: [ [Object] ],
     medications: [ [Object] ],
     encounters: [ [Object] ],
     allergies: [ [Object], [Object], [Object] ],
     immunizations: [ [Object], [Object], [Object], [Object] ],
     socialHistory: [ [Object] ],
     problems: [ [Object], [Object] ],
     procedures: [ [Object], [Object], [Object] ] },
  meta: {
        version: "1.1.0-beta.1",
        sections: [
            "demographics",
            "vitals",
            "results",
            "medications",
            "encounters",
            "allergies",
            "immunizations",
            "social_history",
            "problems",
            "procedures",
            "plan_of_care",
            "payers"
        ]
  },
  errors: 
   [ 'nullFlavor alert:  missing but required streetLines in Address -> Patient -> CCD',
     'nullFlavor alert:  missing but required value in PhysicalQuantity -> MedicationAdministration -> Prescription -> MedicationsSection -> CCD'
     ] }
```

Also, see [/example](./example) for example above as well as how to parse individual sections.
***

## CCDA Generation: Introduction
This module converts data in JSON format (originally parsed from a CCDA) back to CCDA/blue-button format. The module determines the 
section template to which the JSON data belongs to, runs the data through the appropriate templater, and generates the corresponding CCDA/blue-button section. An entire CCDA document can be generated by iteravitely running the JSON data through the templaters for each section. 

The API exposes genWholeCCDA() for this purpose, which takes in CCDA data in JSON format as a parameter and converts it into CCDA/XML.

The module uses libxmljs for its templaters and uses a JS XML DOM implementation (https://github.com/jindw/xmldom) to traverse the generated and expected XML documents for testing and compare them by node (tagName) and by attribute and value. 

## CCDA Generation: Testing
A suite of tests and a test class (test/test-generator and test/test-lib, respectively) help in verifying that the generated CCDA is accurate. Tests include: 
  - parsing ccda to json, generating back the ccda from json, and comparing the original and generated ccdas for differences. 
  - parsing, generating, and parsing again, comparing the first parsed JSON data with the second parsed JSON data for equality. 
  - Comparing a specific, single section of CCDA to the original specific, single section, achieving testing granularity. 
  - Testing the generator against the entire corpora of ccda documents at: https://github.com/chb/sample_ccdas using the internal     ccda_explorer module
  
The testing class/library provides methods to compare two XML/CCDA documents by recursively walking the XML document tree and comparing two documents node-by-node. Assertion-based or diff-based testing can be used with this library by setting the appropriate flags. The default settings ignore comments, whitespace, newlines, tab or text nodes. Here is an example of diff-based testing output after testing the CCDA Procedures Section:

````
PROCESSING PROCEDURES
Error: Generated number of child nodes different from expected (generated: 0 at lineNumber: 8, expected: 1 at lineNumber:12
Error: Generated number of child nodes different from expected (generated: 11 at lineNumber: 10, expected: 10 at lineNumber:32
Attributes mismatch. Different lengths: 1 attributes but expected 0 attributes @ lineNumber: 70, 94
Error: Generated number of child nodes different from expected (generated: 10 at lineNumber: 71, expected: 11 at lineNumber:95
Attributes mismatch. Different lengths: 1 attributes but expected 0 attributes @ lineNumber: 119, 149

Error: Attributes mismatch: Encountered: moodCode="EVN" but expected: moodCode="INT" @ lineNumber: 120, 150
Error: Encountered different tagNames: Encountered <code> but expected <priorityCode>, lineNumber: 130, 161
Error: Generated number of child nodes different from expected (generated: 4 at lineNumber: 151, expected: 5 at lineNumber:182
ERRORS: 8
````



**Alterable flags (in test-lib.js)**:   
  -PROMPT_TO_SKIP: If set to true, will prompt the user to either skip or not skip the failed test.  
  -DIFF (default): If set to true, will continue execution even upon failing a test and will output all of the errors/differences to the console. This is the default setting.  

**Alterable settings (testXML.error_settings in test-lib.js)**:   
  -"silence_cap": If set to true, will silence the output of capitalization errors. False by default.      
  -"silence_len": If set to true, will silence the output of attribute length errors (i.e. actual node has 2 attributes but expected node has 3 attributes). False by default.

**Test suite settings**:   
  -TEST_CCDA_SAMPLES: uses ccda-explorer to test against sample_ccdas    
  -TEST_CCD: tests against one generic sample ccda   
  -TEST_SECTIONS: tests each section individually  


***


## Link to data model docs in docs/model.md

Detailed description of JSON based data model (tied to CCDA spec)

[JSON based Blue Button data model](./docs/model.md)

[CMS Documentation](./docs/cms.md)

## Goals

- Full support of CCDA
- Ability to extend to support other data formats (e.g. C32)
- Solid, well-documented JSON-based data model for patient health data
- Modularity - easy to extend (both parser and data model) in the future
- Node.js support
- Browser support (sometime later)
- Speed of parsing
- Well tested on entire corpora of CCDA samples from https://github.com/jmandel/sample_ccdas

## Roadmap (End of May, Release 1.0)

- First file format is the "Continuity of Care Document", a Blue Button format type that capture’s entire patients medical history.  The CCD is comprised of five required sections (allergies, medications, problems, procedures, lab results) and three optional sections (encounters, immunizations, vitals).
- CCDA JSON data model is fully defined as separate library with validation support
- bluebutton.js parser is rewriten for speed and support of updated CCDA JSON data model
- Uses libxmljs parser (under Node.js environment) or browser based parser for XML
- Comprehensive test for Node.js module (with Mocha/Chai)

## Future Roadmap

- C32 support reintroduced
- Full browser support for all functionality
- Merge back into bluebutton.js repo
- Comprehensive test for browser environment
- After initial re-write we are planning to reintroduce this "fork" back into bluebutton.js community.

## Contributing

Contributors are welcome. See issues https://github.com/amida-tech/blue-button/issues

## Release Notes

See release notes [here] (./RELEASENOTES.md)

## License

Licensed under [Apache 2.0](./LICENSE)

Project was influenced by and used some code from:

[bluebutton.js library](https://github.com/blue-button/bluebutton.js/) licensed under [MIT](https://github.com/blue-button/bluebutton.js/blob/master/LICENSE.md)

[Josh Mandel's ccda-to-json library](https://github.com/jmandel/ccda-to-json) licensed under [Apache 2.0] (https://github.com/jmandel/ccda-to-json/blob/master/LICENSE)

