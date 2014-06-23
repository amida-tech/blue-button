#Shared Components

## cda_name

```
 var cda_name = {
    "prefix": [{type: string, required: false}],
    "first": {type: string, required: true},
    "middle": [{type: string, required: false],
    "last": {type: string, required: true},
    "suffix": {type: string, required: false}
  }
```




## cda_address

```
var cda_address = {
    "street": [{type: string, required: true}],
    "city": {type: string, required: true},
    "state": {type: string, required: false},
    "postal_code": {type: string, required: false},
    "country": {type: string, required: false}
}
```
#### street
- 1..*
- streetAddressLine

#### city
- 1..1
- city

#### postal_code
- 0..1
- postalCode

#### country
- 0..1
- country

## cda_phone

```
var cda_phone = {
    "number": {type: string, required: true},
    "type": {type: string, required: true}
}
```

####number
- 1..1
- @value
- Each phone record should be checked for 'tel:' lead of value.

####type
- 1..1
- @use
- From table AdressUse 2.16.840.1.113883.5.1119

## cda_email

```
var cda_email = {
    "address": {type: string, required: true},
    "type": {type: string, required: true}
}
```

####address
- 1..1
- @value
- Each email record should be checked for 'mailto:' lead of value.

####type
- 1..1
- @use
- From table AdressUse 2.16.840.1.113883.5.1119


## cda_location

```
var cda_location = {
    "name": {type: string, required:false},
    "loc_type": {cda_concept},
    "addresses": [{cda_address}],
    "phones": [{cda_phone}]
}
```

#### name
- 0..1
- playingEntity/name

#### type
- 1..1
- code
- Should always be codified to HealthcareServiceLocation.
- Not supported: nullFlavor.
- TODO:  Support lookup of values from coding system

#### addresses
- 0..*
- addr

#### phones
- 0..*
- telecom

## cda_date

```
var cda_date = {
    "date": {type: datetime, required:true},
    "precision": {type: string, required:true}
}
```

#### date
- 1..1
- @value, low/@value, high/@value
- should be handled to account for each type of date
- nullFlavor is not supported

#### precision
- 1..1
- @value, low/@value, high/@value
- records precision in the @values since that information is lost in date (javascript datetime)
- can be 'year', 'month', 'day', 'hour', 'minute', 'second', 'subsecond'

## cda_id

```
var cda_id = {
    "identifier": {type:string, required: true},
    "identifier_type": {type:string, required: true}
}
```

#### identifier
- 1..1
- @root

#### identifier_type
- 1..1
- @extension

## cda_coded_entry
```
var coded_entry = "allergen": {
  "name": {type: string, required: true},
  "code": {type: string, required: false},
  "code_system": {type: string, required:false},
  "translations": [{
    "name": {type: string, required: true},
    "code": {type: string, required: false},
    "code_system": {type: string, required:false}
  }]
}
```
#### name
- 1..1
- @displayName
- TODO:  Add handlers for lookup if displayName not present.

#### code
- 0..1
- @code

#### code_system
- 0..1
- @codeSystemName
- TODO:  Add OID based code system name lookup.

#### translations
- 0..*
- /translation
- Optional translations of coded entry.

#### translations.name
- 1..1
- @displayName
- TODO:  Add handlers for lookup if displayName not present.

#### translations.code
- 0..1
- @code

#### translations.code_system
- 0..1
- @codeSystemName
- TODO:  Add OID based code system name lookup.

