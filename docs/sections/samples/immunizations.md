#Immunizations Section

Data model description - [Immunizations](../immunizations.md)

##JSON model sample

```javascript
[{
    "date": [{
        "date": "1999-11-01T00:00:00Z",
        "precision": "month"
    }],
    "identifiers": [{
        "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
    }],
    "status": "complete",
    "product": {
        "product": {
            "name": "Influenza virus vaccine",
            "code": "88",
            "code_system_name": "CVX",
            "translations": [{
                "name": "Influenza, seasonal, injectable",
                "code": "141",
                "code_system_name": "CVX"
            }]
        },
        "lot_number": "1",
        "manufacturer": "Health LS - Immuno Inc."
    },
    "administration": {
        "route": {
            "name": "Intramuscular injection",
            "code": "C28161",
            "code_system_name": "Medication Route FDA"
        },
        "dose": {
            "value": 50,
            "unit": "mcg"
        }
    },
    "performer": {
        "identifiers": [{
            "identifier": "2.16.840.1.113883.19.5.9999.456",
            "identifier_type": "2981824"
        }],
        "name": [{
            "last": "Assigned",
            "first": "Amanda"
        }],
        "address": [{
            "streetLines": [
                "1021 Health Drive"
            ],
            "city": "Ann Arbor",
            "state": "MI",
            "zip": "99099",
            "country": "US"
        }],
        "organization": [{
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19.5.9999.1394"
            }],
            "name": [
                "Good Health Clinic"
            ]
        }]
    }
}, {
    "date": [{
        "date": "1998-12-15T00:00:00Z",
        "precision": "day"
    }],
    "identifiers": [{
        "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
    }],
    "status": "refused",
    "product": {
        "product": {
            "name": "Influenza virus vaccine",
            "code": "88",
            "code_system_name": "CVX",
            "translations": [{
                "name": "Influenza, seasonal, injectable",
                "code": "141",
                "code_system_name": "CVX"
            }]
        },
        "lot_number": "1",
        "manufacturer": "Health LS - Immuno Inc."
    },
    "administration": {
        "route": {
            "name": "Intramuscular injection",
            "code": "C28161",
            "code_system_name": "Medication Route FDA"
        },
        "dose": {
            "value": 50,
            "unit": "mcg"
        }
    },
    "performer": {
        "identifiers": [{
            "identifier": "2.16.840.1.113883.19.5.9999.456",
            "identifier_type": "2981824"
        }],
        "name": [{
            "last": "Assigned",
            "first": "Amanda"
        }],
        "address": [{
            "streetLines": [
                "1021 Health Drive"
            ],
            "city": "Ann Arbor",
            "state": "MI",
            "zip": "99099",
            "country": "US"
        }],
        "organization": [{
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19.5.9999.1394"
            }],
            "name": [
                "Good Health Clinic"
            ]
        }]
    }
}, {
    "date": [{
        "date": "1998-12-15T00:00:00Z",
        "precision": "day"
    }],
    "identifiers": [{
        "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
    }],
    "status": "complete",
    "product": {
        "product": {
            "name": "Pneumococcal polysaccharide vaccine",
            "code": "33",
            "code_system_name": "CVX",
            "translations": [{
                "name": "Pneumococcal NOS",
                "code": "109",
                "code_system_name": "CVX"
            }]
        },
        "lot_number": "1",
        "manufacturer": "Health LS - Immuno Inc."
    },
    "administration": {
        "route": {
            "name": "Intramuscular injection",
            "code": "C28161",
            "code_system_name": "Medication Route FDA"
        },
        "dose": {
            "value": 50,
            "unit": "mcg"
        }
    },
    "performer": {
        "identifiers": [{
            "identifier": "2.16.840.1.113883.19.5.9999.456",
            "identifier_type": "2981824"
        }],
        "name": [{
            "last": "Assigned",
            "first": "Amanda"
        }],
        "address": [{
            "streetLines": [
                "1021 Health Drive"
            ],
            "city": "Ann Arbor",
            "state": "MI",
            "zip": "99099",
            "country": "US"
        }],
        "organization": [{
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19.5.9999.1394"
            }],
            "name": [
                "Good Health Clinic"
            ]
        }]
    }
}, {
    "date": [{
        "date": "1998-12-15T00:00:00Z",
        "precision": "day"
    }],
    "identifiers": [{
        "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
    }],
    "status": "refused",
    "product": {
        "product": {
            "name": "Tetanus and diphtheria toxoids - preservative free",
            "code": "103",
            "code_system_name": "CVX",
            "translations": [{
                "name": "Tetanus and diphtheria toxoids - preservative free",
                "code": "09",
                "code_system_name": "CVX"
            }]
        },
        "lot_number": "1",
        "manufacturer": "Health LS - Immuno Inc."
    },
    "administration": {
        "route": {
            "name": "Intramuscular injection",
            "code": "C28161",
            "code_system_name": "Medication Route FDA"
        },
        "dose": {
            "value": 50,
            "unit": "mcg"
        }
    },
    "performer": {
        "identifiers": [{
            "identifier": "2.16.840.1.113883.19.5.9999.456",
            "identifier_type": "2981824"
        }],
        "name": [{
            "last": "Assigned",
            "first": "Amanda"
        }],
        "address": [{
            "streetLines": [
                "1021 Health Drive"
            ],
            "city": "Ann Arbor",
            "state": "MI",
            "zip": "99099",
            "country": "US"
        }],
        "organization": [{
            "identifiers": [{
                "identifier": "2.16.840.1.113883.19.5.9999.1394"
            }],
            "name": [
                "Good Health Clinic"
            ]
        }]
    },
    "refusal_reason": "Patient objection"
}]
```

##Original CCDA snippet

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
 
<!-- Title: US_Realm_Header_Template -->
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3"
	xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
	<section>
					<!-- conforms to Immunizations section with entries optional -->
					<templateId root="2.16.840.1.113883.10.20.22.2.2"/>
					<!-- Immunizations section with entries required -->
					<templateId root="2.16.840.1.113883.10.20.22.2.2.1"/>
					<code code="11369-6" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
						displayName="History of immunizations"/>
					<title>IMMUNIZATIONS</title>
					<text>
						<content ID="immunSect"/>
						<table border="1" width="100%">
							<thead>
								<tr>
									<th>Vaccine</th>
									<th>Date</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<content ID="immi1"/> Influenza, seasonal, IM </td>
									<td>Nov 1999</td>
									<td>Completed</td>
								</tr>
								<tr>
									<td>
										<content ID="immi2"/> Influenza, seasonal, IM </td>
									<td>Dec 1998</td>
									<td>Completed</td>
								</tr>
								<tr>
									<td>
										<content ID="immi3"/> Pneumococcal polysaccharide vaccine,
										IM </td>
									<td>Dec 1998</td>
									<td>Completed</td>
								</tr>
								<tr>
									<td>
										<content ID="immi4"/> Tetanus and diphtheria toxoids, IM </td>
									<td>1997</td>
									<td>Refused</td>
								</tr>
							</tbody>
						</table>
					</text>
					<entry typeCode="DRIV">
						<substanceAdministration classCode="SBADM" moodCode="EVN"
							negationInd="false">
							<!-- ** Immunization activity ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.52"/>
							<id root="e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"/>
							<text>
								<reference value="#immun1"/>
							</text>
							<statusCode code="completed"/>
							<effectiveTime xsi:type="IVL_TS" value="199911"/>
							<routeCode code="C28161" codeSystem="2.16.840.1.113883.3.26.1.1"
								codeSystemName="National Cancer Institute (NCI) Thesaurus"
								displayName="Intramuscular injection"/>
							<doseQuantity value="50" unit="mcg"/>
							<consumable>
								<manufacturedProduct classCode="MANU">
									<!-- ** Immunization medication information ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.54"/>
									<manufacturedMaterial>
										<code code="88" codeSystem="2.16.840.1.113883.12.292"
											displayName="Influenza virus vaccine"
											codeSystemName="CVX">
											<originalText>
												<reference value="#immi1"/>
											</originalText>
											<translation code="141"
												displayName="Influenza, seasonal, injectable"
												codeSystemName="CVX"
												codeSystem="2.16.840.1.113883.12.292"/>
										</code>
										<lotNumberText>1</lotNumberText>
									</manufacturedMaterial>
									<manufacturerOrganization>
										<name>Health LS - Immuno Inc.</name>
									</manufacturerOrganization>
								</manufacturedProduct>
							</consumable>
							<performer>
								<assignedEntity>
									<id root="2.16.840.1.113883.19.5.9999.456" extension="2981824"/>
									<addr>
										<streetAddressLine>1021 Health Drive</streetAddressLine>
										<city>Ann Arbor</city>
										<state>MI</state>
										<postalCode>99099</postalCode>
										<country>US</country>
									</addr>
									<telecom nullFlavor="UNK"/>
									<assignedPerson>
										<name>
											<given>Amanda</given>
											<family>Assigned</family>
										</name>
									</assignedPerson>
									<representedOrganization>
										<id root="2.16.840.1.113883.19.5.9999.1394"/>
										<name>Good Health Clinic</name>
										<telecom nullFlavor="UNK"/>
										<addr nullFlavor="UNK"/>
									</representedOrganization>
								</assignedEntity>
							</performer>
							<entryRelationship typeCode="SUBJ" inversionInd="false">
								<act classCode="ACT" moodCode="INT">
									<!-- ** Instructions ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.20"/>
									<code code="171044003" codeSystem="2.16.840.1.113883.6.96"
										displayName="immunization education"/>
									<text>
										<reference value="#immunSect"/> Possible flu-like symptoms
										for three days. </text>
									<statusCode code="completed"/>
								</act>
							</entryRelationship>
						</substanceAdministration>
					</entry>
					<entry typeCode="DRIV">
						<substanceAdministration classCode="SBADM" moodCode="EVN" negationInd="true">
							<!-- ** Immunization activity ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.52"/>
							<id root="e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"/>
							<text>
								<reference value="#immun2"/>
							</text>
							<statusCode code="completed"/>
							<effectiveTime xsi:type="IVL_TS" value="19981215"/>
							<routeCode code="C28161" codeSystem="2.16.840.1.113883.3.26.1.1"
								codeSystemName="National Cancer Institute (NCI) Thesaurus"
								displayName="Intramuscular injection"/>
							<doseQuantity value="50" unit="mcg"/>
							<consumable>
								<manufacturedProduct classCode="MANU">
									<!-- ** Immunization medication information ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.54"/>
									<manufacturedMaterial>
										<code code="88" codeSystem="2.16.840.1.113883.12.292"
											displayName="Influenza virus vaccine"
											codeSystemName="CVX">
											<originalText>
												<reference value="#immi2"/>
											</originalText>
											<translation code="141"
												displayName="Influenza, seasonal, injectable"
												codeSystemName="CVX"
												codeSystem="2.16.840.1.113883.12.292"/>
										</code>
										<lotNumberText>1</lotNumberText>
									</manufacturedMaterial>
									<manufacturerOrganization>
										<name>Health LS - Immuno Inc.</name>
									</manufacturerOrganization>
								</manufacturedProduct>
							</consumable>
							<performer>
								<assignedEntity>
									<id root="2.16.840.1.113883.19.5.9999.456" extension="2981824"/>
									<addr>
										<streetAddressLine>1021 Health Drive</streetAddressLine>
										<city>Ann Arbor</city>
										<state>MI</state>
										<postalCode>99099</postalCode>
										<country>US</country>
									</addr>
									<telecom nullFlavor="UNK"/>
									<assignedPerson>
										<name>
											<given>Amanda</given>
											<family>Assigned</family>
										</name>
									</assignedPerson>
									<representedOrganization>
										<id root="2.16.840.1.113883.19.5.9999.1394"/>
										<name>Good Health Clinic</name>
										<telecom nullFlavor="UNK"/>
										<addr nullFlavor="UNK"/>
									</representedOrganization>
								</assignedEntity>
							</performer>
							<entryRelationship typeCode="SUBJ" inversionInd="true">
								<act classCode="ACT" moodCode="INT">
									<!-- ** Instructions ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.20"/>
									<code code="171044003" codeSystem="2.16.840.1.113883.6.96"
										displayName="immunization education"/>
									<text>
										<reference value="#immunSect"/> Possible flu-like symptoms
										for three days. </text>
									<statusCode code="completed"/>
								</act>
							</entryRelationship>
						</substanceAdministration>
					</entry>
					<entry typeCode="DRIV">
						<substanceAdministration classCode="SBADM" moodCode="EVN"
							negationInd="false">
							<!-- ** Immunization activity ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.52"/>
							<id root="e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"/>
							<text>
								<reference value="#immun3"/>
							</text>
							<statusCode code="completed"/>
							<effectiveTime xsi:type="IVL_TS" value="19981215"/>
							<routeCode code="C28161" codeSystem="2.16.840.1.113883.3.26.1.1"
								codeSystemName="National Cancer Institute (NCI) Thesaurus"
								displayName="Intramuscular injection"/>
							<doseQuantity value="50" unit="mcg"/>
							<consumable>
								<manufacturedProduct classCode="MANU">
									<!-- ** Immunization medication information ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.54"/>
									<manufacturedMaterial>
										<code code="33" codeSystem="2.16.840.1.113883.12.292"
											displayName="Pneumococcal polysaccharide vaccine"
											codeSystemName="CVX">
											<originalText>
												<reference value="#immi3"/>
											</originalText>
											<translation code="109" displayName="Pneumococcal NOS"
												codeSystemName="CVX"
												codeSystem="2.16.840.1.113883.12.292"/>
										</code>
										<lotNumberText>1</lotNumberText>
									</manufacturedMaterial>
									<manufacturerOrganization>
										<name>Health LS - Immuno Inc.</name>
									</manufacturerOrganization>
								</manufacturedProduct>
							</consumable>
							<performer>
								<assignedEntity>
									<id root="2.16.840.1.113883.19.5.9999.456" extension="2981824"/>
									<addr>
										<streetAddressLine>1021 Health Drive</streetAddressLine>
										<city>Ann Arbor</city>
										<state>MI</state>
										<postalCode>99099</postalCode>
										<country>US</country>
									</addr>
									<telecom nullFlavor="UNK"/>
									<assignedPerson>
										<name>
											<given>Amanda</given>
											<family>Assigned</family>
										</name>
									</assignedPerson>
									<representedOrganization>
										<id root="2.16.840.1.113883.19.5.9999.1394"/>
										<name>Good Health Clinic</name>
										<telecom nullFlavor="UNK"/>
										<addr nullFlavor="UNK"/>
									</representedOrganization>
								</assignedEntity>
							</performer>
						</substanceAdministration>
					</entry>
					<entry typeCode="DRIV">
						<substanceAdministration classCode="SBADM" moodCode="EVN" negationInd="true">
							<!-- ** Immunization activity ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.52"/>
							<id root="e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"/>
							<text>
								<reference value="#immun4"/>
							</text>
							<statusCode code="completed"/>
							<effectiveTime xsi:type="IVL_TS" value="19981215"/>
							<routeCode code="C28161" codeSystem="2.16.840.1.113883.3.26.1.1"
								codeSystemName="National Cancer Institute (NCI) Thesaurus"
								displayName="Intramuscular injection"/>
							<doseQuantity value="50" unit="mcg"/>
							<consumable>
								<manufacturedProduct classCode="MANU">
									<!-- ** Immunization medication Iinformation ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.54"/>
									<manufacturedMaterial>
										<code code="103" codeSystem="2.16.840.1.113883.12.292"
											displayName="Tetanus and diphtheria toxoids - preservative free"
											codeSystemName="CVX">
											<originalText>
												<reference value="#immi4"/>
											</originalText>
											<translation code="09"
												displayName="Tetanus and diphtheria toxoids - preservative free"
												codeSystemName="CVX"
												codeSystem="2.16.840.1.113883.12.292"/>
										</code>
										<lotNumberText>1</lotNumberText>
									</manufacturedMaterial>
									<manufacturerOrganization>
										<name>Health LS - Immuno Inc.</name>
									</manufacturerOrganization>
								</manufacturedProduct>
							</consumable>
							<performer>
								<assignedEntity>
									<id root="2.16.840.1.113883.19.5.9999.456" extension="2981824"/>
									<addr>
										<streetAddressLine>1021 Health Drive</streetAddressLine>
										<city>Ann Arbor</city>
										<state>MI</state>
										<postalCode>99099</postalCode>
										<country>US</country>
									</addr>
									<telecom nullFlavor="UNK"/>
									<assignedPerson>
										<name>
											<given>Amanda</given>
											<family>Assigned</family>
										</name>
									</assignedPerson>
									<representedOrganization>
										<id root="2.16.840.1.113883.19.5.9999.1394"/>
										<name>Good Health Clinic</name>
										<telecom nullFlavor="UNK"/>
										<addr nullFlavor="UNK"/>
									</representedOrganization>
								</assignedEntity>
							</performer>
							<entryRelationship typeCode="RSON">
								<observation classCode="OBS" moodCode="EVN">
									<!-- ** Immunization refusal ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.53"/>
									<id root="2a620155-9d11-439e-92b3-5d9815ff4dd8"/>
									<code displayName="Patient Objection" code="PATOBJ"
										codeSystemName="HL7 ActNoImmunizationReason"
										codeSystem="2.16.840.1.113883.5.8"/>
									<statusCode code="completed"/>
								</observation>
							</entryRelationship>
						</substanceAdministration>
					</entry>
				</section>
</ClinicalDocument>

```