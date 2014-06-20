# Validator for Blue Button Data Model


### General Notes

1. For now, the validator uses JSONSchema that is defined locally. Ideally, I believe that we 
want to have one place for all the data models, and the validator can make calls to that website by
http request to use those models to compare. 
..* The access to local JSONSchemas are done using .setRemoteReference in Z-schema. It's important to note
	that the fake reference that is connected to a local schema MUST be in the format http://

2. factored physical quanitities out of the sections.

##requirements for each section

Medications: made status, product always required.

Demographics: The only required field is name.

Shared: Made both fields for physical quantity required.
		Coded entries must have at least one property.