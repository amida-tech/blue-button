# blue-button.js Release Notes

# v1.0.0 - May 31, 2014

This is the initial release of blue-button.js library.

- Supports subset of CCDA format
	- Specifically Continuity of Care Document template with following sections
		- required sections (allergies, medications, problems, procedures, lab results)
		- optional sections (encounters, immunizations, vitals)
		- social history (smoking status only)
- Introduced JSON model for storing CCDA data
- Node.js support only (no browser support)
- Relies on libxml.js library for XML parsing
- Published as NPM package
	- to install/use `npm install blue-button`
- Comprehensive set of test based on samples from https://github.com/chb/sample_ccdas


