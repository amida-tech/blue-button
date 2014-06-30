# Validator for Blue Button Data Model


### General Notes

1. For now, the validator uses JSONSchema that is defined locally. Ideally, I believe that we 
want to have one place for all the data models, and the validator can make calls to that website by
http request to use those models to compare. 
..* The access to local JSONSchemas are done using .setRemoteReference in Z-schema. It's important to note
	that the fake reference that is connected to a local schema MUST be in the format http://website.com

..* For now, the validator catches errors when there are empty objects.

..* Validator is coded in a very strict mode. For example, for each section, it DOES NOT allow for additional properties.
So a section may have all the required properties, but if it has an extra property not specified in the original JSONSchema,
the validator will return false.

2. factored physical quanitities out of the sections.

##requirements for each section

Shared: 

..*Made both fields for physical quantity required.
..*Coded entries must have at least one property.
..*Location only requires the name of the location.

Medications: made status, product always required.

Demographics: The only required field is name.

Allergies: Only allergen is required.

Problems: Only problem is required.

Results: Only result is required.

Encounters: Only encounter is required.

Vitals: Only vital is required.

Social History: At the moment, so field is required.

Procedures: 
..*procedure key is required, min items is 1.
..*status key is required.
..*For a provider object, only required field is address.
..*Organizations can have no name, but must have at least one property.

Immunizations:
..* Organization seems to overlap with organizations in procedures
..* Some fields should not be a arrays in original CCDA(name in performer, )

