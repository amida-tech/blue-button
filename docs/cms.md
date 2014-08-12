

# CMS Parser for Blue Button


##Design Decisions Documentation 


**Object Transformation:**
CMS text file --> Intermediate JavaScript Object --> BlueButton Object 

**Data direction**

cmsToIntermediateObj(currently cmsParser) --> intermediatetoObjConverter


**cmsTOIntermediateObj**

1. Minimum number of dashes to separate section is four dashes.
2. Minimum number of newline characters to qualify as a space is 2-3 new lines, depending on where it is in the file.
It is usually three unless the child is at the end of the file.
3. Needed very specific matching patterns for metadata and claims summary, which turned out to be very unique. 
Other sections are parsed with a generic parsing function.
4. For each section body, if a child has multiple keys with the exact same string, then the parser will start 
assigning them numbers. 
5. Converting all keys to lower case because it's easier to transcribe in the next stage.

**intermediatetoObjConverter**

1. Values that are in the intermediate CMS object but are not in the Blue Button model are omitted.
2. Values that are in the Blue Button model but are not defined in the CMS object is also omitted. 


## Current Sections 


###Sections that have no data model

BB.js model needs(Bolded are those that are not addressed in the main branch of Blue Button Github site)
Unbolded ones are currently unimplemented but mentioned in bluebutton.

+ **Emergency contacts, kind of pertains to advance directives.**
+ Implantable Devices -> Medical Equipment
+ Family History
+ Pharmacies

### Sections that have a data model, and are parsed
* Demographic -> Demographics
* Self-Reported Medical conditions -> Problems
* Self-Reported Allergies ->Allergies(done)
* Self-Reported Immunizations -> Immunizations
* Self-Reported Labs and Tests -> Results(Done, need more samples to be better)
* Self-Reported Vital Statistics -> Vitals
* Drugs -> Medications
* Providers -> Providers
* Plans -> Insurance
* Employer Subsidy ->Insurance
* Primary Insurance -> Insurance
* Other Insurance -> Insurance
* Claim Summary -> Claims
* Medical Plans -> Plan of Care

##More Issues with Sections

* When there is no 1 to 1 correspondence between sections. For example, in self-reported allergies, 
there are also medications stuff involved. Need to do a better job in detecting that kind of anamaly. 




##CMS Parser Variable Terminology




Section is the entire chunk of data that includes the header and body.

Header is:

-------------------------------

Insert Section Name <--- header

-------------------------------


key: value 

key: value 

key: value               <------ This is one child 

key: value 

key: value 

key: value 
            	<-------------------------------------------- this entire piece is referred to as the body


key: value 

key: value 

key: value              <------ This is another child

key: value 

key: value 





-------------------------------- <--- dash usually indicates end of section and file

###Task Backlog/Improvements


1. Write tests(Partially done)
..+1.a. Check what elements/sections are in CMS.
..+1.b. Check what matches and what doesn't match.
..+1.c. Check what are missing.

2. Improve code flexibility
	4.a. abstract out matching from code.
		1. separate class for regular expressions.
		2. Detect the format of the text file(UTF-8, ascii), and make it be able to handle different text structures.

3. Putting proper codes for each medical term. May need to put uncoded tag. (
	Look at medical dictionaries/clinical vocabularies at bottom of CCDA pad)

4. Need to dump data that is not part of one section into a common pool, or organize it. 
..* the effective dates for in "demographic" section needs to go somewhere else -> in the health insurance model? 
..* Allergy shots, and other medications need to go to another section

5. Might need an extrapolation layer on top of what is currently here. For example, in the allergy section, it indicated that the patient took shots. From this, maybe the parser should extrapolate the administration part of medications. May tie in with #13.

6. Medications rate detector needs to be written.(for example 3x boxes of 30 needles for 3 months, which can get tricky)

7. Vitals value detection may need modifications based on more text sample files. 

8. Discussion is needed on how to handle medicare claim type Ds, since it can get pretty confusing.

9. Better address parsing mechanism. The current one seems tobe decent, but not perfect.









