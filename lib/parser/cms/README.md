

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
Unbolded ones are currently unimplemented but maybe mentioned in bluebutton.


+ **Emergency contacts, kind of pertains to advance directives.**
+ Implantable Devices -> Medical Equipment
+ Family History
+ Preventive Services(future Appointments) -> Plan of Care?
+ Providers -> Payer?
+ Pharmacies
+ Medical Plans -> Plan of Care>
+ **Subsidies**
+ Primary and other Insurances -> Payer
+ **Claim Summary**

### Sectiont that have a data model
* Demographic -> Demographic(1)
* Self-Reported Medical conditions -> Problems(2)
* Self-Reported Allergies ->Allergies
* Self-Reported Immunizations -> Immunizations
* Self-Reported Labs and Tests -> Results
* Self-Reported Vital Statistics -> Vitals
* Drugs -> Medications


##CMS Parser Variable Terminology




Section is the entire chunk of data that includes the header and body.

Header is:

-------------------------------

Insert Section Name <--- header

-------------------------------


key: value 

key: value 

key: value   <------ This is one child 

key: value 

key: value 

key: value 
            <-------------------------------------------- this entire piece is referred to as the body
key: value 

key: value 

key: value <------ This is another child

key: value 

key: value 





-------------------------------- <--- dash usually indicates end of section and file

##Testing Plan



###Testing backlog


1. Test Unicode and ASCII, in addition to other text formats(if there are any)-> detection of ascii
2. Test when there are is no source -> need to indicate that there are no sources? Or should add something to indicate no sources?
3. Test if parser can tell which sections are missing -> more like an implementation

###Tests that must be passed for all files

1. Check that there are no blank keys or values.(Done)
2. Object must exist and have type object.(Done)
3. Object must have the number of titles specified in the original test file.(Done)
4. There should be no empty keys in ANY object model.(Done)

###Text file specific test cases

1. Test Empty sections(Done)
2. Test if parser is functional with missing sections(Done)
3. Test empty file(Done)
4. Test source, but no section(Done)
5. Test different number of dashes(Done)
6. Test the file when there is only one section(Done)
7. Test when there is two sections, one from the very beginning and one from the very end.(Done)
8. Test when there is only meta data(Done)



###Task Backlog 


1. Write tests(Partially done)
..+1.a. Check what elements/sections are in CMS.
..+1.b. Check what matches and what doesn't match.
..+1.c. Check what are missing.

2. Document intermediate model. Document which sections match and doesn't match. 


3. Work on parsing from the intermediate model to the actual bb model.
	Start with demographics.

4. Improve code flexibility
	4.a. abstract out matching from code.
		1. separate class for regular expressions.
		2. Detect the format of the text file(UTF-8, ascii), and make it be able to handle different text structures.


5. Putting proper codes for each medical term. May need to put uncoded tag. (
	Look at medical dictionaries/clinical vocabularies at bottom of CCDA pad)

6. Put a tag or some indicator to mark that the source is the CMS text file, or put an object with a key metadata. 

7. Need to make sure that you don't have blank keys(Additional check). 

8. Deal with case sensitivity of keys to object in intermediate object to blue button converter, and everywhere else.

9. writeValue in intermediate object to blue button converter will have to return an object eventually.(done)

10. Need to dump data that is not part of one section into a common pool, or organize it. I.e. the effective dates for in "demographic"
section needs to go somewhere else -> in the health insurance model. 

11. Need to make sure that object types are very consistent with the model given in bb, probably will need to write tests to make sure
the returned object model is the same as the model that has been parsed.

12. Demographics needs to be able to handle single key value pairs just in case.

13. Need to write the code system functionality to the parser.

##Integration Notes

First, add a line that says: 
In /lib/parser.js,

1. add
	require('(directory structure/CMSparser') or any other packages
2. In the last line of the file, you need to put the key value pair for the new CMSParser package



##Tentative Schedule 


+ 6/10/14 Finish writing tests, start on demographics, get to the halfway point with demographics
  * Finished writing most tests, started on demographics. 
+ 6/11/14 Finish writing parser for demographics, start on Allergies
+ 6/12/14 STart on another section, try to finish it in a day
+ 6/13/14 Start on another section, try to finish it in a day

+At the end of the week, I should have testing finished and the parser parsing three sections almost perfectly.
	Then you might need to write tests over the weekend to make sure that is parsing correctly.

