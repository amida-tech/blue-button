#Medications

###Object Schema:
```
  var Medication = {
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
      "identifiers": [{
      	"identifier": {type:string, required: true},
      	"identifier_type": {type:string, required: true}
      }]
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
      "site": {
      	"name": {type: string, required: false},
      	"code": {type: string, required: false},
      	"code_system": {type: string, required: false}
      },
      "dose": {
      	"value": {type: string, required: false},
      	"unit": {type: string, required: false}
      },
      "dose_restriction": {
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
- SHOULD Exception:  Freetext drug name is a randomly structured area pointing to an HTML element.  We currently don't have parsing support for these, so it is tabled for name.
- SHOULD Exception:  Interval not currently supported, parsers aren't written to properly handle this entry.

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

####Medication.product
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct
- Must be encoded in RxNorm, but translation may be in another language (e.g. SNOMED).

####Medication.product.name
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code
- Coded name entry from the coded object; can later be standardized via code-set.

####Medication.product.code
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code
- Code entry from the coded object.

####Medication.product.code_system
- 1..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code
- Code entry from the coded object.

####Medication.product.translations
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/manufacturedMaterial/code/translations
- Optional translation element if an additional coding system is used to represent the product.

####Medication.product.identifiers
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/manufacturedProduct/id
- Optional identifiers may come in on the drugs.

####Medication.administration
- 0..1
- No direct XPath mapping; created category.
- All sub elements are optional.

####Medication.administration.route
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/routeCode

####Medication.administration.form
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/administrationUnitCode

####Medication.administration.dose
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/doseQuantity

####Medication.administration.dose_restriction
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/maxDoseQuantity

####Medication.administration.rate
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/rateQuantity

####Medication.administration.site
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/approachSiteCode

####Medication.administration.precondition
- 0..*
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/precondition

####Medication.administration.precondition.code
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/precondition/code

####Medication.administration.precondition.code
- 0..1
- /ClinicalDocument/component/structuredBody/component/section/entry/substanceAdministration/consumable/substanceAdministration/precondition/value
