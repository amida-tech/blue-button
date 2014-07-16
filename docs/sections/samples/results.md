#Results Section

Data model description - [Results](../results.md)

##JSON model sample

```javascript
[{
    "identifiers": [{
        "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
    }],
    "result_set": {
        "name": "CBC WO DIFFERENTIAL",
        "code": "43789009",
        "code_system_name": "SNOMED CT"
    },
    "results": [{
        "identifiers": [{
            "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
        }],
        "result": {
            "name": "HGB",
            "code": "30313-1",
            "code_system_name": "LOINC"
        },
        "date": [{
            "date": "2000-03-23T14:30:00Z",
            "precision": "minute"
        }],
        "interpretations": [
            "Normal"
        ],
        "value": 13.2,
        "unit": "g/dl"
    }, {
        "identifiers": [{
            "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
        }],
        "result": {
            "name": "WBC",
            "code": "33765-9",
            "code_system_name": "LOINC"
        },
        "date": [{
            "date": "2000-03-23T14:30:00Z",
            "precision": "minute"
        }],
        "interpretations": [
            "Normal"
        ],
        "value": 6.7,
        "unit": "10+3/ul"
    }, {
        "identifiers": [{
            "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
        }],
        "result": {
            "name": "PLT",
            "code": "26515-7",
            "code_system_name": "LOINC"
        },
        "date": [{
            "date": "2000-03-23T14:30:00Z",
            "precision": "minute"
        }],
        "interpretations": [
            "Low"
        ],
        "value": 123,
        "unit": "10+3/ul"
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
					<!-- conforms to Results section with entries optional -->
					<templateId root="2.16.840.1.113883.10.20.22.2.3"/>
					<!-- Results section with entries required -->
					<templateId root="2.16.840.1.113883.10.20.22.2.3.1"/>
					<code code="30954-2" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
						displayName="RESULTS"/>
					<title>RESULTS</title>
					<text>
						<table>
							<tbody>
								<tr>
									<td colspan="2">LABORATORY INFORMATION</td>
								</tr>
								<tr>
									<td colspan="2">Chemistries and drug levels</td>
								</tr>
								<tr>
									<td>
										<content ID="result1">HGB (M 13-18 g/dl; F 12-16
											g/dl)</content>
									</td>
									<td>13.2</td>
								</tr>
								<tr>
									<td>
										<content ID="result2">WBC (4.3-10.8 10+3/ul)</content>
									</td>
									<td>6.7</td>
								</tr>
								<tr>
									<td>
										<content ID="result3">PLT (135-145 meq/l)</content>
									</td>
									<td>123 (L)</td>
								</tr>
								<tr>
									<td colspan="2">Liver Functions and Other Laboratory Values</td>
								</tr>
								<tr>
									<td>ALT (SGPT)</td>
									<td>31.0</td>
								</tr>
								<tr>
									<td>AST (SGOT)</td>
									<td>18.0</td>
								</tr>
								<tr>
									<td>GGT</td>
									<td>28.0 Alk</td>
								</tr>
								<tr>
									<td>Phos</td>
									<td>86.0</td>
								</tr>
								<tr>
									<td>Total Bili</td>
									<td>0.1</td>
								</tr>
								<tr>
									<td>Albumin</td>
									<td>3.2</td>
								</tr>
								<tr>
									<td colspan="2">Blood Count</td>
								</tr>
								<tr>
									<td>White Count</td>
									<td>7.7</td>
								</tr>
								<tr>
									<td>Platelets</td>
									<td>187.0</td>
								</tr>
								<tr>
									<td>Hematocrit</td>
									<td>23.7</td>
								</tr>
								<tr>
									<td>Hemoglobin</td>
									<td>8.1</td>
								</tr>
								<tr>
									<td colspan="2">ELECTROCARDIOGRAM (EKG) INFORMATION</td>
								</tr>
								<tr>
									<td>EKG</td>
									<td>Sinus rhythm without acute changes</td>
								</tr>
							</tbody>
						</table>
					</text>
					<entry typeCode="DRIV">
						<organizer classCode="BATTERY" moodCode="EVN">
							<!-- ** Result organizer ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.1"/>
							<id root="7d5a02b0-67a4-11db-bd13-0800200c9a66"/>
							<code code="43789009" displayName="CBC WO DIFFERENTIAL"
								codeSystem="2.16.840.1.113883.6.96" codeSystemName="SNOMED CT"/>
							<statusCode code="completed"/>
							<component>
								<observation classCode="OBS" moodCode="EVN">
									<!-- ** Result observation ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.2"/>
									<id root="107c2dc0-67a5-11db-bd13-0800200c9a66"/>
									<code code="30313-1" displayName="HGB"
										codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"/>
									<text>
										<reference value="#result1"/>
									</text>
									<statusCode code="completed"/>
									<effectiveTime value="200003231430"/>
									<value xsi:type="PQ" value="13.2" unit="g/dl"/>
									<interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"/>
									<referenceRange>
										<observationRange>
											<text>M 13-18 g/dl; F 12-16 g/dl</text>
										</observationRange>
									</referenceRange>
								</observation>
							</component>
							<component>
								<observation classCode="OBS" moodCode="EVN">
									<!-- ** Result observation ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.2"/>
									<id root="107c2dc0-67a5-11db-bd13-0800200c9a66"/>
									<code code="33765-9" displayName="WBC"
										codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"/>
									<text>
										<reference value="#result2"/>
									</text>
									<statusCode code="completed"/>
									<effectiveTime value="200003231430"/>
									<value xsi:type="PQ" value="6.7" unit="10+3/ul"/>
									<interpretationCode code="N" codeSystem="2.16.840.1.113883.5.83"/>
									<referenceRange>
										<observationRange>
											<value xsi:type="IVL_PQ">
												<low value="4.3" unit="10+3/ul"/>
												<high value="10.8" unit="10+3/ul"/>
											</value>
										</observationRange>
									</referenceRange>
								</observation>
							</component>
							<component>
								<observation classCode="OBS" moodCode="EVN">
									<!-- ** Result observation ** -->
									<templateId root="2.16.840.1.113883.10.20.22.4.2"/>
									<id root="107c2dc0-67a5-11db-bd13-0800200c9a66"/>
									<code code="26515-7" displayName="PLT"
										codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"/>
									<text>
										<reference value="#result3"/>
									</text>
									<statusCode code="completed"/>
									<effectiveTime value="200003231430"/>
									<value xsi:type="PQ" value="123" unit="10+3/ul"/>
									<interpretationCode code="L" codeSystem="2.16.840.1.113883.5.83"/>
									<referenceRange>
										<observationRange>
											<value xsi:type="IVL_PQ">
												<low value="150" unit="10+3/ul"/>
												<high value="350" unit="10+3/ul"/>
											</value>
										</observationRange>
									</referenceRange>
								</observation>
							</component>
						</organizer>
					</entry>
				</section>
</ClinicalDocument>

```