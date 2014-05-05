module.exports = OIDs = {
  "2.16.840.1.113883.11.20.9.19":{
    name: "Problem Status",
    table:{
      "active": "active",
      "suspended": "suspended",
      "aborted": "aborted",
      "completed": "completed"
    }
  },
  "2.16.840.1.113883.5.8":{
    name: "Act Reason",
    table:{
      "IMMUNE":  "Immunity",
      "MEDPREC":  "Medical precaution",
      "OSTOCK":  "Out of stock",
      "PATOBJ":  "Patient objection",
      "PHILISOP":  "Philosophical objection",
      "RELIG":  "Religious objection",
      "VACEFF":  "Vaccine efficacy concerns",
      "VACSAF":  "Vaccine safety concerns"
    }
  },
  "2.16.840.1.113883.6.27": {
    name: "Multum",
    uri: "http://multum-look-me-up#"
  },
   "2.16.840.1.113883.6.312": {
    name: "multum-drug-synonym-id",
    uri: "http://multum-drug-synonym-id-look-me-up#"
  },
   "2.16.840.1.113883.6.314": {
    name: "multum-drug-id",
    uri: "http://multum-drug-id-look-me-up#"
  },
  "2.16.840.1.113883.3.26.1.1": {
    name: "NCI Thesaurus",
    uri: "http://nci-thesaurus-look-me-up#"
  },
  "2.16.840.1.113883.6.59": {
    name:"CVX Vaccine",
    uri:"http://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx&code="
  },
  "2.16.840.1.113883.5.112": {
    name:"Route Code",
    uri:"http://hl7.org/codes/RouteCode#"
  },
  "2.16.840.1.113883.6.238": {
    name:"CDC Race",
    uri:"http://phinvads.cdc.gov/vads/ViewCodeSystemConcept.action?oid=2.16.840.1.113883.6.238&code="
  },
  "2.16.840.1.113883.6.1": {
    name:"LOINC",
    uri:"http://purl.bioontology.org/ontology/LNC/"
  },
  "2.16.840.1.113883.6.88": {
    name:"RXNORM",
    uri:"http://purl.bioontology.org/ontology/RXNORM/"
  },
  "2.16.840.1.113883.6.96": {
    name:"SNOMED CT",
    uri:"http://purl.bioontology.org/ontology/SNOMEDCT/"
  },
  "2.16.840.1.113883.19": {
    name:"Good Health Clinic",
    uri:"http://hl7.org/goodhealth/"
  },
  "2.16.840.1.113883.1.11.19185": {
    name:"HL7 Religion",
    uri:"http://hl7.org/codes/ReligiousAffiliation#"
  },
  "2.16.840.1.113883.5.60": {
    name:"HL7 LanguageAbility",
    uri:"http://hl7.org/codes/LanguageAbility#"
  },
  "2.16.840.1.113883.5.2": {
    name:"HL7 Marital Status",
    uri:"http://hl7.org/codes/MaritalStatus#"
  },
  "2.16.840.1.113883.5.83": {
    name:"HL7 Result Interpretation",
    uri:"http://hl7.org/codes/ResultInterpretation#",
    table:{
      "B":"better",
      "D":"decreased",
      "U":"increased",
      "W":"worse",
      "<":"low off scale",
      ">":"high off scale",
      "A":"Abnormal",
      "AA":"abnormal alert",
      "H":"High",
      "HH":"high alert",
      "L":"Low",
      "LL":"low alert",
      "N":"Normal",
      "I":"intermediate",
      "MS":"moderately susceptible",
      "R":"resistent",
      "S":"susceptible",
      "VS":"very susceptible",
      "EX":"outside threshold",
      "HX":"above high threshold",
      "LX":"below low threshold",

    }
  },
  "2.16.840.1.113883.5.111": {
    name:"HL7 Role",
    uri:"http://hl7.org/codes/PersonalRelationship#"
  },
  "2.16.840.1.113883.5.1119": {
    name:"HL7 Address",
    uri:"http://hl7.org/codes/Address#",
    table:{
      "BAD":"bad address",
      "CONF":"confidential",
      "DIR":"direct",
      "H":"home address",
      "HP":"primary home",
      "HV":"vacation home",
      "PHYS":"physical visit address",
      "PST":"postal address",
      "PUB":"public",
      "TMP":"temporary",
      "WP":"work place"
    }
  },
  "2.16.840.1.113883.5.45": {
    name:"HL7 EntityName",
    uri:"http://hl7.org/codes/EntityName#",
    table:{
      "A":"Artist/Stage",
      "ABC":"Alphabetic",
      "ASGN":"Assigned",
      "C":"License",
      "I":"Indigenous/Tribal",
      "IDE":"Ideographic",
      "L":"Legal",
      "P":"Pseudonym",
      "PHON":"Phonetic",
      "R":"Religious",
      "SNDX":"Soundex",
      "SRCH":"Search",
      "SYL":"Syllabic"
    }
  },
  "2.16.840.1.113883.5.1": {
    name:"HL7 AdministrativeGender",
    uri:"http://hl7.org/codes/AdministrativeGender#",
    table:{
      "F":"Female",
      "M":"Male",
      "UN":"Undifferentiated"
    }
  }
};
