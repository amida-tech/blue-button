# Data Models

This area documents the JSON data models which are produced by the library; each section is detailed in its own file.  Unsupported Sections are optional elements which aren't currently implemented.  Please feel free to issue a pull request for support of these sections (so long as it has tests).

JSON doesn't currently have a standard schema language; consequently these models are written to be used in a [Mongoose.js](http://www.mongoosejs.com) compatible schema.

There are components common to multiple sections and are defined [here](sections/shared.md).

###Required Sections:

- [Allergies model](sections/allergies.md) 
	- [JSON/XML sample](sections/samples/allergies.md)
	- [JSON/CMS sample](sections/cmssamples/allergies.md)
- [Medications model](sections/medications.md) 
	- [JSON/XML sample](sections/samples/medications.md)
	- [JSON/CMS sample](sections/cmssamples/medications.md)
- [Problems model](sections/problems.md)
	- [JSON/XML sample](sections/samples/problems.md)
	- [JSON/CMS sample](sections/cmssamples/problems.md)
- [Results model](sections/results.md) 
	- [JSON/XML sample](sections/samples/results.md)
	- [JSON/CMS sample](sections/cmssamples/results.md)
- [Demographics model](sections/demographics.md) 
	- [JSON/XML sample](sections/samples/demographics.md)
	- [JSON/CMS sample](sections/cmssamples/demographics.md)

###Optional Sections:

- [Procedures model](sections/procedures.md) 
	- [JSON/XML sample](sections/samples/procedures.md)
- [Encounters model](sections/encounters.md) 
	- [JSON/XML sample](sections/samples/encounters.md)
- [Immunizations model](sections/immunizations.md) 
	- [JSON/XML sample](sections/samples/immunizations.md)
	- [JSON/CMS sample](sections/cmssamples/immunizations.md)
- [Vitals model](sections/vitals.md) 
	- [JSON/XML sample](sections/samples/vitals.md)
	- [JSON/CMS sample](sections/cmssamples/vitals.md)
- [Social History model](sections/socialHistory.md) 
	- [JSON/XML sample](sections/samples/socialHistory.md)
- [Insurance model](sections/insurances.md) 
	- [JSON/CMS sample](sections/cmssamples/insurances.md)
- [Claims model](sections/claims.md) 
	- [JSON/CMS sample](sections/cmssamples/claims.md)
- Plan of Care model
	- [JSON/XML sample](sections/samples/plan_of_care.md)
- Payers model
	- [JSON/XML sample](sections/samples/payers.md)
### Shared Components:

- [Shared models](sections/shared.md)


###Unsupported Sections/Components:

- Advance Directives
- Family History
- Functional Status
- Medical Equipment
- Payers
- Plan of Care
- Author
- Data Enterer
- Informant
- Custodian
- Information Recipient
- Legal Authenticator
- Authenticator
- Documentation Of
