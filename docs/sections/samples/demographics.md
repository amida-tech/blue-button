#Demographics Section

Data model description - [Demographics](../demographics.md)

##JSON model sample

```javascript
{
        "name": {
            "middle": [
                "Isa"
            ],
            "last": "Jones",
            "first": "Isabella"
        },
        "dob": [
            {
                "date": "1975-05-01T00:00:00Z",
                "precision": "day"
            }
        ],
        "gender": "Female",
        "identifiers": [
            {
                "identifier": "2.16.840.1.113883.19.5.99999.2",
                "identifier_type": "998991"
            },
            {
                "identifier": "2.16.840.1.113883.4.1",
                "identifier_type": "111-00-2330"
            }
        ],
        "marital_status": "Married",
        "addresses": [
            {
                "streetLines": [
                    "1357 Amber Drive"
                ],
                "city": "Beaverton",
                "state": "OR",
                "zip": "97867",
                "country": "US",
                "use": "primary home"
            }
        ],
        "phone": [
            {
                "number": "(816)276-6909",
                "type": "primary home"
            }
        ],
        "race_ethnicity": "White",
        "languages": [
            {
                "language": "en",
                "preferred": true,
                "mode": "Expressed spoken",
                "proficiency": "Good"
            }
        ],
        "religion": "Christian (non-Catholic, non-specific)",
        "birthplace": {
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US"
        },
        "guardians": [
            {
                "relation": "Parent",
                "addresses": [
                    {
                        "streetLines": [
                            "1357 Amber Drive"
                        ],
                        "city": "Beaverton",
                        "state": "OR",
                        "zip": "97867",
                        "country": "US",
                        "use": "primary home"
                    }
                ],
                "names": [
                    {
                        "last": "Jones",
                        "first": "Ralph"
                    }
                ],
                "phone": [
                    {
                        "number": "(816)276-6909",
                        "type": "primary home"
                    }
                ]
            }
        ]
    }
```

##Original CCDA snippet

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?xml-stylesheet type="text/xsl" href="CDA.xsl"?>
 
<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:hl7-org:v3"
    xmlns:cda="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc">
	<id extension="998991" root="2.16.840.1.113883.19.5.99999.2"/>
	<!-- Fake ID using HL7 example OID. -->
	<id extension="111-00-2330" root="2.16.840.1.113883.4.1"/>
	<!-- Fake Social Security Number using the actual SSN OID. -->
	<addr use="HP">
		<!-- HP is "primary home" from codeSystem 2.16.840.1.113883.5.1119 -->
		<streetAddressLine>1357 Amber Drive</streetAddressLine>
		<city>Beaverton</city>
		<state>OR</state>
		<postalCode>97867</postalCode>
		<country>US</country>
		<!-- US is "United States" from ISO 3166-1 Country Codes: 1.0.3166.1 -->
	</addr>
	<telecom value="tel:(816)276-6909" use="HP"/>
	<!-- HP is "primary home" from HL7 AddressUse 2.16.840.1.113883.5.1119 -->
	<patient>
		<name use="L">
			<!-- L is "Legal" from HL7 EntityNameUse 2.16.840.1.113883.5.45 -->
			<given>Isabella</given>
			<given>Isa</given>
			<!-- CL is "Call me" from HL7 EntityNamePartQualifier 2.16.840.1.113883.5.43 -->
			<family>Jones</family>
		</name>
		<administrativeGenderCode code="F" codeSystem="2.16.840.1.113883.5.1"
			displayName="Female"/>
		<birthTime value="19750501"/>
		<maritalStatusCode code="M" displayName="Married" codeSystem="2.16.840.1.113883.5.2"
			codeSystemName="MaritalStatusCode"/>
		<religiousAffiliationCode code="1013"
			displayName="Christian (non-Catholic, non-specific)"
			codeSystemName="HL7 Religious Affiliation" codeSystem="2.16.840.1.113883.5.1076"/>
		<!-- CDC Race and Ethnicity code set contains the minimum race and ethnicity categories defined by OMB Standards for Race and Ethnicity -->
		<raceCode code="2106-3" displayName="White" codeSystem="2.16.840.1.113883.6.238"
			codeSystemName="Race &amp; Ethnicity - CDC"/>
		<ethnicGroupCode code="2186-5" displayName="Not Hispanic or Latino"
			codeSystem="2.16.840.1.113883.6.238" codeSystemName="Race &amp; Ethnicity - CDC"/>
		<guardian>
			<code code="PRN" displayName="Parent" codeSystem="2.16.840.1.113883.5.111"
				codeSystemName="HL7 Role code"/>
			<addr use="HP">
				<!-- HP is "primary home" from codeSystem 2.16.840.1.113883.5.1119 -->
				<streetAddressLine>1357 Amber Drive</streetAddressLine>
				<city>Beaverton</city>
				<state>OR</state>
				<postalCode>97867</postalCode>
				<country>US</country>
				<!-- US is "United States" from ISO 3166-1 Country Codes: 1.0.3166.1 -->
			</addr>
			<telecom value="tel:(816)276-6909" use="HP"/>
			<guardianPerson>
				<name>
					<given>Ralph</given>
					<family>Jones</family>
				</name>
			</guardianPerson>
		</guardian>
		<birthplace>
			<place>
				<addr>
					<city>Beaverton</city>
					<state>OR</state>
					<postalCode>97867</postalCode>
					<country>US</country>
				</addr>
			</place>
		</birthplace>
		<languageCommunication>
			<languageCode code="en"/>
			<!-- EN is "English" as in the IG -->
			<modeCode code="ESP" displayName="Expressed spoken"
				codeSystem="2.16.840.1.113883.5.60" codeSystemName="LanguageAbilityMode"/>
			<proficiencyLevelCode code="G" displayName="Good"
				codeSystem="2.16.840.1.113883.5.61"
				codeSystemName="LanguageAbilityProficiency"/>
			<preferenceInd value="true"/>
		</languageCommunication>
	</patient>
	<providerOrganization>
		<id root="2.16.840.1.113883.4.6"/>
		<name>Community Health and Hospitals</name>
		<telecom use="WP" value="tel: 555-555-5000"/>
		<addr>
			<streetAddressLine>1001 Village Avenue</streetAddressLine>
			<city>Portland</city>
			<state>OR</state>
			<postalCode>99123</postalCode>
			<country>US</country>
		</addr>
	</providerOrganization>
</ClinicalDocument>



```