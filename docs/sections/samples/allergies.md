#Allergies Section

Data model description - [Allergies](../allergies.md)

##JSON model sample

```javascript
[{
    "date": [{
        "date": "2007-05-01T00:00:00Z",
        "precision": "day"
    }],
    "identifiers": [{
        "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
    }],
    "allergen": {
        "name": "ALLERGENIC EXTRACT, PENICILLIN",
        "code": "314422",
        "code_system_name": "RXNORM"
    },
    "severity": "Moderate to severe",
    "status": "Inactive",
    "reaction": [{
        "reaction": {
            "name": "Nausea",
            "code": "422587007",
            "code_system_name": "SNOMED CT"
        },
        "severity": "Mild"
    }]
}, {
    "date": [{
        "date": "2006-05-01T00:00:00Z",
        "precision": "day"
    }],
    "identifiers": [{
        "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
    }],
    "allergen": {
        "name": "Codeine",
        "code": "2670",
        "code_system_name": "RXNORM"
    },
    "severity": "Moderate",
    "status": "Active",
    "reaction": [{
        "reaction": {
            "name": "Wheezing",
            "code": "56018004",
            "code_system_name": "SNOMED CT"
        },
        "severity": "Mild"
    }]
}, {
    "date": [{
        "date": "2008-05-01T00:00:00Z",
        "precision": "day"
    }],
    "identifiers": [{
        "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
    }],
    "allergen": {
        "name": "Aspirin",
        "code": "1191",
        "code_system_name": "RXNORM"
    },
    "severity": "Mild to moderate",
    "status": "Active",
    "reaction": [{
        "reaction": {
            "name": "Hives",
            "code": "247472004",
            "code_system_name": "SNOMED CT"
        },
        "severity": "Mild to moderate"
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
					<!-- conforms to Allergies section with entries optional -->
					<templateId root="2.16.840.1.113883.10.20.22.2.6"/>
					<!-- Allergies section with entries required -->
					<templateId root="2.16.840.1.113883.10.20.22.2.6.1"/>
					<code code="48765-2" codeSystem="2.16.840.1.113883.6.1"/>
					<title>ALLERGIES, ADVERSE REACTIONS, ALERTS</title>
					<text>
						<table border="1" width="100%">
							<thead>
								<tr>
									<th>Substance</th>
									<th>Overall Severity</th>
									<th>Reaction</th>
									<th>Reaction Severity</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>ALLERGENIC EXTRACT, PENICILLIN</td>
									<td>
										<content ID="severity4">Moderate to Severe</content>
									</td>
									<td>
										<content ID="reaction1">Nausea</content>
									</td>
									<td>
										<content ID="severity1">Mild</content>
									</td>
									<td>Inactive</td>
								</tr>
								<tr>
									<td>Codeine</td>
									<td>
										<content ID="severity5">Mild</content>
									</td>
									<td>
										<content ID="reaction2">Wheezing</content>
									</td>
									<td>
										<content ID="severity2">Moderate</content>
									</td>
									<td>Active</td>
								</tr>
								<tr>
									<td>Aspirin</td>
									<td>
										<content ID="severity6">Mild</content>
									</td>
									<td>
										<content ID="reaction3">Hives</content>
									</td>
									<td>
										<content ID="severity3">Mild to moderate</content>
									</td>
									<td>Active</td>
								</tr>
							</tbody>
						</table>
					</text>
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
					<entry typeCode="DRIV">
						<act classCode="ACT" moodCode="EVN">
							<!-- ** Allergy problem act ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.30"/>
							<id root="36e3e930-7b14-11db-9fe1-0800200c9a66"/>
							<code code="48765-2" codeSystem="2.16.840.1.113883.6.1"
								codeSystemName="LOINC"
								displayName="Allergies, adverse reactions, alerts"/>
							<statusCode code="active"/>
							<effectiveTime value="20060501"/>
							<entryRelationship typeCode="SUBJ" inversionInd="true">
								<observation classCode="OBS" moodCode="EVN">
									<!-- ** Allergy observation ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.7"/>
									<id root="4adc1020-7b14-11db-9fe1-0800200c9a66"/>
									<code code="ASSERTION" codeSystem="2.16.840.1.113883.5.4"/>
									<statusCode code="completed"/>
									<effectiveTime>
										<low value="20060501"/>
									</effectiveTime>
									<value xsi:type="CD" code="419511003"
										displayName="Propensity to adverse reactions to drug"
										codeSystem="2.16.840.1.113883.6.96"
										codeSystemName="SNOMED CT">
										<originalText>
											<reference value="#reaction2"/>
										</originalText>
									</value>
									<participant typeCode="CSM">
										<participantRole classCode="MANU">
											<playingEntity classCode="MMAT">
												<code code="2670" displayName="Codeine"
												codeSystem="2.16.840.1.113883.6.88"
												codeSystemName="RxNorm">
												<originalText>
												<reference value="#reaction2"/>
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
											<value xsi:type="CE" code="55561003"
												codeSystem="2.16.840.1.113883.6.96"
												displayName="Active"/>
										</observation>
									</entryRelationship>
									<entryRelationship typeCode="MFST" inversionInd="true">
										<observation classCode="OBS" moodCode="EVN">
											<!-- ** Reaction observation ** -->
											<templateId root="2.16.840.1.113883.10.20.22.4.9"/>
											<id root="4adc1020-7b14-11db-9fe1-0800200c9a64"/>
											<code nullFlavor="NA"/>
											<text>
												<reference value="#reaction2"/>
											</text>
											<statusCode code="completed"/>
											<effectiveTime>
												<low value="20060501"/>
												<high value="20090227130000+0500"/>
											</effectiveTime>
											<value xsi:type="CD" code="56018004"
												codeSystem="2.16.840.1.113883.6.96"
												displayName="Wheezing"/>
											<entryRelationship typeCode="SUBJ" inversionInd="true">
												<observation classCode="OBS" moodCode="EVN">
												<!-- ** Severity observation ** -->
												<templateId root="2.16.840.1.113883.10.20.22.4.8"/>
												<code code="SEV"
												displayName="Severity Observation"
												codeSystem="2.16.840.1.113883.5.4"
												codeSystemName="ActCode"/>
												<text>
												<reference value="#severity5"/>
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
											<value xsi:type="CD" code="6736007"
												displayName="Moderate"
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
					<entry typeCode="DRIV">
						<act classCode="ACT" moodCode="EVN">
							<!-- ** Allergy problem act ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.30"/>
							<id root="36e3e930-7b14-11db-9fe1-0800200c9a66"/>
							<code code="48765-2" codeSystem="2.16.840.1.113883.6.1"
								codeSystemName="LOINC"
								displayName="Allergies, adverse reactions, alerts"/>
							<statusCode code="active"/>
							<effectiveTime value="20080501"/>
							<entryRelationship typeCode="SUBJ" inversionInd="true">
								<observation classCode="OBS" moodCode="EVN">
									<!-- ** Allergy observation ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.7"/>
									<id root="4adc1020-7b14-11db-9fe1-0800200c9a66"/>
									<code code="ASSERTION" codeSystem="2.16.840.1.113883.5.4"/>
									<statusCode code="completed"/>
									<effectiveTime>
										<low value="20080501"/>
									</effectiveTime>
									<value xsi:type="CD" code="59037007"
										displayName="Drug intolerance"
										codeSystem="2.16.840.1.113883.6.96"
										codeSystemName="SNOMED CT">
										<originalText>
											<reference value="#reaction3"/>
										</originalText>
									</value>
									<participant typeCode="CSM">
										<participantRole classCode="MANU">
											<playingEntity classCode="MMAT">
												<code code="1191" displayName="Aspirin"
												codeSystem="2.16.840.1.113883.6.88"
												codeSystemName="RxNorm">
												<originalText>
												<reference value="#reaction3"/>
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
											<value xsi:type="CE" code="55561003"
												codeSystem="2.16.840.1.113883.6.96"
												displayName="Active"/>
										</observation>
									</entryRelationship>
									<entryRelationship typeCode="MFST" inversionInd="true">
										<observation classCode="OBS" moodCode="EVN">
											<!-- ** Reaction observation ** -->
											<templateId root="2.16.840.1.113883.10.20.22.4.9"/>
											<id root="4adc1020-7b14-11db-9fe1-0800200c9a64"/>
											<code nullFlavor="NA"/>
											<text>
												<reference value="#reaction3"/>
											</text>
											<statusCode code="completed"/>
											<effectiveTime>
												<low value="20080501"/>
												<high value="20090227130000+0500"/>
											</effectiveTime>
											<value xsi:type="CD" code="247472004"
												codeSystem="2.16.840.1.113883.6.96"
												displayName="Hives"/>
											<entryRelationship typeCode="SUBJ" inversionInd="true">
												<observation classCode="OBS" moodCode="EVN">
												<!-- ** Severity observation ** -->
												<templateId root="2.16.840.1.113883.10.20.22.4.8"/>
												<code code="SEV"
												displayName="Severity Observation"
												codeSystem="2.16.840.1.113883.5.4"
												codeSystemName="ActCode"/>
												<text>
												<reference value="#severity6"/>
												</text>
												<statusCode code="completed"/>
												<value xsi:type="CD" code="371923003"
												displayName="Mild to moderate"
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
												<reference value="#severity3"/>
											</text>
											<statusCode code="completed"/>
											<value xsi:type="CD" code="371923003"
												displayName="Mild to moderate"
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
				</section>
</ClinicalDocument>
```