blue-button
==========

Blue Button JavaScript library

[![NPM](https://nodei.co/npm/blue-button.png)](https://nodei.co/npm/blue-button/)

[![Build Status](https://travis-ci.org/amida-tech/blue-button.svg)](https://travis-ci.org/amida-tech/blue-button)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button/badge.png)](https://coveralls.io/r/amida-tech/blue-button)

![blue-button.js](./docs/blue-button-js.png)

This library provides the following functionality

- Parse XML documents
- Sense type of data (CCDA, CMS, C32, etc.)
- Parse CCDA into JSON representation
	- Parse CCDA elements (sections) into JSON representation
- Parse C32 into JSON representation
	- Parse C32 elements (sections) into JSON representation
- Parse CMS into JSON representation
- Generate JSON object based on data model
- Generate CCDA from JSON object

Actual implementation of sensing type of data and parsing CCDA and C32 reside in this repository.  Implementation of other functionalities reside in 
- [blue-button-xml](https://github.com/amida-tech/blue-button-xml) provides XML parsing infrastructure
- [blue-button-cms](https://github.com/amida-tech/blue-button-cms) provides CMS parsing
- [blue-button-model](https://github.com/amida-tech/blue-button-model) provides data model schema and validation
- [blue-button-generate](https://github.com/amida-tech/blue-button-generate) provides CCDA generation from JSON

This library is primarily implemented for [node.js](http://nodejs.org) and is available via [npm](https://www.npmjs.org/doc/cli/npm.html). A browser version is also available via [bower](http://bower.io/). The browser version is created using [browserify](http://browserify.org) and can be used in the same way that you would use it in [node.js](http://nodejs.org).  

## Usage

Require blue-button module
``` javascript
var bb = require("blue-button")
```
Load some health data content.  Currently CCDA (CCD), C32 and CMS are supported
``` javascript
var data = "some CCDA.xml, C32.xml or CMS.txt here...";
```
Generate JSON representation of the health data
``` javascript
var doc = bb.parse(data);
```
[`parse`](#parse) method senses the type of the health data, parses and converts it into JSON.  All types of health data is converted into a [common model](http://developers.amida-tech.com/document_model.html).  Validate `doc` according to the [common model](http://developers.amida-tech.com/document_model.html) schema 
``` javascript
var valid = bb.validator.validateDocumentModel(doc);
if (! valid) {
	throw new Error('failed');
}
```
Do changes to `doc` in your application
``` javascript
doc.data.demographics.phone.number = "(555)555-5555";
```
Create a CCDA (CCD) document that includes your changes
``` javascript
var modifiedDataCCD = bb.generateCCDA(doc);
```

<a name="dataModel" />
## Data Model

Blue Button library converts all types of health data (CCDA, C32, CMS) into a [common model](https://github.com/amida-tech/blue-button-model/blob/master/docs/model.md).  Data model schema and validation implementation can be found in [blue-button-model](https://github.com/amida-tech/blue-button-model).

## API

### XML Utilities

Blue Button library provides basic XML parsing and [XPath](http://www.w3.org/TR/xpath) functionality via [libxmljs](https://github.com/polotek/libxmljs) (node.js) and [DomParser](http://www.w3schools.com/dom/dom_parser.asp) (browsers).  All XML related API methods are inherited from [blue-button-xml](https://github.com/amida-tech/blue-button-xml) and available from `xml` object
``` javascript
var xml = bb.xml;
```

<a name="parse" />
#### parse(src)

Parses XML content string into an XML Object which can be used in other API methods.  Details of the actual XML object can be found in the documentation of underlying libraries [libxmljs](https://github.com/polotek/libxmljs) (node.js) and [DomParser](http://www.w3schools.com/dom/dom_parser.asp) (browsers).

__Arguments__

* `src` - XML content in string.
* returns - XML Object.

#### xpath(doc, p, ns)

Finds the XML nodes that are specified by `p`.

__Arguments__

* `doc` - XML document or any parent XML node inside the document that is found by a previous `xpath` call.
* `p` - A valid [XPath](http://www.w3.org/TR/xpath) string.
* `ns` - XML namespace specifications.  By default `h: urn:hl7-org:v3"` and `xsi: http://www.w3.org/2001/XMLSchema-instance` are used as they are the namespaces used in CCDA.
* returns - XML object node.

<a name="parse" />
### Sensing

#### senseString(data)

Senses the type of the string content.  

__Arguments__

* `data` - String content for which the type is to be found.
* returns - A result object.  In the case of an error either `null` is returned or an error is thrown.  Result object has the following properties
  * `type` -  A string that identifies the type of the content.  Currently can be `ccda`, `c32`, `cda`, `xml`, `cms`, `va`, `format-x`, `json`, `blue-button.js`, `va`, `pdf` or `unknown`.
  * `xml` - In the case of XML content (`ccda`, `c32`, `cda`, `xml`) this is set to the parsed XML object.
  * `json` - In the case of JSON content (`blue-button.js`, `json`) this is set to the passed JSON object.

#### senseXml(data)

Senses the type of an XML object.

__Arguments__

* `data` - XML object for which the type is to be found.
* returns - A result object.  In the case of an error either `null` is returned or an error is thrown.  Result object has the following properties
  * `type` -  A string that identifies the type of the content.  Currently can be `ccda`, `c32`, `cda`, `xml`, `unknown`.

### JSON Generation

<a name="parseJSON" />
#### parse(data, options)

This is the primary method in Blue Button library that both senses the type of the input content and generates JSON out of it.  Underneath it calls to other [sensing](#sensing) and JSON generation methods.

__Arguments__

* `data` - Any string data content.  Currently CCDA (CCD), C32 and CMS are supported.
* options - The following properties are supported
  * `component` - Specifies a component of CCDA or C32 document; not used for CMS documents.  `data` should only contain content for the component.    The following CCDA (CCD) sections are supported: `ccda_demographics`, `ccda_vitals`, `ccda_medications`, `ccda_problems`, `ccda_immunizations`, `ccda_results`, `ccda_allergies`, `ccda_encounters`, `ccda_procedures`, `ccda_social_history`, `ccda_plan_of_care`, `ccda_payers`.  The following C32 sections are supported: `c32_demographics`, `c32_vitals`, `c32_medications`, `c32_problems`, `c32_immunizations`, `c32_results`, `c32_allergies`, `c32_encounters`, `c32_procedures`.  In addition individual entries in each section can also be specified (`ccda_vitals_entry`, `ccda_medications_entry`, ..., `c32_vitals_entry`, ...).
* returns - [JSON representation](#dataModel) of the data.

#### parseString(data, options)

This is similar to [`parse`](#parseJSON) but it assumes `data` to be valid XML.

#### parseXml(data, options)

This is similar to [`parse`](#parseJSON) but it assumes `data` to be an XML object.

#### parseText(data)

This is similar to [`parse`](#parseJSON) but it assumes `data` to be Text (ASCII) and `options` is not used.  Currently only Text content in CMS format is supported.

### CCDA (CCD) Generation

#### generateCCDA(doc)

This generates a CCDA (CCD) document from a JSON object.

* `doc` -  A JSON object that in format similar to specified by specified by [`parse`](#parseJSON).
* returns - CCD document as a string.

## Examples

See scripts in [/example](./example) or [/test](./test) directories that use the above API methods for CCDA, C32 and CMS examples.

## Goals

- Full support of CCDA, C32 and CMS
- Ability to extend to support other data formats
- Solid, well-documented JSON-based data model for patient health data
- Modularity - easy to extend (both parser and data model)
- Node.js support
- Browser support
- Speed of parsing
- Well tested on entire corpora of CCDA samples from https://github.com/jmandel/sample_ccdas

## Future Roadmap

- Merge back into bluebutton.js repo
- Refactoring into smaller components (sub-modules)

## Contributing

Contributors are welcome. See issues https://github.com/amida-tech/blue-button/issues

## Release Notes

See release notes [here] (./RELEASENOTES.md)

## License

Licensed under [Apache 2.0](./LICENSE)

Project was influenced by and used some code from:

[bluebutton.js library](https://github.com/blue-button/bluebutton.js/) licensed under [MIT](https://github.com/blue-button/bluebutton.js/blob/master/LICENSE.md)

[Josh Mandel's ccda-to-json library](https://github.com/jmandel/ccda-to-json) licensed under [Apache 2.0] (https://github.com/jmandel/ccda-to-json/blob/master/LICENSE)

