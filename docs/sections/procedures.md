#Procedures

###Procedures Schema:
```
var Procedures = {
        "name": {type:string, require:true},
        "code": {type:string, require:true},
        "code_system_name": {type:string, require: true},
        "status": {type: string, require: true},
        "date": [{ 
           "date": {type: datetime, required: true},
           "precision":{type:string, required: true}
        }],
        "identifiers": [{
          "identifier": {type:string, required: true},
        }],        
        "bodysite": [{
          "name": {type:string, require:true},
          "code": {type:string, require:true},
          "code_system_name": {type:string, require: true},
        }],
        "providers": [{
          "address": {cda_address},
          "telecom": {cda_telecom},
          "organization": {
            "name": {type:string, require:true},
            "address": {cda_address},
            "telecom": {cda_telecom}
          }
        }],
      }
```


####Notes
- Name, code, and code_system_name can come from act, procedure or observation. are optional in the spec.
- Where name and code is coming is not preserved.
- All "MAY" fields are ignored
- All text fields are ignored


####Procedure.name
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/code@name
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/code@name
- //ClinicalDocument/component/structuredBody/component/section/entry/act/code@name
- Should be handled to account for each type of date.

####Procedure.code
- Same as name except code@code replaces code@name

####Procedure.code_system_name
- Same as name except code@code_system_name replaces code@name

####Procedure.identifiers
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/id
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/id
- //ClinicalDocument/component/structuredBody/component/section/entry/act/id

####Procedure.status
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/statusCode
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/statusCode
- //ClinicalDocument/component/structuredBody/component/section/entry/act/statusCode
- Looked up from Act Status 2.16.840.1.113883.11.20.9.22

####Procedure.date
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/effectiveDate
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/efffectiveDate
- //ClinicalDocument/component/structuredBody/component/section/entry/act/effectiveDate

####Procedure.bodySite
- 0..1
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/targetSiteCode
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/targetSiteCode
- //ClinicalDocument/component/structuredBody/component/section/entry/act/targetSiteCode

####Procedure.providers
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/performer/assignedEntity
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/performer/assignedEntity
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/assignedEntity

####Procedure.locations
- 0..*
- //ClinicalDocument/component/structuredBody/component/section/entry/procedure/participant/participantRole
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/participant/participantRole
- //ClinicalDocument/component/structuredBody/component/section/entry/act/performer/participant/participantRole
