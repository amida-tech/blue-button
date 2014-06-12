#Procedures

###Procedures Schema:
```
var Procedures = {
        "procedure": {cda_coded_entry},
        "procedure_type": {type:string, require:true},
        "status": {type: string, require: true},
        "date": [{cda_date}],
        "identifiers": [{cda_id}],
        "body_sites": [{cda_coded_entry}],
        "providers": [{
          "address": {cda_address},
          "telecom": {cda_telecom},
          "organization": {
            "name": {type:string, require:flase},
            "address": {cda_address},
            "telecom": {cda_telecom}
          }
        }],
        "locations": [{cda_locations}]
      }
```

[JSON/XML sample](samples/procedures.md)


####Notes
- Name, code, and code_system_name can come from act, procedure or observation which is captured in type.
- All "MAY" fields except locations (participant) are ignored (observation, act, procedure)
- Original text and reference fields are not used (observation, act, procedure).
= Required value field is ignored since it did not include valuable data (observation).
- Id fields for providers and locations are not recorded.

####Procedures.procedure
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/code@displayName
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/code@displayName
- //ClinicalDocument/component/structuredBody/component/section/entry/act/code@displayName
- Same as name except code@code_system_name replaces code@displayName
- Can be LOINC, SNOMED CT, CPT-4, ICD9, ICD10

####Procedures.procedure_type
- 1..1
- Not literally in the CCDA specification.
- observation, procedure or act. Corresponds to the type of procedure that the name and code comes from.

####Procedures.status
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/statusCode
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/statusCode
- //ClinicalDocument/component/structuredBody/component/section/entry/act/statusCode
- Looked up from Act Status 2.16.840.1.113883.11.20.9.22

####Procedures.date
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/effectiveDate
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/efffectiveDate
- //ClinicalDocument/component/structuredBody/component/section/entry/act/effectiveDate


####Procedures.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/id
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/id
- //ClinicalDocument/component/structuredBody/component/section/entry/act/id


####Procedures.body_sites
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/targetSiteCode@displayName
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/targetSiteCode@displayName
- //ClinicalDocument/component/structuredBody/component/section/entry/act/targetSiteCode@displayName
- Same as name except targetSiteCode@code_system_name replaces targetSiteCode@displayName
- Body Site Value Set (2.16.840.1.113883.3.88.12.3221.8.9)

####Procedures.providers
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/performer/assignedEntity
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/performer/assignedEntity
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/assignedEntity

####Procedures.providers.address
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/performer/assignedEntity/addr
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/performer/assignedEntity/addr
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/assignedEntity/addr

####Procedures.providers.telecom
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/performer/assignedEntity/telecom
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/performer/assignedEntity/telecom
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/assignedEntity/telecom

####Procedures.providers.organization
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/performer/assignedEntity/representedOrganization
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/performer/assignedEntity/representedOrganization
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/assignedEntity/representedOrganization

####Procedures.providers.organization.name
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/performer/assignedEntity/representedOrganization/name
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/performer/assignedEntity/representedOrganization/name
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/assignedEntity/representedOrganization/name

####Procedures.providers.organization.address
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/performer/assignedEntity/representedOrganization/addr
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/performer/assignedEntity/representedOrganization/addr
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/assignedEntity/representedOrganization/addr

####Procedures.providers.organization.telecom
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/performer/assignedEntity/representedOrganization/telecom
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/performer/assignedEntity/representedOrganization/telecom
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/assignedEntity/representedOrganization/telecom

####Procedures.locations
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/participant/participantRole
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/participant/participantRole
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/participant/participantRole
