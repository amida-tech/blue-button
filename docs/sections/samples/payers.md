# Payers Section

Data model description - [Payers](../payers.md)

## JSON model sample

```javascript
[
    {
        "identifiers": [
            {
                "identifier": "1fe2cdd0-7aad-11db-9fe1-0800200c9a66"
            }
        ],
        "policy": {
            "identifiers": [
                {
                    "identifier": "3e676a50-7aac-11db-9fe1-0800200c9a66"
                }
            ],
            "code": {
                "code": "SELF",
                "code_system_name": "OID 2.16.840.1.113883.5.110"
            },
            "insurance": {
                "code": {
                    "code": "PAYOR",
                    "code_system_name": "OID 2.16.840.1.113883.5.110"
                },
                "performer": {
                    "identifiers": [
                        {
                            "identifier": "2.16.840.1.113883.19"
                        }
                    ],
                    "address": [
                        {
                            "streetLines": [
                                "123 Insurance Road"
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US",
                            "use": "work place"
                        }
                    ],
                    "phone": [
                        {
                            "number": "(781)555-1515",
                            "type": "work place"
                        }
                    ],
                    "organization": [
                        {
                            "name": [
                                "Good Health Insurance"
                            ],
                            "address": [
                                {
                                    "streetLines": [
                                        "123 Insurance Road"
                                    ],
                                    "city": "Blue Bell",
                                    "state": "MA",
                                    "zip": "02368",
                                    "country": "US",
                                    "use": "work place"
                                }
                            ],
                            "phone": [
                                {
                                    "number": "(781)555-1515",
                                    "type": "work place"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        "guarantor": {
            "code": {
                "code": "GUAR",
                "code_system_name": "HL7 Role"
            },
            "identifiers": [
                {
                    "identifier": "329fcdf0-7ab3-11db-9fe1-0800200c9a66"
                }
            ],
            "address": [
                {
                    "streetLines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US",
                    "use": "primary home"
                }
            ],
            "phone": [
                {
                    "number": "(781)555-1212",
                    "type": "primary home"
                }
            ],
            "name": [
                {
                    "prefix": "Mr.",
                    "middle": [
                        "Frankie"
                    ],
                    "last": "Everyman",
                    "first": "Adam"
                }
            ]
        },
        "participant": {
            "date_time": {},
            "code": {
                "name": "Self",
                "code": "SELF",
                "code_system_name": "HL7 Role"
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "14d4a520-7aae-11db-9fe1-0800200c9a66",
                        "identifier_type": "1138345"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "17 Daws Rd."
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US",
                        "use": "primary home"
                    }
                ]
            },
            "name": [
                {
                    "prefix": "Mr.",
                    "middle": [
                        "A."
                    ],
                    "last": "Everyman",
                    "first": "Frank"
                }
            ]
        },
        "policy_holder": {
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19",
                        "identifier_type": "1138345"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "17 Daws Rd."
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US",
                        "use": "primary home"
                    }
                ]
            }
        },
        "authorization": {
            "identifiers": [
                {
                    "identifier": "f4dce790-8328-11db-9fe1-0800200c9a66"
                }
            ],
            "procedure": {
                "code": {
                    "name": "Colonoscopy",
                    "code": "73761001",
                    "code_system_name": "SNOMED CT"
                }
            }
        }
    }
]

```

##Original CCDA snippet

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
 
<!-- Title: US_Realm_Header_Template -->
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3"
	xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
	<section>
		<!-- Payers section -->
		<templateId root="2.16.840.1.113883.10.20.22.2.18"/>
		<code code="48768-6" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
			displayName="Payer"/>
		<title>INSURANCE PROVIDERS</title>
		<text>
			<table border="1" width="100%">
				<thead>
					<tr>
						<th>Payer name</th>
						<th>Policy type / Coverage type</th>
						<th>Policy ID</th>
						<th>Covered party ID</th>
						<th>Policy Holder</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Good Health Insurance</td>
						<td>Extended healthcare / Family</td>
						<td>Contract Number</td>
						<td>1138345</td>
						<td>Patient's Mother</td>
					</tr>
				</tbody>
			</table>
		</text>
		<entry typeCode="DRIV">
			<act classCode="ACT" moodCode="EVN">
				<!-- ** Coverage activity ** -->
				<templateId root="2.16.840.1.113883.10.20.22.4.60"/>
				<id root="1fe2cdd0-7aad-11db-9fe1-0800200c9a66"/>
				<code code="48768-6" codeSystem="2.16.840.1.113883.6.1"
					codeSystemName="LOINC" displayName="Payment sources"/>
				<statusCode code="completed"/>
				<entryRelationship typeCode="COMP">
					<act classCode="ACT" moodCode="EVN">
						<!-- ** Policy activity ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.61"/>
						<id root="3e676a50-7aac-11db-9fe1-0800200c9a66"/>
						<code code="SELF" codeSystemName="HL7 RoleClassRelationship"
							codeSystem="2.16.840.1.113883.5.110"/>
						<statusCode code="completed"/>
						<!-- Insurance Company Information -->
						<performer typeCode="PRF">
							<templateId root="2.16.840.1.113883.10.20.22.4.87"/>
							<time>
								<low nullFlavor="UNK"/>
								<high nullFlavor="UNK"/>
							</time>
							<assignedEntity>
								<id root="2.16.840.1.113883.19"/>
								<code code="PAYOR" codeSystem="2.16.840.1.113883.5.110"
									codeSystemName="HL7 RoleCode"/>
								<addr use="WP">
									<!-- HP is "primary home" from codeSystem 2.16.840.1.113883.5.1119 -->
									<streetAddressLine>123 Insurance
									Road</streetAddressLine>
									<city>Blue Bell</city>
									<state>MA</state>
									<postalCode>02368</postalCode>
									<country>US</country>
									<!-- US is "United States" from ISO 3166-1 Country Codes: 1.0.3166.1 -->
								</addr>
								<telecom value="tel:(781)555-1515" use="WP"/>
								<representedOrganization>
									<name>Good Health Insurance</name>
									<telecom value="tel:(781)555-1515" use="WP"/>
									<addr use="WP">
									<!-- HP is "primary home" from codeSystem 2.16.840.1.113883.5.1119 -->
									<streetAddressLine>123 Insurance
									Road</streetAddressLine>
									<city>Blue Bell</city>
									<state>MA</state>
									<postalCode>02368</postalCode>
									<country>US</country>
									<!-- US is "United States" from ISO 3166-1 Country Codes: 1.0.3166.1 -->
									</addr>
								</representedOrganization>
							</assignedEntity>
						</performer>
						<!-- Guarantor Information... The person responsible for the final bill. -->
						<performer typeCode="PRF">
							<templateId root="2.16.840.1.113883.10.20.22.4.88"/>
							<time>
								<low nullFlavor="UNK"/>
								<high nullFlavor="UNK"/>
							</time>
							<assignedEntity>
								<id root="329fcdf0-7ab3-11db-9fe1-0800200c9a66"/>
								<code code="GUAR" codeSystem="2.16.840.1.113883.5.111"
									codeSystemName="HL7 RoleCode"/>
								<addr use="HP">
									<!-- HP is "primary home" from codeSystem 2.16.840.1.113883.5.1119 -->
									<streetAddressLine>17 Daws Rd.</streetAddressLine>
									<city>Blue Bell</city>
									<state>MA</state>
									<postalCode>02368</postalCode>
									<country>US</country>
									<!-- US is "United States" from ISO 3166-1 Country Codes: 1.0.3166.1 -->
								</addr>
								<telecom value="tel:(781)555-1212" use="HP"/>
								<assignedPerson>
									<name>
									<prefix>Mr.</prefix>
									<given>Adam</given>
									<given>Frankie</given>
									<family>Everyman</family>
									</name>
								</assignedPerson>
							</assignedEntity>
						</performer>
						<participant typeCode="COV">
							<!-- Covered Party Participant -->
							<templateId root="2.16.840.1.113883.10.20.22.4.89"/>
							<time>
								<low nullFlavor="UNK"/>
								<high nullFlavor="UNK"/>
							</time>
							<participantRole classCode="PAT">
								<!-- Health plan ID for patient. -->
								<id root="14d4a520-7aae-11db-9fe1-0800200c9a66"
									extension="1138345"/>
								<code code="SELF" codeSystem="2.16.840.1.113883.5.111"
									displayName="Self"/>
								<addr use="HP">
									<!-- HP is "primary home" from codeSystem 2.16.840.1.113883.5.1119 -->
									<streetAddressLine>17 Daws Rd.</streetAddressLine>
									<city>Blue Bell</city>
									<state>MA</state>
									<postalCode>02368</postalCode>
									<country>US</country>
									<!-- US is "United States" from ISO 3166-1 Country Codes: 1.0.3166.1 -->
								</addr>
								<playingEntity>
									<name>
									<!-- Name is needed if different than health plan name. -->
									<prefix>Mr.</prefix>
									<given>Frank</given>
									<given>A.</given>
									<family>Everyman</family>
									</name>
								</playingEntity>
							</participantRole>
						</participant>
						<!-- Policy Holder -->
						<participant typeCode="HLD">
							<templateId root="2.16.840.1.113883.10.20.22.4.90"/>
							<participantRole>
								<id extension="1138345" root="2.16.840.1.113883.19"/>
								<addr use="HP">
									<streetAddressLine>17 Daws Rd.</streetAddressLine>
									<city>Blue Bell</city>
									<state>MA</state>
									<postalCode>02368</postalCode>
									<country>US</country>
								</addr>
							</participantRole>
						</participant>
						<entryRelationship typeCode="REFR">
							<act classCode="ACT" moodCode="EVN">
								<!-- ** Authorization activity ** -->
								<templateId root="2.16.840.1.113883.10.20.1.19"/>
								<id root="f4dce790-8328-11db-9fe1-0800200c9a66"/>
								<code nullFlavor="NA"/>
								<entryRelationship typeCode="SUBJ">
									<procedure classCode="PROC" moodCode="PRMS">
									<code code="73761001"
									codeSystem="2.16.840.1.113883.6.96"
									codeSystemName="SNOMED CT"
									displayName="Colonoscopy"/>
									</procedure>
								</entryRelationship>
							</act>
						</entryRelationship>
						<!-- The above entryRelationship OR the following. <entryRelationship 
							typeCode="REFR"> <act classCode="ACT" moodCode="DEF"> <id root="f4dce790-8328-11db-9fe1-0800200c9a66"/> 
							<code nullFlavor="UNK"/> <text>Health Plan Name<reference value="PntrToHealthPlanNameInSectionText"/> 
							</text> <statusCode code="active"/> </act> </entryRelationship> -->
					</act>
				</entryRelationship>
			</act>
		</entry>
	</section>
```
