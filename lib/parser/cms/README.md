

## CMS Parser for Blue Button



##Design Decisions Documentation 


Minimum number of dashes to separate section is four dashes.

Minimum number of newline characters to qualify as a space is 2-3 new lines, depending on where it is in the file.
It is usually three unless the child is at the end of the file.

CMS to Intermediate Data Object
	1. Needed very specific matching patterns for metadata and claims summary, which turned out to be very unique. 
	Other sections are parsed with a generic parsing function.
	2. For each section body, if a child has multiple keys with the exact same string, then the parser will start 
	assigning them numbers. 



## Current Sections 


BB.js model needs(Bolded are those that are not addressed in the Github site)
Unbolded ones are currently unimplemented but maybe mentioned in bluebutton.


**Emergency contacts, kind of pertains to advance directives. **
Implantable Devices -> Medical Equipment
family History
Preventive Services(future Appointments) -> Plan of Care?
Providers -> Payer?
Pharmacies
Medical Plans -> Plan of Care>
**Subsidies**
Primary and other Insurances -> Payer
**Claim Summary**

CMS → BB.js
Demographic -> Demographic(1)
Self-Reported Medical conditions -> Problems(2)
Self-Reported Allergies ->Allergies
Self-Reported Immunizations -> Immunizations
Self-Reported Labs and Tests -> Results
Self-Reported Vital Statistics -> Vitals
Drugs -> Medications


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
                              <--- this entire piece is referred to as the body
key: value 

key: value 

key: value <------ This is another child

key: value 

key: value 





-------------------------------- <--- dash usually indicates end of file

##Testing Plan##



#Testing backlog#


1. Test Unicode and ASCII, in addition to other text formats(if there are any)-> detection of ascii
2. Test when there are is no source -> need to indicate that there are no sources? Or should add something to indicate no sources?
3. Test if parser can tell which sections are missing -> more like an implementation
#Tests that must be passed for all files#

1. Check that there are no blank keys or values.(Done)
2. Object must exist and have type object.(Done)
3. Object must have the number of titles specified in the original test file.(Done)
4. There should be no empty keys in ANY object model.(Done)

#Text file specific test cases#

1. Test Empty sections(Done)
2. Test if parser is functional with missing sections(Done)
3. Test empty file(Done)
4. Test source, but no section(Done)
5. Test different number of dashes(Done)
6. Test the file when there is only one section(Done)
7. Test when there is two sections, one from the very beginning and one from the very end.(Done)
8. Test when there is only meta data(Done)





##Task Backlog ##


1. Write tests
	1.a. Check what elements/sections are in CMS.
	1.b. Check what matches and what doesn't match.
	1.c. Check what aremissing

2. Document intermediate model. Document which sections match and doesn't match. 


3. Work on parsing from the intermediate model to the actual bb model.
	Start with demographics.

4. Improve code flexibility
	4.a. abstract out matching from code.
		1. separate class for regular expressions.
		2. Detect the format of the text file(UTF-8, ascii), and make it be able to handle different text structures.


5. Putting proper codes for each medical term. May need to put uncoded tag. (
	Look at medical dictionaries/clinical vocabularies at bottom of CCDA pad)

6. Put a tag or some indicator to mark that the source is the CMS text file. 


7. Need to make sure that you don't have blank keys(Additinoal check). 

##Integration Notes

First, add a line that says: 
In /lib/parser.js,

1. add
	require('(directory structure/CMSparser') or any other packages
2. In the last line of the file, you need to put the key value pair for the new CMSParser package



##Tentative Schedule ##


*6/10/14 Finish writing tests, start on demographics, get to the halfway point with demographics
*6/11/14 Finish writing parser for demographics, start on Allergies
*6/12/14 STart on another section, try to finish it in a day
*6/13/14 Start on another section, try to finish it in a day

*At the end of the week, I should have testing finished and the parser parsing three sections almost perfectly.
	Then you might need to write tests over the weekend to make sure that is parsing correctly.

