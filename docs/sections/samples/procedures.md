#Procedures Section

Data model description - [Procedures](../procedures.md)

##JSON model sample

```javascript
[{
    "procedure": {
        "name": "Colonoscopy",
        "code": "73761001",
        "code_system_name": "SNOMED CT"
    },
    "identifiers": [{
        "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
    }],
    "status": "Completed",
    "date": [{
        "date": "2012-05-12T00:00:00Z",
        "precision": "day"
    }],
    "body_sites": [{
        "name": "colon",
        "code": "appropriate_code",
        "code_system_name": "OID 2.16.840.1.113883.3.88.12.3221.8.9"
    }],
    "providers": [{
        "address": {
            "streetLines": [
                "1001 Village Avenue"
            ],
            "city": "Portland",
            "state": "OR",
            "zip": "99123",
            "country": "US"
        },
        "phone": [{
            "number": "555-555-5000",
            "type": "work place"
        }],
        "organization": {
            "name": "Community Health and Hospitals",
            "address": {
                "streetLines": [
                    "1001 Village Avenue"
                ],
                "city": "Portland",
                "state": "OR",
                "zip": "99123",
                "country": "US"
            },
            "phone": [{
                "number": "555-555-5000",
                "type": "work place"
            }]
        }
    }],
    "procedure_type": "procedure"
}, {
    "procedure": {
        "name": "Colonic polypectomy",
        "code": "274025005",
        "code_system_name": "SNOMED CT"
    },
    "identifiers": [{
        "identifier": "2.16.840.1.113883.19",
        "identifier_type": "123456789"
    }],
    "status": "Aborted",
    "date": [{
        "date": "2011-02-03T00:00:00Z",
        "precision": "day"
    }],
    "body_sites": [{
        "name": "Abdomen and pelvis",
        "code": "416949008",
        "code_system_name": "SNOMED CT"
    }],
    "providers": [{
        "address": {
            "streetLines": [
                "17 Daws Rd."
            ],
            "city": "Blue Bell",
            "state": "MA",
            "zip": "02368",
            "country": "US"
        },
        "phone": [{
            "number": "(555)555-555-1234",
            "type": "work place"
        }],
        "organization": {
            "name": "Community Health and Hospitals"
        }
    }],
    "locations": [{
        "name": "Community Gastroenterology Clinic",
        "loc_type": {
            "name": "Gastroenterology Clinic",
            "code": "1118-9",
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
    "procedure_type": "observation"
}, {
    "procedure": {
        "name": "Colonic polypectomy",
        "code": "274025005",
        "code_system_name": "SNOMED CT"
    },
    "identifiers": [{
        "identifier": "1.2.3.4.5.6.7.8",
        "identifier_type": "1234567"
    }],
    "status": "Completed",
    "date": [{
        "date": "2011-02-03T00:00:00Z",
        "precision": "day"
    }],
    "providers": [{
        "address": {
            "streetLines": [
                "17 Daws Rd."
            ],
            "city": "Blue Bell",
            "state": "MA",
            "zip": "02368",
            "country": "US"
        },
        "phone": [{
            "number": "(555)555-555-1234",
            "type": "work place"
        }],
        "organization": {
            "name": "Community Health and Hospitals"
        }
    }],
    "locations": [{
        "name": "Community Gastroenterology Clinic",
        "loc_type": {
            "name": "Gastroenterology Clinic",
            "code": "1118-9",
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
    "procedure_type": "act"
}]
```

##Original CCDA snippet

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
 
<!-- Title: US_Realm_Header_Template -->
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3"
	xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
				<section>
					<!-- conforms to Procedures section with entries optional -->
					<templateId root="2.16.840.1.113883.10.20.22.2.7"/>
					<!-- Procedures section with entries required -->
					<templateId root="2.16.840.1.113883.10.20.22.2.7.1"/>
					<code code="47519-4" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
						displayName="HISTORY OF PROCEDURES"/>
					<title>PROCEDURES</title>
					<text>
						<table border="1" width="100%">
							<thead>
								<tr>
									<th>Procedure</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<content ID="Proc1">Colonic polypectomy</content>
									</td>
									<td>1998</td>
								</tr>
							</tbody>
						</table>
					</text>
					<!-- Examples of the same procedure are shown in different procedure entries -->
					<entry typeCode="DRIV">
						<procedure classCode="PROC" moodCode="EVN">
							<!-- ** Procedure activity procedure ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.14"/>
							<id root="d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"/>
							<code code="73761001" codeSystem="2.16.840.1.113883.6.96"
								codeSystemName="SNOMED CT" displayName="Colonoscopy">
								<originalText>
									<reference value="#Proc1"/>
								</originalText>
							</code>
							<statusCode code="completed"/>
							<effectiveTime value="20120512"/>
							<methodCode nullFlavor="UNK"/>
							<targetSiteCode code="appropriate_code" displayName="colon"
								codeSystem="2.16.840.1.113883.3.88.12.3221.8.9"
								codeSystemName="Body Site Value Set"/>
							<specimen typeCode="SPC">
								<specimenRole classCode="SPEC">
									<id root="c2ee9ee9-ae31-4628-a919-fec1cbb58683"/>
									<specimenPlayingEntity>
										<code code="309226005" codeSystem="2.16.840.1.113883.6.96"
											displayName="colonic polyp sample"/>
									</specimenPlayingEntity>
								</specimenRole>
							</specimen>
							<performer>
								<assignedEntity>
									<id root="2.16.840.1.113883.19.5.9999.456" extension="2981823"/>
									<addr>
										<streetAddressLine>1001 Village Avenue</streetAddressLine>
										<city>Portland</city>
										<state>OR</state>
										<postalCode>99123</postalCode>
										<country>US</country>
									</addr>
									<telecom use="WP" value="555-555-5000"/>
									<representedOrganization>
										<id root="2.16.840.1.113883.19.5.9999.1393"/>
										<name>Community Health and Hospitals</name>
										<telecom use="WP" value="555-555-5000"/>
										<addr>
											<streetAddressLine>1001 Village
												Avenue</streetAddressLine>
											<city>Portland</city>
											<state>OR</state>
											<postalCode>99123</postalCode>
											<country>US</country>
										</addr>
									</representedOrganization>
								</assignedEntity>
							</performer>
							<participant typeCode="DEV">
								<participantRole classCode="MANU">
									<!-- ** Product instance ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.37"/>
									<id root="742aee30-21c5-11e1-bfc2-0800200c9a66"/>
									<playingDevice>
										<code code="90412006" codeSystem="2.16.840.1.113883.6.96"
											displayName="Colonoscope"/>
									</playingDevice>
									<scopingEntity>
										<id root="eb936010-7b17-11db-9fe1-0800200c9b65"/>
									</scopingEntity>
								</participantRole>
							</participant>
						</procedure>
					</entry>
					<entry>
						<observation classCode="OBS" moodCode="EVN">
							<!-- ** Procedure activity observation ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.13"/>
							<id extension="123456789" root="2.16.840.1.113883.19"/>
							<code code="274025005" codeSystem="2.16.840.1.113883.6.96"
								displayName="Colonic polypectomy" codeSystemName="SNOMED-CT">
								<originalText>
									<reference value="#Proc1"/>
								</originalText>
							</code>
							<statusCode code="aborted"/>
							<effectiveTime value="20110203"/>
							<priorityCode code="CR" codeSystem="2.16.840.1.113883.5.7"
								codeSystemName="ActPriority" displayName="Callback results"/>
							<value xsi:type="CD"/>
							<methodCode nullFlavor="UNK"/>
							<targetSiteCode code="416949008" codeSystem="2.16.840.1.113883.6.96"
								codeSystemName="SNOMED CT" displayName="Abdomen and pelvis"/>
							<performer>
								<assignedEntity>
									<id root="2.16.840.1.113883.19.5" extension="1234"/>
									<addr>
										<streetAddressLine>17 Daws Rd.</streetAddressLine>
										<city>Blue Bell</city>
										<state>MA</state>
										<postalCode>02368</postalCode>
										<country>US</country>
									</addr>
									<telecom use="WP" value="(555)555-555-1234"/>
									<representedOrganization>
										<id root="2.16.840.1.113883.19.5"/>
										<name>Community Health and Hospitals</name>
										<telecom nullFlavor="UNK"/>
										<addr nullFlavor="UNK"/>
									</representedOrganization>
								</assignedEntity>
							</performer>
							<participant typeCode="LOC">
								<participantRole classCode="SDLOC">
									<!-- ** Service delivery location ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.32"/>
									<code code="1118-9" codeSystem="2.16.840.1.113883.6.259"
										codeSystemName="HealthcareServiceLocation"
										displayName="Gastroenterology Clinic"/>
									<addr>
										<streetAddressLine>17 Daws Rd.</streetAddressLine>
										<city>Blue Bell</city>
										<state>MA</state>
										<postalCode>02368</postalCode>
										<country>US</country>
									</addr>
									<telecom nullFlavor="UNK"/>
									<playingEntity classCode="PLC">
										<name>Community Gastroenterology Clinic</name>
									</playingEntity>
								</participantRole>
							</participant>
						</observation>
					</entry>
					<entry>
						<act classCode="ACT" moodCode="INT">
							<!-- Procedure activity act -->
							<templateId root="2.16.840.1.113883.10.20.22.4.12"/>
							<id root="1.2.3.4.5.6.7.8" extension="1234567"/>
							<code code="274025005" codeSystem="2.16.840.1.113883.6.96"
								codeSystemName="SNOMED CT" displayName="Colonic polypectomy">
								<originalText>
									<reference value="#Proc1"/>
								</originalText>
							</code>
							<statusCode code="completed"/>
							<effectiveTime value="20110203"/>
							<priorityCode code="CR" codeSystem="2.16.840.1.113883.5.7"
								codeSystemName="ActPriority" displayName="Callback results"/>
							<performer>
								<assignedEntity>
									<id root="2.16.840.1.113883.19" extension="1234"/>
									<addr>
										<streetAddressLine>17 Daws Rd.</streetAddressLine>
										<city>Blue Bell</city>
										<state>MA</state>
										<postalCode>02368</postalCode>
										<country>US</country>
									</addr>
									<telecom use="WP" value="(555)555-555-1234"/>
									<representedOrganization>
										<id root="2.16.840.1.113883.19.5"/>
										<name>Community Health and Hospitals</name>
										<telecom nullFlavor="UNK"/>
										<addr nullFlavor="UNK"/>
									</representedOrganization>
								</assignedEntity>
							</performer>
							<participant typeCode="LOC">
								<participantRole classCode="SDLOC">
									<!-- ** Service delivery location ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.32"/>
									<code code="1118-9" codeSystem="2.16.840.1.113883.6.259"
										codeSystemName="HealthcareServiceLocation"
										displayName="Gastroenterology Clinic"/>
									<addr>
										<streetAddressLine>17 Daws Rd.</streetAddressLine>
										<city>Blue Bell</city>
										<state>MA</state>
										<postalCode>02368</postalCode>
										<country>US</country>
									</addr>
									<telecom nullFlavor="UNK"/>
									<playingEntity classCode="PLC">
										<name>Community Gastroenterology Clinic</name>
									</playingEntity>
								</participantRole>
							</participant>
						</act>
					</entry>
				</section>
</ClinicalDocument>

```