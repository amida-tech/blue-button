#Medications

###Object Schema:
```
  var Medications = {
    "date": [{
         "date":{type: datetime, required: true},
         "precision":{type:string, required: true}
     }],
     "identifiers": [{
        "identifier": {type:string, required: true},
        "identifier_type": {type:string, required: true}
     }],
    "status": {type:string: required: true},
    "sig": {type:string, required:false},
    "product": {
      "name": {type:string, required: true},
      "code": {type:string, required: true},
      "code_system": {type:string, required: true},
      "translations": [{
        "name": {type:string, required: false},
        "code": {type:string, required: false},
        "code_system": {type:string, required: false},
      }],
      "unencoded_name": {type:string, required: false},
      "identifiers": {type:string, required: true}
    },
    "administration": {
      "route": {
      	"name": {type: string, required: false},
      	"code": {type: string, required: false},
      	"code_system": {type: string, required: false}
      },
      "form": {
      	"name": {type: string, required: false},
      	"code": {type: string, required: false},
      	"code_system": {type: string, required: false}
      },
      "dose": {
      	"value": {type: string, required: false},
      	"unit": {type: string, required: false}
      },
      "rate": {
      	"value": {type: string, required: false},
      	"unit": {type: string, required: false}
      },
    },
      "precondition": {
          "code": {
      		"name": {type:string, required: true},
      		"code" : {type:string, required: true},
      		"code_system": {type:string, required: true},
      	  },
          "value": {
      		"name": {type:string, required: true},
      		"code" : {type:string, required: true},
      		"code_system": {type:string, required: true},
      	  }
    }
  }

```


####Notes
- No negation indicator on medications, thus only two states.
- Status coming in again, but doesn't seem to mean anything, as it's probably 'completed' in every one.
- delivery method may come in 'code', but of unspecified set or type, and no reference in files, so not currently supported.
- administrationTiming - PIVL very complex to write; put on backlog for now, and not currently supported.
- Drug manufacturer currently unsupported, cannot find reference structure.


####Medication.date
- 0..2
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/effectiveTime
- Should be handled to account for each type of date.
- Low is used for medication start, high is used for medication completion

####Medication.identifiers
- 1..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/id@root
- Should be handled by common identifier parser.

####Medication.status
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration@moodCode INT or EVN (int prescribed, evn complete).
- Mood code can determine stateof either "prescribed" or "complete".

####Medication.sig
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/text/reference@value
- Sig is short for 'Signa.'  It's basically the prescription information in shorthand which is written on the label.


####Medication.interval
- 0..1
- EIVL not supported; spec basically says it's unstructured.

####Medication.


####Immunizations.name
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code@displayName
- Using display name, all of these should be coming in as CVX coded, so no need for code system.  Might want to normalize them.

####Immunizations.code
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code@code
- All of these should be coming in as CVX coded, so no need for code system.  Might want to normalize them.

####Immunization.sequence_number
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/repeatNumber@value
- See notes for significance.

####Immunizations.product
- 0..1
- No direct mapping
- This is a catch all for every non-primary attribute of the product.  All elements herein are optional at this point.

####Immunizations.product.translations
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code/translation
- This is a coded set and should be supported as such.  Allows for synonyms in the same or other code sets.

####Immunizations.product.lot_number
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/lotNumberText

####Immunizations.product.manufacturer
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturerOrganization/name
- May support more than just a name element, not sure.  However, just supporting name for now.

####Immunization.administration
- 0..1
- No direct mapping
- This is a catch all for every non-primary attribute of the product's delivery.  All elements herein are optional at this point.

####Immunization.administration.route
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/routeCode
- Coded entry, should be treated like the rest.

####Immunization.administration.body_site
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/approachSiteCode/@value
- Always coded to SNOMED-CT if present.
- No demo files, can fake it for now and take displayName.

####Immunization.administration.quantity
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/doseQuantity
- This is a value/units pair, where units aren't required.
- If they do come in, they are picked from '2.16.840.1.113883.1.11.12839'

####Immunization.administration.form
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/administrationUnitCode
- This must be picked from 2.16.840.1.113883.3.88.12.3221.8.11.
- This code set is probably small enough to keep in memory (~200 entries).

####Immunization.performer
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity
- http://www.cdapro.com/know/26953 <-- helpful link.
- This object is impossible; there is practically no information on it's structure in the standard.
- assignedEntity seems to be the defacto element within, which is also poorly documented.
- Will attempt to parse what I can based on demo files.  Everything under here is highly speculative.

####Immunization.performer.identifier
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/id
- Should be parsed using standard identifier parser.

####Immunization.performer.address
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/addr
- Need to write a standard address parser for this element, should be used in demographics, etc. as well.
- Lack of spec makes assumption, one address for this performer.

####Immunization.performer.phone
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/telecom
- Need to write a standard address parser for this element, should be used in demographics, etc. as well.

####Immunization.performer.email
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/telecom
- Need to write a standard address parser for this element, should be used in demographics, etc. as well.

####Immunization.performer.name
- 0..1?
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/assignedPerson/name
- Need to write a standard address parser for this element, should be used in demographics, etc. as well.
- Lack of spec makes assumption, one name for this performer.

####Immunization.performer.organization
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization
- Inferred from standard only.

####Immunization.performer.organization.name
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/name
- Should just be name value, no need for structured name.

####Immunization.performer.organization.phone
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/telecom
- Need to write a standard address parser for this element, should be used in demographics, etc. as well.

####Immunization.performer.organization.email
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/telecom
- Need to write a standard address parser for this element, should be used in demographics, etc. as well.

####Immunization.performer.organization.address
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/addr
- Need to write a standard address parser for this element, should be used in demographics, etc. as well.

####Immunization.performer.organization.id
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/performer/assignedEntity/representedOrganization/id
- Should be parsed using standard identifier parser.

####Immunization.refusal_reason
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/entryRelationship/observation/code@displayName
- Should probably be recoded, set small enough.  2.16.840.1.113883.5.8