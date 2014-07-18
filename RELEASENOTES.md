# blue-button.js Release Notes

# v1.0.4 - Jul 18, 2014
- Bug fix on handling null or UNK encounter in cleanup step

# v1.0.3 - Jul 18, 2014
- Updates to data models
- CCDA export functionality
- CMS parsing functionality

# v1.0.1 - June 17, 2014

Incremental bug-fix release of blue-button.js library.

- Standardized coded entry structure.
- Procedure Performer Identifier support.
- Lab Result status support.
- Standardized name between medications/immunization administration.
- Standarized body_site structure.
- Fixed email/telecom issue.
- Documentation enhancements.


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


