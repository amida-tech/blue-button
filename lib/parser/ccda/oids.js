module.exports = OIDs = {
  "2.16.840.1.113883.11.20.9.19": {
    name: "Problem Status",
    table: {
      "active": "active",
      "suspended": "suspended",
      "aborted": "aborted",
      "completed": "completed"
    }
  },
  "2.16.840.1.113883.5.8": {
    name: "Act Reason",
    table: {
      "IMMUNE": "Immunity",
      "MEDPREC": "Medical precaution",
      "OSTOCK": "Out of stock",
      "PATOBJ": "Patient objection",
      "PHILISOP": "Philosophical objection",
      "RELIG": "Religious objection",
      "VACEFF": "Vaccine efficacy concerns",
      "VACSAF": "Vaccine safety concerns"
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
    name: "CVX Vaccine",
    uri: "http://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx&code="
  },
  "2.16.840.1.113883.5.112": {
    name: "Route Code",
    uri: "http://hl7.org/codes/RouteCode#"
  },
  "2.16.840.1.113883.6.238": {
    name: "Race and Ethnicity - CDC",
    uri: "http://phinvads.cdc.gov/vads/ViewCodeSystemConcept.action?oid=2.16.840.1.113883.6.238&code="
  },
  "2.16.840.1.113883.6.1": {
    name: "LOINC",
    uri: "http://purl.bioontology.org/ontology/LNC/"
  },
  "2.16.840.1.113883.6.88": {
    name: "RXNORM",
    uri: "http://purl.bioontology.org/ontology/RXNORM/"
  },
  "2.16.840.1.113883.6.96": {
    name: "SNOMED CT",
    uri: "http://purl.bioontology.org/ontology/SNOMEDCT/"
  },
  "2.16.840.1.113883.6.12": {
    name: "CPT",
    uri: "http://purl.bioontology.org/ontology/CPT/"
  },
  "2.16.840.1.113883.5.4": {
    name: "HL7ActCode",
    uri: "http://hl7.org/actcode/"
  },
  "2.16.840.1.113883.19": {
    name: "Good Health Clinic",
    uri: "http://hl7.org/goodhealth/"
  },
  "2.16.840.1.113883.6.259": {
    name: "HealthcareServiceLocation",
    uri: "http://hl7.org/healthcareservice/"
  },
  "2.16.840.1.113883.1.11.19185": {
    name: "HL7 Religion",
    uri: "http://hl7.org/codes/ReligiousAffiliation#"
  },
  "2.16.840.1.113883.5.60": {
    name: "HL7 LanguageAbility",
    uri: "http://hl7.org/codes/LanguageAbility#"
  },
  "2.16.840.1.113883.5.2": {
    name: "HL7 Marital Status",
    uri: "http://hl7.org/codes/MaritalStatus#"
  },
  "2.16.840.1.113883.5.83": {
    name: "HL7 Result Interpretation",
    uri: "http://hl7.org/codes/ResultInterpretation#",
    table: {
      "B": "better",
      "D": "decreased",
      "U": "increased",
      "W": "worse",
      "<": "low off scale",
      ">": "high off scale",
      "A": "Abnormal",
      "AA": "abnormal alert",
      "H": "High",
      "HH": "high alert",
      "L": "Low",
      "LL": "low alert",
      "N": "Normal",
      "I": "intermediate",
      "MS": "moderately susceptible",
      "R": "resistent",
      "S": "susceptible",
      "VS": "very susceptible",
      "EX": "outside threshold",
      "HX": "above high threshold",
      "LX": "below low threshold",

    }
  },
  "2.16.840.1.113883.5.111": {
    name: "HL7 Role",
    uri: "http://hl7.org/codes/PersonalRelationship#"
  },
  "2.16.840.1.113883.5.1119": {
    name: "HL7 Address",
    uri: "http://hl7.org/codes/Address#",
    table: {
      "BAD": "bad address",
      "CONF": "confidential",
      "DIR": "direct",
      "H": "home address",
      "HP": "primary home",
      "HV": "vacation home",
      "PHYS": "physical visit address",
      "PST": "postal address",
      "PUB": "public",
      "TMP": "temporary",
      "WP": "work place"
    }
  },
  "2.16.840.1.113883.5.45": {
    name: "HL7 EntityName",
    uri: "http://hl7.org/codes/EntityName#",
    table: {
      "A": "Artist/Stage",
      "ABC": "Alphabetic",
      "ASGN": "Assigned",
      "C": "License",
      "I": "Indigenous/Tribal",
      "IDE": "Ideographic",
      "L": "Legal",
      "P": "Pseudonym",
      "PHON": "Phonetic",
      "R": "Religious",
      "SNDX": "Soundex",
      "SRCH": "Search",
      "SYL": "Syllabic"
    }
  },
  "2.16.840.1.113883.5.1": {
    name: "HL7 AdministrativeGender",
    uri: "http://hl7.org/codes/AdministrativeGender#",
    table: {
      "F": "Female",
      "M": "Male",
      "UN": "Undifferentiated"
    }
  },
  "2.16.840.1.113883.3.88.12.3221.6.8": {
    name: "Problem Severity",
    uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
    code_system: "2.16.840.1.113883.6.96",
    table: {
      "255604002": "Mild",
      "371923003": "Mild to moderate",
      "6736007": "Moderate",
      "371924009": "Moderate to severe",
      "24484000": "Severe",
      "399166001": "Fatal"
    }
  },
  "2.16.840.1.113883.3.88.12.80.68": {
    name: "HITSP Problem Status",
    uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
    code_system: "2.16.840.1.113883.6.96",
    table: {
      "55561003": "Active",
      "73425007": "Inactive",
      "413322009": "Resolved"
    }
  },
  "2.16.840.1.113883.11.20.9.21": {
    name: "Age Unified Code for Units of Measure",
    uri: "http://phinvads.cdc.gov/vads/ViewValueSet.action?oid=2.16.840.1.114222.4.11.878",
    table: {
      "min": "Minute",
      "h": "Hour",
      "d": "Day",
      "wk": "Week",
      "mo": "Month",
      "a": "Year"
    }
  },
  "2.16.840.1.113883.12.292": {
    name: "CVX",
    uri: "http://phinvads.cdc.gov/vads/ViewCodeSystem.action?id=2.16.840.1.113883.12.292"
  },
  "2.16.840.1.113883.5.1076": {
    name: "HL7 Religious Affiliation",
    uri: "http://ushik.ahrq.gov/ViewItemDetails?system=mdr&itemKey=83154000",
    table: {
      "1008": "Babi & Baha´I faiths",
      "1009": "Baptist",
      "1010": "Bon",
      "1011": "Cao Dai",
      "1012": "Celticism",
      "1013": "Christian (non-Catholic, non-specific)",
      "1014": "Confucianism",
      "1015": "Cyberculture Religions",
      "1016": "Divination",
      "1017": "Fourth Way",
      "1018": "Free Daism",
      "1019": "Gnosis",
      "1020": "Hinduism",
      "1021": "Humanism",
      "1022": "Independent",
      "1023": "Islam",
      "1024": "Jainism",
      "1025": "Jehovah´s Witnesses",
      "1026": "Judaism",
      "1027": "Latter Day Saints",
      "1028": "Lutheran",
      "1029": "Mahayana",
      "1030": "Meditation",
      "1031": "Messianic Judaism",
      "1032": "Mitraism",
      "1033": "New Age",
      "1034": "non-Roman Catholic",
      "1035": "Occult",
      "1036": "Orthodox",
      "1037": "Paganism",
      "1038": "Pentecostal",
      "1039": "Process, The",
      "1040": "Reformed/Presbyterian",
      "1041": "Roman Catholic Church",
      "1042": "Satanism",
      "1043": "Scientology",
      "1044": "Shamanism",
      "1045": "Shiite (Islam)",
      "1046": "Shinto",
      "1047": "Sikism",
      "1048": "Spiritualism",
      "1049": "Sunni (Islam)",
      "1050": "Taoism",
      "1051": "Theravada",
      "1052": "Unitarian-Universalism",
      "1053": "Universal Life Church",
      "1054": "Vajrayana (Tibetan)",
      "1055": "Veda",
      "1056": "Voodoo",
      "1057": "Wicca",
      "1058": "Yaohushua",
      "1059": "Zen Buddhism",
      "1060": "Zoroastrianism",
      "1062": "Brethren",
      "1063": "Christian Scientist",
      "1064": "Church of Christ",
      "1065": "Church of God",
      "1066": "Congregational",
      "1067": "Disciples of Christ",
      "1068": "Eastern Orthodox",
      "1069": "Episcopalian",
      "1070": "Evangelical Covenant",
      "1071": "Friends",
      "1072": "Full Gospel",
      "1073": "Methodist",
      "1074": "Native American",
      "1075": "Nazarene",
      "1076": "Presbyterian",
      "1077": "Protestant",
      "1078": "Protestant, No Denomination",
      "1079": "Reformed",
      "1080": "Salvation Army",
      "1081": "Unitarian Universalist",
      "1082": "United Church of Christ"
    }
  },
  "2.16.840.1.113883.1.11.11526": {
    "name": "Internet Society Language",
    "uri": "http://www.loc.gov/standards/iso639-2/php/English_list.php"
  },
  "2.16.840.1.113883.11.20.9.22": {
    name: "ActStatus",
    table: {
      "completed": "Completed",
      "active": "Active",
      "aborted": "Aborted",
      "cancelled": "Cancelled"
    }
  },
  "2.16.840.1.113883.3.26.1.1": {
    name: "Medication Route FDA",
    table: {
      "C38192": "AURICULAR (OTIC)",
      "C38193": "BUCCAL",
      "C38194": "CONJUNCTIVAL",
      "C38675": "CUTANEOUS",
      "C38197": "DENTAL",
      "C38633": "ELECTRO-OSMOSIS",
      "C38205": "ENDOCERVICAL",
      "C38206": "ENDOSINUSIAL",
      "C38208": "ENDOTRACHEAL",
      "C38209": "ENTERAL",
      "C38210": "EPIDURAL",
      "C38211": "EXTRA-AMNIOTIC",
      "C38212": "EXTRACORPOREAL",
      "C38200": "HEMODIALYSIS",
      "C38215": "INFILTRATION",
      "C38219": "INTERSTITIAL",
      "C38220": "INTRA-ABDOMINAL",
      "C38221": "INTRA-AMNIOTIC",
      "C38222": "INTRA-ARTERIAL",
      "C38223": "INTRA-ARTICULAR",
      "C38224": "INTRABILIARY",
      "C38225": "INTRABRONCHIAL",
      "C38226": "INTRABURSAL",
      "C38227": "INTRACARDIAC",
      "C38228": "INTRACARTILAGINOUS",
      "C38229": "INTRACAUDAL",
      "C38230": "INTRACAVERNOUS",
      "C38231": "INTRACAVITARY",
      "C38232": "INTRACEREBRAL",
      "C38233": "INTRACISTERNAL",
      "C38234": "INTRACORNEAL",
      "C38217": "INTRACORONAL, DENTAL",
      "C38218": "INTRACORONARY",
      "C38235": "INTRACORPORUS CAVERNOSUM",
      "C38238": "INTRADERMAL",
      "C38239": "INTRADISCAL",
      "C38240": "INTRADUCTAL",
      "C38241": "INTRADUODENAL",
      "C38242": "INTRADURAL",
      "C38243": "INTRAEPIDERMAL",
      "C38245": "INTRAESOPHAGEAL",
      "C38246": "INTRAGASTRIC",
      "C38247": "INTRAGINGIVAL",
      "C38249": "INTRAILEAL",
      "C38250": "INTRALESIONAL",
      "C38251": "INTRALUMINAL",
      "C38252": "INTRALYMPHATIC",
      "C38253": "INTRAMEDULLARY",
      "C38254": "INTRAMENINGEAL",
      "C28161": "INTRAMUSCULAR",
      "C38255": "INTRAOCULAR",
      "C38256": "INTRAOVARIAN",
      "C38257": "INTRAPERICARDIAL",
      "C38258": "INTRAPERITONEAL",
      "C38259": "INTRAPLEURAL",
      "C38260": "INTRAPROSTATIC",
      "C38261": "INTRAPULMONARY",
      "C38262": "INTRASINAL",
      "C38263": "INTRASPINAL",
      "C38264": "INTRASYNOVIAL",
      "C38265": "INTRATENDINOUS",
      "C38266": "INTRATESTICULAR",
      "C38267": "INTRATHECAL",
      "C38207": "INTRATHORACIC",
      "C38268": "INTRATUBULAR",
      "C38269": "INTRATUMOR",
      "C38270": "INTRATYMPANIC",
      "C38272": "INTRAUTERINE",
      "C38273": "INTRAVASCULAR",
      "C38276": "INTRAVENOUS",
      "C38277": "INTRAVENTRICULAR",
      "C38278": "INTRAVESICAL",
      "C38280": "INTRAVITREAL",
      "C38203": "IONTOPHORESIS",
      "C38281": "IRRIGATION",
      "C38282": "LARYNGEAL",
      "C38284": "NASAL",
      "C38285": "NASOGASTRIC",
      "C48623": "NOT APPLICABLE",
      "C38286": "OCCLUSIVE DRESSING TECHNIQUE",
      "C38287": "OPHTHALMIC",
      "C38288": "ORAL",
      "C38289": "OROPHARYNGEAL",
      "C38291": "PARENTERAL",
      "C38676": "PERCUTANEOUS",
      "C38292": "PERIARTICULAR",
      "C38677": "PERIDURAL",
      "C38293": "PERINEURAL",
      "C38294": "PERIODONTAL",
      "C38295": "RECTAL",
      "C38216": "RESPIRATORY (INHALATION)",
      "C38296": "RETROBULBAR",
      "C38198": "SOFT TISSUE",
      "C38297": "SUBARACHNOID",
      "C38298": "SUBCONJUNCTIVAL",
      "C38299": "SUBCUTANEOUS",
      "C38300": "SUBLINGUAL",
      "C38301": "SUBMUCOSAL",
      "C38304": "TOPICAL",
      "C38305": "TRANSDERMAL",
      "C38283": "TRANSMUCOSAL",
      "C38307": "TRANSPLACENTAL",
      "C38308": "TRANSTRACHEAL",
      "C38309": "TRANSTYMPANIC",
      "C38312": "URETERAL",
      "C38271": "URETHRAL"
    }
  }
};