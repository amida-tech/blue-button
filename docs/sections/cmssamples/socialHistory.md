#Social History Section

Data model description - [Social History](../socialHistory.md)

##JSON model sample

```javascript
{
    "smoking_statuses": [{
        "value": "Former smoker",
        "date": [{
            "date": "2005-05-01T00:00:00Z",
            "precision": "day"
        }, {
            "date": "2009-02-27T13:00:00Z",
            "precision": "subsecond"
        }]
    }]
}

```

##Original CCDA snippet

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
 
<!-- Title: US_Realm_Header_Template -->
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3"
	xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
				<section>
					<!-- Social history section -->
					<templateId root="2.16.840.1.113883.10.20.22.2.17"/>
					<code code="29762-2" codeSystem="2.16.840.1.113883.6.1"
						displayName="Social History"/>
					<title>SOCIAL HISTORY</title>
					<text>
						<table border="1" width="100%">
							<thead>
								<tr>
									<th>Social History Element</th>
									<th>Description</th>
									<th>Effective Dates</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<content ID="soc1"/> smoking </td>
									<td>1 pack per day</td>
									<td>20050501 to 20090227130000+0500</td>
								</tr>
								<tr>
									<td>
										<content ID="soc2"/> smoking </td>
									<td>None</td>
									<td>20090227130000+0500 - today</td>
								</tr>
								<tr>
									<td>
										<content ID="soc3"/> Alcohol consumption </td>
									<td>None</td>
									<td>20050501 - </td>
								</tr>
							</tbody>
						</table>
					</text>
					<entry typeCode="DRIV">
						<observation classCode="OBS" moodCode="EVN">
							<!-- ** Smoking status observation ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.78"/>
							<id extension="123456789" root="2.16.840.1.113883.19"/>
							<code code="ASSERTION" codeSystem="2.16.840.1.113883.5.4"/>
							<statusCode code="completed"/>
							<effectiveTime>
								<low value="20050501"/>
								<high value="20090227130000+0500"/>
							</effectiveTime>
							<value xsi:type="CD" code="8517006" displayName="Former smoker"
								codeSystem="2.16.840.1.113883.6.96"/>
						</observation>
					</entry>
					<entry typeCode="DRIV">
						<observation classCode="OBS" moodCode="EVN">
							<!-- ** Social history observation ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.38"/>
							<id root="9b56c25d-9104-45ee-9fa4-e0f3afaa01c1"/>
							<code code="229819007" codeSystem="2.16.840.1.113883.6.96"
								displayName="Tobacco use and exposure">
								<originalText>
									<reference value="#soc1"/>
								</originalText>
							</code>
							<statusCode code="completed"/>
							<effectiveTime>
								<low value="20050501"/>
								<high value="20090227130000+0500"/>
							</effectiveTime>
							<value xsi:type="ST">1 pack per day</value>
						</observation>
					</entry>
					<entry typeCode="DRIV">
						<observation classCode="OBS" moodCode="EVN">
							<!-- ** Social history observation ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.38"/>
							<id root="45efb604-7049-4a2e-ad33-d38556c9636c"/>
							<code code="229819007" codeSystem="2.16.840.1.113883.6.96"
								displayName="Tobacco use and exposure">
								<originalText>
									<reference value="#soc2"/>
								</originalText>
							</code>
							<statusCode code="completed"/>
							<effectiveTime>
								<low value="20090227130000+0500"/>
							</effectiveTime>
							<value xsi:type="ST">None</value>
						</observation>
					</entry>
					<entry typeCode="DRIV">
						<observation classCode="OBS" moodCode="EVN">
							<!-- ** Social history observation ** -->
							<templateId root="2.16.840.1.113883.10.20.22.4.38"/>
							<id root="37f76c51-6411-4e1d-8a37-957fd49d2cef"/>
							<code code="160573003" codeSystem="2.16.840.1.113883.6.96"
								displayName="Alcohol consumption">
								<originalText>
									<reference value="#soc3"/>
								</originalText>
							</code>
							<statusCode code="completed"/>
							<effectiveTime>
								<low value="20050501"/>
							</effectiveTime>
							<value xsi:type="ST">None</value>
						</observation>
					</entry>
				</section>
</ClinicalDocument>

```