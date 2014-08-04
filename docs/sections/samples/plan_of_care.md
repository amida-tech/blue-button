#Plan of Care Section


## JSON model sample

```javascript
[
    {
        "date_time": {
        	"point": {
                	"date": "2012-05-12T00:00:00Z",
                        "precision": "day"
                }
        },
        "identifiers": [
            {
                "identifier": "9a6d1bac-17d3-4195-89a4-1121bc809b4a"
            }
        ],
        "plan": {
        	"name": "Colonoscopy",
        	"code": "73761001",
        	"codeSystemName": "SNOMED CT"
        },
        "type": "observation"
    },
    {
        "date_time": {
        	"point": {
                	"date": "2012-05-12T00:00:00Z",
                        "precision": "day"
                }
        },
        "identifiers": [
            {
                "identifier": "9a6d1bac-17d3-4195-89c4-1121bc809b5a"
            }
        ],
        "plan": {
        	"name": "Colonoscopy",
        	"code": "73761001",
        	"codeSystemName": "SNOMED CT"
        },
        "type": "act"
    },
    {
        "date_time": {
        	"point": {
                	"date": "2012-05-12T00:00:00Z",
                        "precision": "day"
                }
        },
        "identifiers": [
            {
                "identifier": "9a6d1bac-17d3-4195-89a4-1121bc809b4a"
            }
        ],
        "plan": {
        	"name": "Colonoscopy",
        	"code": "73761001",
        	"codeSystemName": "SNOMED CT"
        },
        "type": "encounter"
    },
    {
        "date_time": {
        	"point": {
                	"date": "2012-05-12T00:00:00Z",
                        "precision": "day"
                }
        },
        "identifiers": [
            {
                "identifier": "9a6d1bac-17d3-4195-89a4-1121bc809b4a"
            }
        ],
        "plan": {
        	"name": "Colonoscopy",
        	"code": "73761001",
        	"codeSystemName": "SNOMED CT"
        },
        "type": "procedure"
    }
]
```

## Original CCDA snippet

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
 
<!-- Title: US_Realm_Header_Template -->
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3"
	xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
	<section>
	  <!-- Plan of care section -->
		<templateId root="2.16.840.1.113883.10.20.22.2.10"/>
		<code code="18776-5" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
			displayName="Treatment plan"/>
		<title>PLAN OF CARE</title>
		<text>
			<table border="1" width="100%">
				<thead>
					<tr>
						<th>Planned Activity</th>
						<th>Planned Date</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Colonoscopy</td>
						<td>20120512</td>
					</tr>
				</tbody>
			</table>
		</text>
		<!-- Examples of the same planned activity are shown in different plan of care entries -->
		<entry typeCode="DRIV">
			<observation classCode="OBS" moodCode="RQO">
				<!-- ** Plan of care activity observation ** -->
				<templateId root="2.16.840.1.113883.10.20.22.4.44"/>
				<id root="9a6d1bac-17d3-4195-89a4-1121bc809b4a"/>
				<code code="73761001" codeSystem="2.16.840.1.113883.6.96"
					codeSystemName="SNOMED CT" displayName="Colonoscopy"/>
				<statusCode code="new"/>
				<effectiveTime>
					<center value="20120512"/>
				</effectiveTime>
			</observation>
		</entry>
		<entry>
			<act moodCode="RQO" classCode="ACT">
				<!-- ** Plan of care activity act ** -->
				<templateId root="2.16.840.1.113883.10.20.22.4.39"/>
				<id root="9a6d1bac-17d3-4195-89a4-1121bc809a5c"/>
				<code code="73761001" codeSystem="2.16.840.1.113883.6.96"
					codeSystemName="SNOMED CT" displayName="Colonoscopy"/>
				<statusCode code="new"/>
				<effectiveTime>
					<center value="20120512"/>
				</effectiveTime>
			</act>
		</entry>
		<entry>
			<encounter moodCode="INT" classCode="ENC">
				<!-- ** Plan of care activity encounter ** -->
				<templateId root="2.16.840.1.113883.10.20.22.4.40"/>
				<id root="9a6d1bac-17d3-4195-89a4-1121bc809b4d"/>
				<code code="73761001" codeSystem="2.16.840.1.113883.6.96"
					codeSystemName="SNOMED CT" displayName="Colonoscopy"/>
				<statusCode code="new"/>
				<effectiveTime>
					<center value="20120512"/>
				</effectiveTime>
			</encounter>
		</entry>
		<entry>
			<procedure moodCode="RQO" classCode="PROC">
				<!-- ** Plan of care activity procedure ** -->
				<templateId root="2.16.840.1.113883.10.20.22.4.41"/>
				<id root="9a6d1bac-17d3-4195-89c4-1121bc809b5a"/>
				<code code="73761001" codeSystem="2.16.840.1.113883.6.96"
					codeSystemName="SNOMED CT" displayName="Colonoscopy"/>
				<statusCode code="new"/>
				<effectiveTime>
					<center value="20120512"/>
				</effectiveTime>
			</procedure>
		</entry>
	</section>
</ClinicalDocument>
```
