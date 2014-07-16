#Vital Signs Section

Data model description - [Vital Signs](../vitals.md)

##JSON model sample

```javascript
[{
    "identifiers": [{
        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
    }],
    "vital": {
        "name": "Height",
        "code": "8302-2",
        "code_system_name": "LOINC"
    },
    "status": "completed",
    "date": [{
        "date": "1999-11-14T00:00:00Z",
        "precision": "day"
    }],
    "interpretations": [
        "Normal"
    ],
    "value": 177,
    "unit": "cm"
}, {
    "identifiers": [{
        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
    }],
    "vital": {
        "name": "Patient Body Weight - Measured",
        "code": "3141-9",
        "code_system_name": "LOINC"
    },
    "status": "completed",
    "date": [{
        "date": "1999-11-14T00:00:00Z",
        "precision": "day"
    }],
    "interpretations": [
        "Normal"
    ],
    "value": 86,
    "unit": "kg"
}, {
    "identifiers": [{
        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
    }],
    "vital": {
        "name": "Intravascular Systolic",
        "code": "8480-6",
        "code_system_name": "LOINC"
    },
    "status": "completed",
    "date": [{
        "date": "1999-11-14T00:00:00Z",
        "precision": "day"
    }],
    "interpretations": [
        "Normal"
    ],
    "value": 132,
    "unit": "mm[Hg]"
}, {
    "identifiers": [{
        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
    }],
    "vital": {
        "name": "Height",
        "code": "8302-2",
        "code_system_name": "LOINC"
    },
    "status": "completed",
    "date": [{
        "date": "2000-04-07T00:00:00Z",
        "precision": "day"
    }],
    "interpretations": [
        "Normal"
    ],
    "value": 177,
    "unit": "cm"
}, {
    "identifiers": [{
        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
    }],
    "vital": {
        "name": "Patient Body Weight - Measured",
        "code": "3141-9",
        "code_system_name": "LOINC"
    },
    "status": "completed",
    "date": [{
        "date": "2000-04-07T00:00:00Z",
        "precision": "day"
    }],
    "interpretations": [
        "Normal"
    ],
    "value": 88,
    "unit": "kg"
}, {
    "identifiers": [{
        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
    }],
    "vital": {
        "name": "Intravascular Systolic",
        "code": "8480-6",
        "code_system_name": "LOINC"
    },
    "status": "completed",
    "date": [{
        "date": "2000-04-07T00:00:00Z",
        "precision": "day"
    }],
    "interpretations": [
        "Normal"
    ],
    "value": 145,
    "unit": "mm[Hg]"
}]
```

##Original CCDA snippet

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
 
<!-- Title: US_Realm_Header_Template -->
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3"
    xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
	<section>
		<!-- conforms to Vital Signs section with entries optional -->
		<templateId root="2.16.840.1.113883.10.20.22.2.4"/>
		<!-- Vital Signs section with entries required -->
		<templateId root="2.16.840.1.113883.10.20.22.2.4.1"/>
		<code code="8716-3" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
			displayName="VITAL SIGNS"/>
		<title>VITAL SIGNS</title>
		<text>
			<table border="1" width="100%">
				<thead>
					<tr>
						<th align="right">Date / Time: </th>
						<th>Nov 14, 1999</th>
						<th>April 7, 2000</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th align="left">Height</th>
						<td>
							<content ID="vit1">177 cm</content>
						</td>
						<td>
							<content ID="vit2">177 cm</content>
						</td>
					</tr>
					<tr>
						<th align="left">Weight</th>
						<td>
							<content ID="vit3">86 kg</content>
						</td>
						<td>
							<content ID="vit4">88 kg</content>
						</td>
					</tr>
					<tr>
						<th align="left">Blood Pressure</th>
						<td>
							<content ID="vit5">132/86 mmHg</content>
						</td>
						<td>
							<content ID="vit6">145/88 mmHg</content>
						</td>
					</tr>
				</tbody>
			</table>
		</text>
		<entry typeCode="DRIV">
			<organizer classCode="CLUSTER" moodCode="EVN">
				<!-- ** Vital signs organizer ** -->
				<templateId root="2.16.840.1.113883.10.20.22.4.26"/>
				<id root="c6f88320-67ad-11db-bd13-0800200c9a66"/>
				<code code="46680005" codeSystem="2.16.840.1.113883.6.96"
					codeSystemName="SNOMED CT" displayName="Vital signs"/>
				<statusCode code="completed"/>
				<effectiveTime value="19991114"/>
				<component>
					<observation classCode="OBS" moodCode="EVN">
						<!-- ** Vital sign observation ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.27"/>
						<id root="c6f88321-67ad-11db-bd13-0800200c9a66"/>
						<code code="8302-2" codeSystem="2.16.840.1.113883.6.1"
							codeSystemName="LOINC" displayName="Height"/>
						<text>
							<reference value="#vit1"/>
						</text>
						<statusCode code="completed"/>
						<effectiveTime value="19991114"/>
						<value xsi:type="PQ" value="177" unit="cm"/>
						<interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"
						/>
					</observation>
				</component>
				<component>
					<observation classCode="OBS" moodCode="EVN">
						<!-- ** Vital sign observation ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.27"/>
						<id root="c6f88321-67ad-11db-bd13-0800200c9a66"/>
						<code code="3141-9" codeSystem="2.16.840.1.113883.6.1"
							codeSystemName="LOINC"
							displayName="Patient Body Weight - Measured"/>
						<text>
							<reference value="#vit3"/>
						</text>
						<statusCode code="completed"/>
						<effectiveTime value="19991114"/>
						<value xsi:type="PQ" value="86" unit="kg"/>
						<interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"
						/>
					</observation>
				</component>
				<component>
					<observation classCode="OBS" moodCode="EVN">
						<!-- ** Vital sign observation ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.27"/>
						<id root="c6f88321-67ad-11db-bd13-0800200c9a66"/>
						<code code="8480-6" codeSystem="2.16.840.1.113883.6.1"
							codeSystemName="LOINC" displayName="Intravascular Systolic"/>
						<text>
							<reference value="#vit5"/>
						</text>
						<statusCode code="completed"/>
						<effectiveTime value="19991114"/>
						<value xsi:type="PQ" value="132" unit="mm[Hg]"/>
						<interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"
						/>
					</observation>
				</component>
			</organizer>
		</entry>
		<entry typeCode="DRIV">
			<organizer classCode="CLUSTER" moodCode="EVN">
				<!-- ** Vital signs organizer ** -->
				<templateId root="2.16.840.1.113883.10.20.22.4.26"/>
				<id root="c6f88320-67ad-11db-bd13-0800200c9a66"/>
				<code code="46680005" codeSystem="2.16.840.1.113883.6.96"
					codeSystemName="SNOMED CT" displayName="Vital signs"/>
				<statusCode code="completed"/>
				<effectiveTime value="20000407"/>
				<component>
					<observation classCode="OBS" moodCode="EVN">
						<!-- ** Vital sign observation ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.27"/>
						<id root="c6f88321-67ad-11db-bd13-0800200c9a66"/>
						<code code="8302-2" codeSystem="2.16.840.1.113883.6.1"
							codeSystemName="LOINC" displayName="Height"/>
						<text>
							<reference value="#vit2"/>
						</text>
						<statusCode code="completed"/>
						<effectiveTime value="20000407"/>
						<value xsi:type="PQ" value="177" unit="cm"/>
						<interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"
						/>
					</observation>
				</component>
				<component>
					<observation classCode="OBS" moodCode="EVN">
						<!-- ** Vital sign observation ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.27"/>
						<id root="c6f88321-67ad-11db-bd13-0800200c9a66"/>
						<code code="3141-9" codeSystem="2.16.840.1.113883.6.1"
							codeSystemName="LOINC"
							displayName="Patient Body Weight - Measured"/>
						<text>
							<reference value="#vit4"/>
						</text>
						<statusCode code="completed"/>
						<effectiveTime value="20000407"/>
						<value xsi:type="PQ" value="88" unit="kg"/>
						<interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"
						/>
					</observation>
				</component>
				<component>
					<observation classCode="OBS" moodCode="EVN">
						<!-- ** Vital sign observation ** -->
						<templateId root="2.16.840.1.113883.10.20.22.4.27"/>
						<id root="c6f88321-67ad-11db-bd13-0800200c9a66"/>
						<code code="8480-6" codeSystem="2.16.840.1.113883.6.1"
							codeSystemName="LOINC" displayName="Intravascular Systolic"/>
						<text>
							<reference value="#vit6"/>
						</text>
						<statusCode code="completed"/>
						<effectiveTime value="20000407"/>
						<value xsi:type="PQ" value="145" unit="mm[Hg]"/>
						<interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"
						/>
					</observation>
				</component>
			</organizer>
		</entry>
	</section>
</ClinicalDocument>

```