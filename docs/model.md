# Data Models

This area documents the JSON data models which are produced by the library; each section is detailed in its own file.  Unsupported Sections are optional elements which aren't currently implemented.  Please feel free to issue a pull request for support of these sections (so long as it has tests).

JSON doesn't currently have a standard schema language; consequently these models are written to be used in a [Mongoose.js](http://www.mongoosejs.com) compatible schema.

There are components common to multiple sections and are defined [here](sections/shared.md).

###Required Sections:

- [Allergies model](sections/allergies.md) - [JSON/XML sample](sections/samples/allergies.md)
- [Medications model](sections/medications.md) - [JSON/XML sample](sections/samples/medications.md)
- [Problems model](sections/problems.md) - [JSON/XML sample](sections/samples/problems.md)
- [Results model](sections/results.md) - [JSON/XML sample](sections/samples/results.md)
- [Demographics model](sections/demographics.md) - [JSON/XML sample](sections/samples/demographics.md)

###Optional Sections:

- [Procedures model](sections/procedures.md) - [JSON/XML sample](sections/samples/procedures.md)
- [Encounters model](sections/encounters.md) - [JSON/XML sample](sections/samples/encounters.md)
- [Immunizations model](sections/immunizations.md) - [JSON/XML sample](sections/samples/immunizations.md)
- [Vitals model](sections/vitals.md) - [JSON/XML sample](sections/samples/vitals.md)
- [Social History model](sections/socialHistory.md) - [JSON/XML sample](sections/samples/socialHistory.md)

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
