blue-button
==========

Blue Button JavaScript (Node.js) library

[![Build Status](https://travis-ci.org/amida-tech/blue-button.svg)](https://travis-ci.org/amida-tech/blue-button)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button/badge.png)](https://coveralls.io/r/amida-tech/blue-button)

![blue-button.js](./docs/blue-button-js.png)

THIS IS WORK IN PROGRESS! (see Roadmap below) based on https://github.com/blue-button/bluebutton.js and https://github.com/jmandel/ccda-to-json

After initial re-write we are planning to reintroduce this "fork" back into bluebutton.js community.

## Library interfaces/APIs (Usage examples)

``` javascript

var bb = require("./index.js")

var data = "some xml data here...";

//parse xml into DOM
var doc = bb.xml(data);

//get document type (e.g. CCDA) of parsed document
var type = bb.sense(doc);

//convert document into JSON
var result = bb.parse(doc);

```

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

[Apache](./LICENSE)

todo: references to bb.js and ccda-to-json libraries licenses (both MIT)