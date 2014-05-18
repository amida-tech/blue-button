blue-button
==========

Blue Button JavaScript (Node.js) library

[![NPM](https://nodei.co/npm/blue-button.png)](https://nodei.co/npm/blue-button/)

[![Build Status](https://travis-ci.org/amida-tech/blue-button.svg)](https://travis-ci.org/amida-tech/blue-button)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button/badge.png)](https://coveralls.io/r/amida-tech/blue-button)

![blue-button.js](./docs/blue-button-js.png)

THIS IS WORK IN PROGRESS! (see Roadmap below) based on https://github.com/blue-button/bluebutton.js and https://github.com/jmandel/ccda-to-json

After initial re-write we are planning to reintroduce this "fork" back into bluebutton.js community.

## Library interfaces/APIs (Usage examples)

This library provides following functionality

- Parse XML documents (via libxmljs)
- Sense type of data (e.g. CCDA, C32, etc)
- Parse CCDA into JSON representation
	- Parse CCDA elements (sections) into JSON representation
- Validation of JSON object against data model

``` javascript

var bb = require("./index.js")

var data = "some xml data here...";

//parse xml into JS object
var doc = bb.xml(data);

//get document type (e.g. CCDA) of parsed document
var type = bb.senseXml(doc);

//get document type (e.g. CCDA) of document from string (and return parsed xml if it is xml based type)
var result = bb.senseXml(data);

// result =
// {"type":"CCDA", "xml":"parsed xml object here..."}

//convert Xml document into JSON
var result = bb.parseXml(doc);

//convert string into JSON
var result = bb.parseString(data);

// result =
// {"data":"JSON model compliant data here...", "meta":{"version":"1.0.0","type":"CCDA", ... some other metadata}}


```

Also, see [/example](./example)

## Link to data model docs in docs/model.md

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

## Contributing

Contributors are welcome. See issues https://github.com/amida-tech/blue-button/issues

## License

Licensed under [Apache 2.0](./LICENSE)

Project is influenced and used some code from:

[bluebutton.js library](https://github.com/blue-button/bluebutton.js/) licensed under [MIT](https://github.com/blue-button/bluebutton.js/blob/master/LICENSE.md)

[Josh Mandel's ccda-to-json library](https://github.com/jmandel/ccda-to-json) licensed under [Apache 2.0] (https://github.com/jmandel/ccda-to-json/blob/master/LICENSE)

