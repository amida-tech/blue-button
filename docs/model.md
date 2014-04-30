# JSON model description here

## Continuity of Care Document

- Required:
    - Allergies
    - Medications
    - Problems
    - Procedures (only required for inpatient)
    - Results (Labs)
    - Demographics *

- Optional:
    - Advance Directives
    - Encounters**
    - Family History
    - Functional Status
    - Immunizations**
    - Medical Equipment
    - Payers
    - Plan of Care
    - Social History
    - Vitals**

_* - (not an actual section)

_** - to be implemented in Release 1.0

## Sections data models with examples

### Allergies

XML example

```xml
<entry typeCode="DRIV">
    <act classCode="ACT" moodCode="EVN">
        <!-- ** Allergy problem act ** -->
        <templateId root="2.16.840.1.113883.10.20.22.4.30"/>
        <id root="36e3e930-7b14-11db-9fe1-0800200c9a66"/>
        <code code="48765-2" codeSystem="2.16.840.1.113883.6.1"
            codeSystemName="LOINC"
            displayName="Allergies, adverse reactions, alerts"/>
        <statusCode code="active"/>
        <effectiveTime value="20070501"/>
        <entryRelationship typeCode="SUBJ" inversionInd="true">
            <observation classCode="OBS" moodCode="EVN">
                <!-- ** Allergy observation ** -->
                <templateId root="2.16.840.1.113883.10.20.22.4.7"/>
                <id root="4adc1020-7b14-11db-9fe1-0800200c9a66"/>
                <code code="ASSERTION" codeSystem="2.16.840.1.113883.5.4"/>
                <statusCode code="completed"/>
                <effectiveTime>
                    <low value="20070501"/>
                </effectiveTime>
                <value xsi:type="CD" code="419511003"
                    displayName="Propensity to adverse reactions to drug"
                    codeSystem="2.16.840.1.113883.6.96"
                    codeSystemName="SNOMED CT">
                    <originalText>
                        <reference value="#reaction1"/>
                    </originalText>
                </value>
                <participant typeCode="CSM">
                    <participantRole classCode="MANU">
                        <playingEntity classCode="MMAT">
                            <code code="314422"
                            displayName="ALLERGENIC EXTRACT, PENICILLIN"
                            codeSystem="2.16.840.1.113883.6.88"
                            codeSystemName="RxNorm">
                            <originalText>
                            <reference value="#reaction1"/>
                            </originalText>
                            </code>
                        </playingEntity>
                    </participantRole>
                </participant>
                <entryRelationship typeCode="SUBJ" inversionInd="true">
                    <observation classCode="OBS" moodCode="EVN">
                        <!-- ** Allergy status observation ** -->
                        <templateId root="2.16.840.1.113883.10.20.22.4.28"/>
                        <code code="33999-4" codeSystem="2.16.840.1.113883.6.1"
                            codeSystemName="LOINC" displayName="Status"/>
                        <statusCode code="completed"/>
                        <value xsi:type="CE" code="73425007"
                            codeSystem="2.16.840.1.113883.6.96"
                            displayName="Inactive"/>
                    </observation>
                </entryRelationship>
                <entryRelationship typeCode="MFST" inversionInd="true">
                    <observation classCode="OBS" moodCode="EVN">
                        <!-- ** Reaction observation ** -->
                        <templateId root="2.16.840.1.113883.10.20.22.4.9"/>
                        <id root="4adc1020-7b14-11db-9fe1-0800200c9a64"/>
                        <code nullFlavor="NA"/>
                        <text>
                            <reference value="#reaction1"/>
                        </text>
                        <statusCode code="completed"/>
                        <effectiveTime>
                            <low value="20070501"/>
                            <high value="20090227130000+0500"/>
                        </effectiveTime>
                        <value xsi:type="CD" code="422587007"
                            codeSystem="2.16.840.1.113883.6.96"
                            displayName="Nausea"/>
                        <entryRelationship typeCode="SUBJ" inversionInd="true">
                            <observation classCode="OBS" moodCode="EVN">
                            <!-- ** Severity observation ** -->
                            <templateId root="2.16.840.1.113883.10.20.22.4.8"/>
                            <code code="SEV"
                            displayName="Severity Observation"
                            codeSystem="2.16.840.1.113883.5.4"
                            codeSystemName="ActCode"/>
                            <text>
                            <reference value="#severity4"/>
                            </text>
                            <statusCode code="completed"/>
                            <value xsi:type="CD" code="255604002"
                            displayName="Mild"
                            codeSystem="2.16.840.1.113883.6.96"
                            codeSystemName="SNOMED CT"/>
                            <interpretationCode code="S"
                            displayName="Suceptible"
                            codeSystem="2.16.840.1.113883.1.11.78"
                            codeSystemName="Observation Interpretation"/>
                            </observation>
                        </entryRelationship>
                    </observation>
                </entryRelationship>
                <entryRelationship typeCode="SUBJ" inversionInd="true">
                    <observation classCode="OBS" moodCode="EVN">
                        <!-- ** Severity observation ** -->
                        <templateId root="2.16.840.1.113883.10.20.22.4.8"/>
                        <code code="SEV" displayName="Severity Observation"
                            codeSystem="2.16.840.1.113883.5.4"
                            codeSystemName="ActCode"/>
                        <text>
                            <reference value="#severity2"/>
                        </text>
                        <statusCode code="completed"/>
                        <value xsi:type="CD" code="371924009"
                            displayName="Moderate to severe"
                            codeSystem="2.16.840.1.113883.6.96"
                            codeSystemName="SNOMED CT"/>
                        <interpretationCode code="N" displayName="Normal"
                            codeSystem="2.16.840.1.113883.1.11.78"
                            codeSystemName="Observation Interpretation"/>
                    </observation>
                </entryRelationship>
            </observation>
        </entryRelationship>
    </act>
</entry>
```

JSON example
```javascript
[
  {
    "date_range": {
      "start": "2009-09-02T04:00:00.000Z",
      "end": "2010-01-03T05:00:00.000Z"
    },
    "name": "drug allergy",
    "code": "416098002",
    "code_system": "2.16.840.1.113883.6.96",
    "code_system_name": "SNOMED CT",
    "status": "Active",
    "severity": "Moderate to severe",
    "reaction": {
      "name": "Hives",
      "code": "247472004",
      "code_system": "2.16.840.1.113883.6.96"
    },
    "reaction_type": {
      "name": "Adverse reaction to substance",
      "code": "282100009",
      "code_system": "2.16.840.1.113883.6.96",
      "code_system_name": "SNOMED CT"
    },
    "allergen": {
      "name": "ALLERGENIC EXTRACT, PENICILLIN",
      "code": "314422",
      "code_system": "2.16.840.1.113883.6.88",
      "code_system_name": "RxNorm"
    }
  },
  {
    "date_range": {
      "start": "2009-09-02T04:00:00.000Z",
      "end": "2010-01-03T05:00:00.000Z"
    },
    "name": "drug allergy",
    "code": "416098002",
    "code_system": "2.16.840.1.113883.6.96",
    "code_system_name": "SNOMED CT",
    "status": "Active",
    "severity": "Moderate to severe",
    "reaction": {
      "name": "Wheezing",
      "code": "56018004",
      "code_system": "2.16.840.1.113883.6.96"
    },
    "reaction_type": {
      "name": "Adverse reaction to substance",
      "code": "282100009",
      "code_system": "2.16.840.1.113883.6.96",
      "code_system_name": "SNOMED CT"
    },
    "allergen": {
      "name": "ASPIRIN",
      "code": "R16CO5Y76E",
      "code_system": "2.16.840.1.113883.4.9",
      "code_system_name": "UNII"
    }
  },
  {
    "date_range": {
      "start": "2009-09-02T04:00:00.000Z",
      "end": "2010-01-03T05:00:00.000Z"
    },
    "name": "drug allergy",
    "code": "416098002",
    "code_system": "2.16.840.1.113883.6.96",
    "code_system_name": "SNOMED CT",
    "status": "Active",
    "severity": "Moderate to severe",
    "reaction": {
      "name": "Nausea",
      "code": "73879007",
      "code_system": "2.16.840.1.113883.6.96"
    },
    "reaction_type": {
      "name": "Adverse reaction to substance",
      "code": "282100009",
      "code_system": "2.16.840.1.113883.6.96",
      "code_system_name": "SNOMED CT"
    },
    "allergen": {
      "name": "Codeine",
      "code": "Q830PW7520",
      "code_system": "2.16.840.1.113883.4.9",
      "code_system_name": "UNII"
    }
  }
]
```

### Medications

model is coming!

### Problems

model is coming!

### Procedures (only required for inpatient)

model is coming!

### Results (Labs)

model is coming!

### Demographics *

model is coming!

### Encounters**

model is coming!

### Immunizations**

model is coming!

### Vitals**

model is coming!
