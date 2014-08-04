#Medications Section

Data model description - [Medications](../medications.md)

##JSON model sample

```javascript
[{
    "date": [{
        "date": "2007-01-03T00:00:00Z",
        "precision": "day"
    }, {
        "date": "2012-05-15T00:00:00Z",
        "precision": "day"
    }],
    "identifiers": [{
        "identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
    }],
    "status": "Completed",
    "sig": "Proventil HFA ",
    "product": {
        "identifiers": {
            "identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
        },
        "unencoded_name": "Proventil HFA ",
        "product": {
            "name": "Proventil HFA",
            "code": "219483",
            "code_system_name": "RXNORM",
            "translations": [{
                "name": "Proventil 0.09 MG/ACTUAT inhalant solution",
                "code": "573621",
                "code_system_name": "RXNORM"
            }]
        }
    },
    "administration": {
        "route": {
            "name": "RESPIRATORY (INHALATION)",
            "code": "C38216",
            "code_system_name": "Medication Route FDA"
        },
        "form": {
            "name": "INHALANT",
            "code": "C42944",
            "code_system_name": "Medication Route FDA"
        },
        "dose": {
            "value": 1,
            "unit": "mg/actuat"
        },
        "rate": {
            "value": 90,
            "unit": "ml/min"
        }
    },
    "precondition": {
        "code": {
            "code": "ASSERTION",
            "code_system_name": "HL7ActCode"
        },
        "value": {
            "name": "Wheezing",
            "code": "56018004",
            "code_system_name": "SNOMED CT"
        }
    }
}]
```

##Original CCDA snippet

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
 
<!-- Title: US_Realm_Header_Template -->
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3"
	xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
	<section>
		<!-- conforms to Medications section with entries optional -->
		<templateId root="2.16.840.1.113883.10.20.22.2.1"/>
		<!-- Medications section with entries required -->
		<templateId root="2.16.840.1.113883.10.20.22.2.1.1"/>
		<code code="10160-0" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
			displayName="HISTORY OF MEDICATION USE"/>
		<title>MEDICATIONS</title>
		<text>
			<table border="1" width="100%">
				<thead>
					<tr>
						<th>Medication</th>
						<th>Directions</th>
						<th>Start Date</th>
						<th>Status</th>
						<th>Indications</th>
						<th>Fill Instructions</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<content ID="MedSec_1">Proventil HFA
											</content>
						</td>
						<td>0.09 MG/ACTUAT inhalant solution, 2 puffs QID PRN
							wheezing</td>
						<td>20070103</td>
						<td>Active</td>
						<td>Pneumonia (233604007 SNOMED CT)</td>
						<td>Generic Substitition Allowed</td>
					</tr>
				</tbody>
			</table>
		</text>
		<entry typeCode="DRIV">
			<substanceAdministration classCode="SBADM" moodCode="EVN">
				<!-- ** Medication activity ** -->
				<templateId root="2.16.840.1.113883.10.20.22.4.16"/>
				<id root="cdbd33f0-6cde-11db-9fe1-0800200c9a66"/>
				<text>
					<reference value="#MedSec_1"/> Proventil HFA</text>
				<statusCode code="completed"/>
				<effectiveTime xsi:type="IVL_TS">
					<low value="20070103"/>
					<high value="20120515"/>
				</effectiveTime>
				<effectiveTime xsi:type="PIVL_TS" institutionSpecified="true"
					operator="A">
					<period value="6" unit="h"/>
				</effectiveTime>
				<routeCode code="C38216" codeSystem="2.16.840.1.113883.3.26.1.1"
					codeSystemName="NCI Thesaurus"
					displayName="RESPIRATORY (INHALATION)"/>
				<doseQuantity value="1" unit="mg/actuat"/>
				<rateQuantity value="90" unit="ml/min"/>
				<maxDoseQuantity nullFlavor="UNK">
					<numerator nullFlavor="UNK"/>
					<denominator nullFlavor="UNK"/>
				</maxDoseQuantity>
				<administrationUnitCode code="C42944" displayName="INHALANT"
					codeSystem="2.16.840.1.113883.3.26.1.1"
					codeSystemName="NCI Thesaurus"/>
				<consumable>
					<manufacturedProduct classCode="MANU">
						<!-- ** Medication information ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.23"/>
						<id root="2a620155-9d11-439e-92b3-5d9815ff4ee8"/>
						<manufacturedMaterial>
							<code code="219483" codeSystem="2.16.840.1.113883.6.88"
								displayName="Proventil HFA">
								<originalText>
									<reference value="#MedSec_1"/>
								</originalText>
								<translation code="573621"
									displayName="Proventil 0.09 MG/ACTUAT inhalant solution"
									codeSystem="2.16.840.1.113883.6.88"
									codeSystemName="RxNorm"/>
							</code>
						</manufacturedMaterial>
						<manufacturerOrganization>
							<name>Medication Factory Inc.</name>
						</manufacturerOrganization>
					</manufacturedProduct>
				</consumable>
				<performer>
					<assignedEntity>
						<id nullFlavor="NI"/>
						<addr nullFlavor="UNK"/>
						<telecom nullFlavor="UNK"/>
						<representedOrganization>
							<id root="2.16.840.1.113883.19.5.9999.1393"/>
							<name>Community Health and Hospitals</name>
							<telecom nullFlavor="UNK"/>
							<addr nullFlavor="UNK"/>
						</representedOrganization>
					</assignedEntity>
				</performer>
				<participant typeCode="CSM">
					<participantRole classCode="MANU">
						<!-- ** Drug vehicle ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.24"/>
						<code code="412307009" displayName="drug vehicle"
							codeSystem="2.16.840.1.113883.6.96"/>
						<playingEntity classCode="MMAT">
							<code code="324049" displayName="Aerosol"
								codeSystem="2.16.840.1.113883.6.88"
								codeSystemName="RxNorm"/>
							<name>Aerosol</name>
						</playingEntity>
					</participantRole>
				</participant>
				<entryRelationship typeCode="RSON">
					<observation classCode="OBS" moodCode="EVN">
						<!-- ** Indication ** -->
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
				<entryRelationship typeCode="REFR">
					<supply classCode="SPLY" moodCode="INT">
						<!-- ** Medication supply order ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.17"/>
						<id nullFlavor="NI"/>
						<statusCode code="completed"/>
						<effectiveTime xsi:type="IVL_TS">
							<low value="20070103"/>
							<high nullFlavor="UNK"/>
						</effectiveTime>
						<repeatNumber value="1"/>
						<quantity value="75"/>
						<product>
							<manufacturedProduct classCode="MANU">
								<!-- ** Medication information ** -->
								<templateId root="2.16.840.1.113883.10.20.22.4.23"/>
								<id root="2a620155-9d11-439e-92b3-5d9815ff4ee8"/>
								<manufacturedMaterial>
									<code code="573621"
									codeSystem="2.16.840.1.113883.6.88"
									displayName="Proventil 0.09 MG/ACTUAT inhalant solution">
									<originalText>
									<reference value="#MedSec_1"/>
									</originalText>
									<translation code="573621"
									displayName="Proventil 0.09 MG/ACTUAT inhalant solution"
									codeSystem="2.16.840.1.113883.6.88"
									codeSystemName="RxNorm"/>
									</code>
								</manufacturedMaterial>
								<manufacturerOrganization>
									<name>Medication Factory Inc.</name>
								</manufacturerOrganization>
							</manufacturedProduct>
						</product>
						<performer>
							<assignedEntity>
								<id extension="2981823"
									root="2.16.840.1.113883.19.5.9999.456"/>
								<addr>
									<streetAddressLine>1001 Village
									Avenue</streetAddressLine>
									<city>Portland</city>
									<state>OR</state>
									<postalCode>99123</postalCode>
									<country>US</country>
								</addr>
							</assignedEntity>
						</performer>
						<author>
							<time nullFlavor="UNK"/>
							<assignedAuthor>
								<id root="2a620155-9d11-439e-92b3-5d9815fe4de8"/>
								<addr nullFlavor="UNK"/>
								<telecom nullFlavor="UNK"/>
								<assignedPerson>
									<name>
									<prefix>Dr.</prefix>
									<given>Henry</given>
									<family>Seven</family>
									</name>
								</assignedPerson>
							</assignedAuthor>
						</author>
						<entryRelationship typeCode="SUBJ" inversionInd="true">
							<act classCode="ACT" moodCode="INT">
								<!-- ** Instructions ** -->
								<templateId root="2.16.840.1.113883.10.20.22.4.20"/>
								<code code="409073007"
									codeSystem="2.16.840.1.113883.6.96"
									displayName="instruction"/>
								<text>
									<reference value="#MedSec_1"/> label in spanish </text>
								<statusCode code="completed"/>
							</act>
						</entryRelationship>
					</supply>
				</entryRelationship>
				<entryRelationship typeCode="REFR">
					<supply classCode="SPLY" moodCode="EVN">
						<!-- ** Medication dispense ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.18"/>
						<id root="1.2.3.4.56789.1"
							extension="cb734647-fc99-424c-a864-7e3cda82e704"/>
						<statusCode code="completed"/>
						<effectiveTime value="20070103"/>
						<repeatNumber value="1"/>
						<quantity value="75"/>
						<product>
							<manufacturedProduct classCode="MANU">
								<!-- ** Medication information ** -->
								<templateId root="2.16.840.1.113883.10.20.22.4.23"/>
								<id root="2a620155-9d11-439e-92b3-5d9815ff4ee8"/>
								<manufacturedMaterial>
									<code code="573621"
									codeSystem="2.16.840.1.113883.6.88"
									displayName="Proventil 0.09 MG/ACTUAT inhalant solution">
									<originalText>
									<reference value="#MedSec_1"/>
									</originalText>
									<translation code="573621"
									displayName="Proventil 0.09 MG/ACTUAT inhalant solution"
									codeSystem="2.16.840.1.113883.6.88"
									codeSystemName="RxNorm"/>
									</code>
								</manufacturedMaterial>
								<manufacturerOrganization>
									<name>Medication Factory Inc.</name>
								</manufacturerOrganization>
							</manufacturedProduct>
						</product>
						<performer>
							<time nullFlavor="UNK"/>
							<assignedEntity>
								<id root="2.16.840.1.113883.19.5.9999.456"
									extension="2981823"/>
								<addr>
									<streetAddressLine>1001 Village
									Avenue</streetAddressLine>
									<city>Portland</city>
									<state>OR</state>
									<postalCode>99123</postalCode>
									<country>US</country>
								</addr>
								<telecom nullFlavor="UNK"/>
								<assignedPerson>
									<name>
									<prefix>Dr.</prefix>
									<given>Henry</given>
									<family>Seven</family>
									</name>
								</assignedPerson>
								<representedOrganization>
									<id root="2.16.840.1.113883.19.5.9999.1393"/>
									<name>Community Health and Hospitals</name>
									<telecom nullFlavor="UNK"/>
									<addr nullFlavor="UNK"/>
								</representedOrganization>
							</assignedEntity>
						</performer>
					</supply>
				</entryRelationship>
				<precondition typeCode="PRCN">
					<!-- ** Precondition for substance administration ** -->
					<templateId root="2.16.840.1.113883.10.20.22.4.25"/>
					<criterion>
						<code code="ASSERTION" codeSystem="2.16.840.1.113883.5.4"/>
						<value xsi:type="CE" code="56018004"
							codeSystem="2.16.840.1.113883.6.96" displayName="Wheezing"/>
					</criterion>
				</precondition>
			</substanceAdministration>
		</entry>
	</section>
</ClinicalDocument>

```