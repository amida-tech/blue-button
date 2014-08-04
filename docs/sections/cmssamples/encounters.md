#Encounters Section

Data model description - [Encounters](../encounters.md)

##JSON model sample

```javascript
[{
    "encounter": {
        "name": "Office outpatient visit 15 minutes",
        "code": "99213",
        "code_system_name": "CPT",
        "translations": [{
            "name": "Ambulatory",
            "code": "AMB",
            "code_system_name": "HL7ActCode"
        }]
    },
    "identifiers": [{
        "identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
    }],
    "date": [{
        "date": "2009-02-27T13:00:00Z",
        "precision": "subsecond"
    }],
    "locations": [{
        "name": "Community Urgent Care Center",
        "loc_type": {
            "name": "Urgent Care Center",
            "code": "1160-1",
            "code_system_name": "HealthcareServiceLocation"
        },
        "addresses": [{
            "streetLines": [
                "17 Daws Rd."
            ],
            "city": "Blue Bell",
            "state": "MA",
            "zip": "02368",
            "country": "US"
        }]
    }],
    "findings": [{
        "name": "Pneumonia",
        "code": "233604007",
        "code_system_name": "SNOMED CT"
    }]
}]
```

##Original CCDA snippet

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
 
<!-- Title: US_Realm_Header_Template -->
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3"
	xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
				<section>
					<!-- conforms to Encounters section with entries optional -->
					<templateId root="2.16.840.1.113883.10.20.22.2.22"/>
					<!-- Encounters section with entries required -->
					<templateId root="2.16.840.1.113883.10.20.22.2.22.1"/>
					<code code="46240-8" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
						displayName="History of encounters"/>
					<title>ENCOUNTERS</title>
					<text>
						<table border="1" width="100%">
							<thead>
								<tr>
									<th>Encounter</th>
									<th>Performer</th>
									<th>Location</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<content ID="Encounter1"/> Checkup Examination </td>
									<td>Performer Name</td>
									<td>Community Urgent Care Center</td>
									<td>20090227130000+0500</td>
								</tr>
							</tbody>
						</table>
					</text>
					<entry typeCode="DRIV">
						<encounter classCode="ENC" moodCode="EVN">
							<!-- ** Encounter activities ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.49"/>
							<id root="2a620155-9d11-439e-92b3-5d9815ff4de8"/>
							<code code="99213" displayName="Office outpatient visit 15 minutes"
								codeSystemName="CPT" codeSystem="2.16.840.1.113883.6.12"
								codeSystemVersion="4">
								<originalText> Checkup Examination <reference value="#Encounter1"/>
								</originalText>
								<translation code="AMB" codeSystem="2.16.840.1.113883.5.4"
									displayName="Ambulatory" codeSystemName="HL7 ActEncounterCode"/>
							</code>
							<!-- February 27, 2009 at 1:00PM EST -->
							<effectiveTime value="20090227130000+0500"/>
							<performer>
								<assignedEntity>
									<!-- Provider NPI "PseduoMD-3" -->
									<id root="PseduoMD-3"/>
									<code code="59058001" codeSystem="2.16.840.1.113883.6.96"
										codeSystemName="SNOMED CT" displayName="General Physician"/>
								</assignedEntity>
							</performer>
							<participant typeCode="LOC">
								<participantRole classCode="SDLOC">
									<templateId root="2.16.840.1.113883.10.20.22.4.32"/>
									<!-- Service Delivery Location template -->
									<code code="1160-1" codeSystem="2.16.840.1.113883.6.259"
										codeSystemName="HealthcareServiceLocation"
										displayName="Urgent Care Center"/>
									<addr>
										<streetAddressLine>17 Daws Rd.</streetAddressLine>
										<city>Blue Bell</city>
										<state>MA</state>
										<postalCode>02368</postalCode>
										<country>US</country>
									</addr>
									<telecom nullFlavor="UNK"/>
									<playingEntity classCode="PLC">
										<name>Community Urgent Care Center</name>
									</playingEntity>
								</participantRole>
							</participant>
							<entryRelationship typeCode="RSON">
								<observation classCode="OBS" moodCode="EVN">
									<templateId root="2.16.840.1.113883.10.20.22.4.19"/>
									<id root="db734647-fc99-424c-a864-7e3cda82e703"
										extension="45665"/>
									<code code="404684003" displayName="Finding"
										codeSystem="2.16.840.1.113883.6.96"
										codeSystemName="SNOMED CT"/>
									<statusCode code="completed"/>
									<effectiveTime>
										<low value="20070103"/>
									</effectiveTime>
									<value xsi:type="CD" code="233604007" displayName="Pneumonia"
										codeSystem="2.16.840.1.113883.6.96"/>
								</observation>
							</entryRelationship>
						</encounter>
					</entry>
				</section>
</ClinicalDocument>

```