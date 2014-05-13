#SocialHistory

###Object Schema:
```
var SocialHistory = {
    "smokingStatuses": [{
        value: {type: string, required: true},
        date: [{cda_date}]
    }]
}
```


####Notes
- MAY components Social History Observation, Pregnancy Observation and Tobacca Use are not supported.
- title and text fields are ignored.
- no identifiers since there is none in the spec.

#### smokingStatuses
- 1..*
- //ClinicalDocument/component/structuredBody/component/section/entry/observation

#### smokingStatuses[].value
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/value/@code
- normalized to display name from Smoking Status value set (2.16.840.1.113883.11.20.9.38)
- all values in Smoking Status value set comes from SNOMED CT.

#### smokingStatuses[].date
- 1..1
- //ClinicalDocument/component/structuredBody/component/section/entry/observation/effectiveTime
- smoking start and end date's for smoker
- either start date or both an be required based on value
