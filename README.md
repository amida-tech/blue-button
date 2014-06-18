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
  meta: { version: '0.0.4' },
  errors: 
   [ 'nullFlavor alert:  missing but required streetLines in Address -> Patient -> CCD',
     'nullFlavor alert:  missing but required value in PhysicalQuantity -> MedicationAdministration -> Prescription -> MedicationsSection -> CCD'
     ] }
```

Also, see [/example](./example) for example above as well as how to parse individual sections.

## Link to data model docs in docs/model.md

Detailed description of JSON based data model (tied to CCDA spec)

[JSON based Blue Button data model](./docs/model.md)

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

