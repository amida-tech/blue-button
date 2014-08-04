#Problems Section

Data model description - [Problems](../problems.md)

##JSON model sample

```javascript
[{
    "date": [{
        "date": "2008-01-03T00:00:00Z",
        "precision": "day"
    }, {
        "date": "2008-01-03T00:00:00Z",
        "precision": "day"
    }],
    "identifiers": [{
        "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
    }],
    "negation_indicator": false,
    "problem": {
        "name": "Pneumonia",
        "code": "233604007",
        "code_system_name": "SNOMED CT"
    },
    "onset_age": "57",
    "onset_age_unit": "Year",
    "status": "Resolved",
    "patient_status": "Alive and well",
    "source_list_identifiers": [{
        "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
    }]
}, {
    "date": [{
        "date": "2007-01-03T00:00:00Z",
        "precision": "day"
    }, {
        "date": "2008-01-03T00:00:00Z",
        "precision": "day"
    }],
    "identifiers": [{
        "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
    }],
    "negation_indicator": true,
    "problem": {
        "name": "Asthma",
        "code": "195967001",
        "code_system_name": "SNOMED CT"
    },
    "onset_age": "57",
    "onset_age_unit": "Year",
    "status": "Active",
    "patient_status": "Alive and well",
    "source_list_identifiers": [{
        "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
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
					<!-- conforms to Problems section with entries optional -->
					<templateId root="2.16.840.1.113883.10.20.22.2.5"/>
					<!-- Problems section with entries required -->
					<templateId root="2.16.840.1.113883.10.20.22.2.5.1"/>
					<code code="11450-4" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
						displayName="PROBLEM LIST"/>
					<title>PROBLEMS</title>
					<text>
						<content ID="problems"/>
						<list listType="ordered">
							<item>
								<content ID="problem1">Pneumonia </content>
								<content ID="stat1">Status: Resolved</content>
							</item>
							<item>
								<content ID="problem2">Asthma</content>
								<content ID="stat2">Status: Active</content>
							</item>
						</list>
					</text>
					<entry typeCode="DRIV">
						<act classCode="ACT" moodCode="EVN">
							<!-- ** Problem concern act ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.3"/>
							<id root="ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"/>
							<code code="CONC" codeSystem="2.16.840.1.113883.5.6"
								displayName="Concern"/>
							<statusCode code="completed"/>
							<effectiveTime>
								<low value="20080103"/>
								<high value="20080103"/>
							</effectiveTime>
							<entryRelationship typeCode="SUBJ">
								<observation classCode="OBS" moodCode="EVN">
									<!-- ** Problem observation ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.4"/>
									<id root="ab1791b0-5c71-11db-b0de-0800200c9a66"/>
									<code code="409586006" codeSystem="2.16.840.1.113883.6.96"
										displayName="Complaint"/>
									<text>
										<reference value="#problem1"/>
									</text>
									<statusCode code="completed"/>
									<effectiveTime>
										<low value="20080103"/>
										<high value="20080103"/>
									</effectiveTime>
									<value xsi:type="CD" code="233604007"
										codeSystem="2.16.840.1.113883.6.96" displayName="Pneumonia"/>
									<entryRelationship typeCode="REFR">
										<observation classCode="OBS" moodCode="EVN">
											<!-- ** Problem status observation ** -->
											<templateId root="2.16.840.1.113883.10.20.22.4.6"/>
											<id root="ab1791b0-5c71-11db-b0de-0800200c9a66"/>
											<code code="33999-4" codeSystem="2.16.840.1.113883.6.1"
												displayName="Status"/>
											<text>
												<reference value="#STAT1"/>
											</text>
											<statusCode code="completed"/>
											<effectiveTime>
												<low value="20080103"/>
												<high value="20090227130000+0500"/>
											</effectiveTime>
											<value xsi:type="CD" code="413322009"
												codeSystem="2.16.840.1.113883.6.96"
												displayName="Resolved"/>
										</observation>
									</entryRelationship>
									<entryRelationship typeCode="SUBJ" inversionInd="true">
										<observation classCode="OBS" moodCode="EVN">
											<!-- Age observation template -->
											<templateId root="2.16.840.1.113883.10.20.22.4.31"/>
											<code code="445518008"
												codeSystem="2.16.840.1.113883.6.96"
												displayName="Age At Onset"/>
											<statusCode code="completed"/>
											<value xsi:type="PQ" value="57" unit="a"/>
										</observation>
									</entryRelationship>
									<entryRelationship typeCode="REFR">
										<observation classCode="OBS" moodCode="EVN">
											<!-- Health status observation template -->
											<templateId root="2.16.840.1.113883.10.20.22.4.5"/>
											<code code="11323-3" codeSystem="2.16.840.1.113883.6.1"
												codeSystemName="LOINC" displayName="Health status"/>
											<text>
												<reference value="#problems"/>
											</text>
											<statusCode code="completed"/>
											<value xsi:type="CD" code="81323004"
												codeSystem="2.16.840.1.113883.6.96"
												codeSystemName="SNOMED CT"
												displayName="Alive and well"/>
										</observation>
									</entryRelationship>
								</observation>
							</entryRelationship>
						</act>
					</entry>
					<entry typeCode="DRIV">
						<act classCode="ACT" moodCode="EVN">
							<!-- Problem concern act ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.3"/>
							<id root="ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"/>
							<code code="CONC" codeSystem="2.16.840.1.113883.5.6"
								displayName="Concern"/>
							<statusCode code="completed"/>
							<effectiveTime>
								<low value="20070103"/>
								<high value="20070103"/>
							</effectiveTime>
							<entryRelationship typeCode="SUBJ">
								<observation classCode="OBS" moodCode="EVN" negationInd="true">
									<!-- ** Problem observation ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.4"/>
									<id root="ab1791b0-5c71-11db-b0de-0800200c9a66"/>
									<code code="409586006" codeSystem="2.16.840.1.113883.6.96"
										displayName="Complaint"/>
									<text>
										<reference value="#problem2"/>
									</text>
									<statusCode code="completed"/>
									<effectiveTime>
										<low value="20070103"/>
										<high value="20080103"/>
									</effectiveTime>
									<value xsi:type="CD" code="195967001"
										codeSystem="2.16.840.1.113883.6.96" displayName="Asthma"/>
									<entryRelationship typeCode="REFR">
										<observation classCode="OBS" moodCode="EVN">
											<!-- ** Problem status observation ** -->
											<templateId root="2.16.840.1.113883.10.20.22.4.6"/>
											<id root="ab1791b0-5c71-11db-b0de-0800200c9a66"/>
											<code code="33999-4" codeSystem="2.16.840.1.113883.6.1"
												displayName="Status"/>
											<text>
												<reference value="#STAT2"/>
											</text>
											<statusCode code="completed"/>
											<effectiveTime>
												<low value="20080103"/>
												<high value="20090227130000+0500"/>
											</effectiveTime>
											<value xsi:type="CD" code="55561003"
												codeSystem="2.16.840.1.113883.6.96"
												displayName="Active"/>
										</observation>
									</entryRelationship>
									<entryRelationship typeCode="SUBJ" inversionInd="true">
										<observation classCode="OBS" moodCode="EVN">
											<!-- ** Age observation ** -->
											<templateId root="2.16.840.1.113883.10.20.22.4.31"/>
											<code code="445518008"
												codeSystem="2.16.840.1.113883.6.96"
												displayName="Age At Onset"/>
											<statusCode code="completed"/>
											<value xsi:type="PQ" value="57" unit="a"/>
										</observation>
									</entryRelationship>
									<entryRelationship typeCode="REFR">
										<observation classCode="OBS" moodCode="EVN">
											<!-- ** Health status observation ** -->
											<templateId root="2.16.840.1.113883.10.20.22.4.5"/>
											<code code="11323-3" codeSystem="2.16.840.1.113883.6.1"
												codeSystemName="LOINC" displayName="Health status"/>
											<text>
												<reference value="#problems"/>
											</text>
											<statusCode code="completed"/>
											<value xsi:type="CD" code="81323004"
												codeSystem="2.16.840.1.113883.6.96"
												codeSystemName="SNOMED CT"
												displayName="Alive and well"/>
										</observation>
									</entryRelationship>
								</observation>
							</entryRelationship>
						</act>
					</entry>
				</section>
</ClinicalDocument>

```