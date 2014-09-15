# blue-button.js Release Notes


# v.1.2.0 - September 15, 2014
- Enhanced to include support for US VA 32 Files.
- Standardized Insurance Objects Across CMS/CCDA Files.
- Initial CDA R1 CCD Support.
- Fixed several hardcoding issues in CCDA Generation.
- Added more condititionals for durable CCDA Generation.

# v.1.1.0 - September 2, 2014
- Complete review and overhaul of Blue Button JSON data model
	- Includes standard way to handle date_time and coded entries
- Implemented JSON Schema based model validation
- Sense method to detect variety of health record formats
- CCDA parser is updated for latest changes in data model
- CMS parser is updated for latest changes in data model
- CCDA generator update for latest model changes 
	- including data parsed from CMS (only sections covered by CCDA standard)
- Switched to blue-button-meta.js library for all standard lookups 
- Simplified test harness

# v1.0.4 - July 18, 2014
- Bug fix on handling null or UNK encounter in cleanup step

# v1.0.3 - July 18, 2014
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


